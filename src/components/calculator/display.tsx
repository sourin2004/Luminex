'use client';

import * as React from 'react';

interface DisplayProps {
  value: string;
  history: string;
  mode: string;
  isScientific: boolean;
}

const Display = ({ value, history, mode, isScientific }: DisplayProps) => {
  const [displayFontSize, setDisplayFontSize] = React.useState(64);
  const displayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (displayRef.current) {
      const parentWidth = displayRef.current.offsetWidth;
      // Temporarily create a span to measure text width without affecting layout
      const span = document.createElement('span');
      span.style.fontSize = '64px';
      span.style.fontFamily = 'Space Grotesk, sans-serif';
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.innerText = value;
      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      if (textWidth > parentWidth - 40) {
        // Shrink font size if text overflows
        const newSize = Math.max(24, (64 * (parentWidth - 40)) / textWidth);
        setDisplayFontSize(newSize);
      } else {
        setDisplayFontSize(64);
      }
    }
  }, [value]);

  return (
    <div ref={displayRef} className="relative bg-black/30 rounded-xl px-6 py-4 text-right overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5),_inset_0_0_10px_rgba(0,0,0,0.5)] h-32 flex flex-col justify-end">
        <div className="absolute top-2 left-4 text-accent text-xs uppercase font-mono tracking-widest opacity-70">
            {isScientific && <span>{mode}</span>}
        </div>
        <div className="absolute top-3 right-5 text-muted-foreground text-lg truncate max-w-[calc(100%-70px)]">
            {history}
        </div>
      <div
        className="font-light text-primary break-all"
        style={{
          fontSize: `${displayFontSize}px`,
          lineHeight: 1.1,
          textShadow: '0 0 2px hsl(var(--primary)), 0 0 8px hsl(var(--primary)), 0 0 15px hsl(var(--primary)/0.7)',
          transition: 'font-size 0.2s ease-in-out',
        }}
      >
        {value || '0'}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none rounded-b-xl" aria-hidden="true" />
    </div>
  );
};

export default Display;
