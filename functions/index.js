/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

exports.sendImageToFlask = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name;
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    const [fileMetadata] = await file.getMetadata();
    const imageName = fileMetadata.metadata.imageName || "Unknown";
    const userID = fileMetadata.metadata.userID || "Unknown";

    const fileBuffer = await file.download();
    const base64Image = fileBuffer[0].toString("base64");
    const imageUri = `data:image/jpeg;base64,${base64Image}`;

    const formData = new URLSearchParams();
    formData.append("image", imageUri);
    formData.append("name", imageName);
    formData.append("userID", userID);
    formData.append("imageStorageName", filePath);

    try {
        const flaskResponse = await fetch("https://clever-snail-preferably.ngrok-free.app/upload", {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (!flaskResponse.ok) {
            throw new Error("Failed to send image to Flask server");
        }

        console.log("Image successfully sent to Flask server");
    } catch (error) {
        console.error("Error sending image to Flask:", error);
    }
});
