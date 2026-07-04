import { useEffect, useState, type ImgHTMLAttributes } from "react";

function isHeicUrl(src: string) {
  return /\.(heic|heif)(?:$|[?#])/i.test(src);
}

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function MediaImage({ src, alt, ...props }: MediaImageProps) {
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setDisplaySrc(src);

    if (!isHeicUrl(src)) return undefined;

    async function convertHeic() {
      try {
        const [{ default: heic2any }, response] = await Promise.all([
          import("heic2any"),
          fetch(src),
        ]);
        if (!response.ok) throw new Error("Image not found");
        const sourceBlob = await response.blob();
        const converted = await heic2any({ blob: sourceBlob, toType: "image/jpeg", quality: 0.9 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setDisplaySrc(objectUrl);
      } catch {
        if (!cancelled) setDisplaySrc(src);
      }
    }

    convertHeic();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return <img {...props} src={displaySrc} alt={alt ?? ""} />;
}