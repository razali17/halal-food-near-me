require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

// === CONFIGURATION ===
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/halalfood";

const B2_KEY_ID = "0056b8b034751c70000000003";
const B2_APP_KEY = "K005xcP+RRiEp/Jmcy8tHzyWEu2WAkg";
const B2_BUCKET = "halal-restaurant-images";
const B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com";

if (!B2_KEY_ID || !B2_APP_KEY) {
    console.error("Please set B2_KEY_ID and B2_APP_KEY in your environment.");
    process.exit(1);
}

// Debug logging (masked for security)
console.log("B2 Configuration:");
console.log(
    "  Key ID:",
    B2_KEY_ID ? `${B2_KEY_ID.substring(0, 8)}...` : "NOT SET"
);
console.log(
    "  App Key:",
    B2_APP_KEY ? `${B2_APP_KEY.substring(0, 8)}...` : "NOT SET"
);
console.log("  Bucket:", B2_BUCKET);
console.log("  Endpoint:", B2_ENDPOINT);
console.log("  Using environment variables:", {
    B2_KEY_ID: !!process.env.B2_KEY_ID,
    B2_APP_KEY: !!process.env.B2_APP_KEY,
    B2_BUCKET: !!process.env.B2_BUCKET,
    B2_ENDPOINT: !!process.env.B2_ENDPOINT,
});

let b2AuthData = null; // Will store { apiUrl, authToken, accountId, bucketId }

async function authorizeB2() {
    if (b2AuthData) {
        return b2AuthData;
    }

    console.log("Authorizing B2 account...");
    try {
        const authResponse = await axios.get(
            "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
            {
                auth: { username: B2_KEY_ID, password: B2_APP_KEY },
            }
        );

        const { apiUrl, authorizationToken, accountId, allowed } =
            authResponse.data;
        console.log("Authorization successful.");
        console.log(
            "Full auth response 'allowed' object:",
            JSON.stringify(allowed, null, 2)
        );

        let bucketId;

        // Strategy 1: Use bucketId from 'allowed' if key is restricted
        if (allowed && allowed.bucketId) {
            console.log(
                `Application key seems to be restricted to bucket: ${allowed.bucketName}`
            );
            if (allowed.bucketName !== B2_BUCKET) {
                throw new Error(
                    `Key is restricted to bucket '${allowed.bucketName}', but script is configured for bucket '${B2_BUCKET}'. Please check your B2_BUCKET env var or your key settings.`
                );
            }
            console.log(
                `Using bucketId '${allowed.bucketId}' from authorization response.`
            );
            bucketId = allowed.bucketId;
        } else {
            // Strategy 2: List buckets to find the ID (for non-restricted keys)
            console.log(
                "Application key is not restricted to a single bucket. Listing buckets to find ID..."
            );
            try {
                const listBucketsResponse = await axios.post(
                    `${apiUrl}/b2api/v2/b2_list_buckets`,
                    { accountId: accountId },
                    { headers: { Authorization: authorizationToken } }
                );
                const bucket = listBucketsResponse.data.buckets.find(
                    (b) => b.bucketName === B2_BUCKET
                );
                if (!bucket) {
                    throw new Error(
                        `Bucket '${B2_BUCKET}' not found in account.`
                    );
                }
                console.log(
                    `Found bucket '${B2_BUCKET}' with ID '${bucket.bucketId}'.`
                );
                bucketId = bucket.bucketId;
            } catch (listErr) {
                console.error(
                    "Fatal: Failed to list buckets.",
                    listErr.message
                );
                if (listErr.response) {
                    console.error("Response data:", listErr.response.data);
                }
                throw listErr; // Re-throw to be caught by outer try/catch
            }
        }

        b2AuthData = {
            apiUrl,
            authToken: authorizationToken,
            accountId,
            bucketId,
        };
        return b2AuthData;
    } catch (authErr) {
        console.error(
            "❌ Fatal Error during B2 Authorization:",
            authErr.message
        );
        if (authErr.response) {
            console.error("Response Status:", authErr.response.status);
            console.error("Response Data:", authErr.response.data);
            if (authErr.response.status === 401) {
                console.error(
                    "This is an authorization failure. Please check that your B2_KEY_ID and B2_APP_KEY are correct and have not expired."
                );
            }
        }
        throw authErr;
    }
}

async function uploadToB2(buffer, key, contentType) {
    try {
        // Auth data should be pre-fetched by testB2Connection() called in main()
        const { apiUrl, bucketId, authToken } = b2AuthData;

        // Get upload URL
        const uploadUrlResponse = await axios.post(
            `${apiUrl}/b2api/v2/b2_get_upload_url`,
            {
                bucketId: bucketId,
            },
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );

        const uploadUrl = uploadUrlResponse.data.uploadUrl;
        const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

        // Upload the file
        await axios.post(uploadUrl, buffer, {
            headers: {
                Authorization: uploadAuthToken,
                "Content-Type": contentType,
                "Content-Length": buffer.length,
                "X-Bz-File-Name": key,
                "X-Bz-Content-Sha1": require("crypto")
                    .createHash("sha1")
                    .update(buffer)
                    .digest("hex"),
            },
        });

        console.log(`Uploaded: ${key}`);
        return true;
    } catch (err) {
        console.warn(`Failed to upload ${key}: ${err.message}`);
        if (err.response) {
            console.warn(`Response status: ${err.response.status}`);
            console.warn(`Response data:`, err.response.data);
        }
        return false;
    }
}

