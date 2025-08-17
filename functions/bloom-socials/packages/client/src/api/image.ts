const SERVER_URL = process.env.SERVER_URL || "http://localhost:8787";

export async function uploadImage(filename: string, blob: Blob) {
  const formData = new FormData();
  formData.append("image", blob, filename);

  const response = await fetch(`${SERVER_URL}/api/v1/posts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
