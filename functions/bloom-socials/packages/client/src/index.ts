import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { uploadImage } from "./api/image.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const imagePath = path.join(__dirname, "../testdata/input.jpg");
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  const result = await uploadImage("input.jpg", blob).catch((e) => {
    console.error("Error uploading image:", e);
    return null;
  });
  if (!result) {
    console.error("Upload failed");
    return null;
  }

  console.log("Upload successful:", result);
  return result;
}

await main().catch(console.error);
