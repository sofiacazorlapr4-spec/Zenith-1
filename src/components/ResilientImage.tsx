import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { FinishId } from '../types/zenith';

export function ResilientImage({
  src,
  alt,
  className,
  dataFinish,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  dataFinish?: FinishId;
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`img-fallback ${className ?? ''}`} role="img" aria-label={alt}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="7" y="3" width="18" height="26" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="24" r="1.2" fill="currentColor" />
        </svg>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      data-finish={dataFinish}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
