import fs from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Saves a file to the public/uploads directory
 * @param file The file to save
 * @returns The public URL of the saved file
 */
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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename with random suffix to avoid collisions
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "");
    const filename = `${Date.now()}-${randomSuffix}-${cleanFileName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

/**
 * Deletes a file from the public directory
 * @param url The public URL of the file to delete (e.g., /uploads/image.jpg)
 */
export async function deleteImage(url: string | null): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) return;

  try {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.access(filePath); // Check if file exists
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist or other error, we just log it
    console.warn(`Could not delete image at ${url}:`, error);
  }
}
