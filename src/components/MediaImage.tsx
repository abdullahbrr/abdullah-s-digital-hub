import { type ImgHTMLAttributes } from "react";

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function MediaImage({ src, alt, ...props }: MediaImageProps) {
  return <img {...props} src={src} alt={alt ?? ""} />;
}