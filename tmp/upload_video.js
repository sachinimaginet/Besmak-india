const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');
require('dotenv').config();

async function uploadFile() {
    const filePath = "C:\\Users\\HP\\Downloads\\Besmak Ai video.mp4";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
        console.error("BLOB_READ_WRITE_TOKEN is missing in .env");
        process.exit(1);
    }

    try {
        console.log(`Starting upload for: ${filePath}`);
        const fileBuffer = fs.readFileSync(filePath);
        const filename = path.basename(filePath);

        const blob = await put(filename, fileBuffer, {
            access: 'public',
            token: blobToken
        });

        console.log("Upload successful!");
        console.log("URL:", blob.url);

        // Optional: Print SQL to insert into media table
        console.log("\nSQL to insert into media table:");
        const id = require('crypto').randomUUID();
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(`INSERT INTO media (id, url, filename, contentType, size, createdAt, updatedAt) VALUES ('${id}', '${blob.url}', '${filename}', '${blob.contentType}', ${fileBuffer.length}, '${now}', '${now}');`);

    } catch (error) {
        console.error("Upload failed:", error);
        process.exit(1);
    }
}

uploadFile();