async function downloadImage(url) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 10000,
        });
        return {
            buffer: response.data,
            contentType: response.headers["content-type"] || "image/jpeg",
        };
    } catch (err) {
        console.warn(`Failed to download ${url}: ${err.message}`);
        return null;
    }
}

const STATE_FILE_PATH = path.join(__dirname, "upload-state.json");

// Function to read the list of completed IDs from the state file
function getCompletedIds() {
    try {
        if (fs.existsSync(STATE_FILE_PATH)) {
            const data = fs.readFileSync(STATE_FILE_PATH, "utf8");
            const parsedData = JSON.parse(data);
            // Ensure we return a Set for consistent .has() method
            return new Set(Array.isArray(parsedData) ? parsedData : []);
        }
    } catch (err) {
        console.warn(
            "Could not read or parse state file, starting from scratch.",
            err.message
        );
    }
    return new Set();
}

// Function to add a completed ID to the state file
function addCompletedId(id) {
    try {
        const completedIds = getCompletedIds();
        completedIds.add(id);
        fs.writeFileSync(
            STATE_FILE_PATH,
            JSON.stringify(Array.from(completedIds)),
            "utf8"
        );
    } catch (err) {
        console.error(`Failed to write to state file for ID: ${id}`, err);
    }
}

async function testB2Connection() {
    try {
        console.log("Testing B2 connection and authorization...");
        await authorizeB2();
        console.log("✅ B2 connection and authorization successful!");
        return true;
    } catch (err) {
        console.error("❌ B2 connection test failed.");
        // Error is already logged in detail by authorizeB2
        return false;
    }
}

async function main() {
    const country = process.argv[2] || process.env.COUNTRY;
    if (!country) {
        console.error(
            "Please specify a country as a parameter or set COUNTRY env variable."
        );
        process.exit(1);
    }
    console.log(`Starting image upload for country: ${country}`);

    // Test B2 connection first
    const b2Test = await testB2Connection();
    if (!b2Test) {
        console.error(
            "B2 connection failed. Please check your credentials and bucket settings."
        );
        process.exit(1);
    }

    const completedIds = getCompletedIds();
    console.log(
        `Found ${completedIds.size} previously completed uploads. They will be skipped.`
    );

    await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
    });
    console.log("Connected to MongoDB");

    const restaurants = await Restaurant.find(
        { country, photo: { $exists: true, $ne: "" } },
        { _id: 1, photo: 1 }
    ).lean();
    console.log(
        `Found ${restaurants.length} total restaurants with images for ${country}.`
    );

    let processedInThisRun = 0;
    let skippedCount = 0;

    for (const r of restaurants) {
        const restaurantId = r._id.toString();
        if (completedIds.has(restaurantId)) {
            skippedCount++;
            continue;
        }

        if (!r.photo || !/^https?:\/\//.test(r.photo)) {
            console.log(`Skipping ${restaurantId}: no valid photo URL.`);
            addCompletedId(restaurantId); // Also log as "done" so we don't re-check
            continue;
        }

        const ext = path.extname(r.photo.split("?")[0]) || ".jpg";
        const key = `restaurants/${restaurantId}${ext}`;

        console.log(`\n--- Processing restaurant: ${restaurantId} ---`);
        console.log(`Downloading image from ${r.photo}`);
        const img = await downloadImage(r.photo);

        if (!img) {
            console.warn(
                `Skipping ${restaurantId}: Failed to download image. Will retry on next run.`
            );
            continue;
        }

        console.log(`Uploading image to B2 as ${key}`);
        const uploaded = await uploadToB2(img.buffer, key, img.contentType);

        if (uploaded) {
            const newUrl = `https://f004.backblazeb2.com/file/${B2_BUCKET}/${key}`;
            await Restaurant.updateOne(
                { _id: r._id },
                { $set: { photo: newUrl } }
            );
            console.log(`Updated DB for ${restaurantId} with new photo URL.`);
            addCompletedId(restaurantId);
            console.log(
                `✅ Successfully processed and logged ${restaurantId}.`
            );
        } else {
            console.error(
                `❌ Failed to upload image for ${restaurantId}. Will retry on next run.`
            );
        }
        processedInThisRun++;
    }

    console.log("\n--- Upload Complete ---");
    console.log(
        `Skipped ${skippedCount} restaurants that were already processed.`
    );
    console.log(
        `Attempted to process ${processedInThisRun} new restaurants in this run.`
    );
    await mongoose.disconnect();
    console.log("Done!");
}

main();
