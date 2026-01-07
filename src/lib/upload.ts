import { put, del } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Tipe file tidak didukung. Harap unggah gambar (JPG, PNG, WEBP, atau GIF).");
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file terlalu besar. Maksimal 10MB.");
  }

  try {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "");
    const filename = `${Date.now()}-${randomSuffix}-${cleanFileName}`;

    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return blob.url;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

export async function deleteImage(url: string | null): Promise<void> {
  try {
    if (!url) return;
    await del(url);
  } catch (error) {
    console.warn(`Could not delete image at ${url}:`, error);
  }
}
