function isHeicFile(file: File) {
  return /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
}

export async function prepareImageFile(file: File): Promise<File> {
  if (isHeicFile(file)) {
    throw new Error("HEIC photos are not supported by browsers. Please upload JPG, PNG, WebP, or GIF.");
  }
  return file;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}