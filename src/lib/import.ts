export async function readImage(
  file: File,
): Promise<{ src: string; width: number; height: number }> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type))
    throw new Error('Choose a PNG, JPEG, or WebP image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Please choose an image smaller than 20 MB.');
  const src = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('This file could not be read.'));
    r.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('This image could not be decoded.'));
    i.src = src;
  });
  if (image.width * image.height > 40_000_000)
    throw new Error('Please use an image below 40 megapixels.');
  return { src, width: image.width, height: image.height };
}
export async function downloadDataURL(data: string, filename: string) {
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}
