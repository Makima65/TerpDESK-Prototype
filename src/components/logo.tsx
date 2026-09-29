import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <Image
        src="/terpdesk-logo.webp"
        alt="terpDESK Logo"
        width={160}
        height={48}
        priority
        className="w-[140px] lg:w-[160px] h-auto object-contain"
      />
    </div>
  );
}
