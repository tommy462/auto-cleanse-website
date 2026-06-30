import { FALLBACK_COVER_IMAGE } from '../lib/blog';

interface BlogImageProps {
  src?: string;
  /** Required - accessibility never depends on the image source. */
  alt: string;
  /** Intrinsic dimensions reserve space and prevent layout shift (CLS). */
  width?: number;
  height?: number;
  className?: string;
  /** Above-the-fold cover loads eagerly; everything else lazy-loads. */
  priority?: boolean;
}

export default function BlogImage({
  src,
  alt,
  width = 1200,
  height = 675,
  className = '',
  priority = false,
}: BlogImageProps) {
  return (
    <img
      src={src || FALLBACK_COVER_IMAGE}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  );
}
