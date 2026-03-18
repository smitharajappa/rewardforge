import React from 'react';

export const LogoMark = React.forwardRef<SVGSVGElement, { size?: number }>(
  ({ size = 36 }, ref) => (
    <svg ref={ref} width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="36,4 66,20 66,52 36,68 6,52 6,20" fill="#071020" stroke="#38bdf8" strokeWidth="2.5"/>
      <polygon points="36,12 60,24 60,48 36,60 12,48 12,24" fill="#050d1a" stroke="rgba(56,189,248,0.25)" strokeWidth="1"/>
      <polyline points="14,52 26,40 36,44 46,28 58,16" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="58" cy="16" r="4" fill="#38bdf8"/>
      <circle cx="46" cy="28" r="2.5" fill="#38bdf8" opacity="0.6"/>
      <circle cx="36" cy="44" r="2.5" fill="#f472b6" opacity="0.6"/>
      <circle cx="26" cy="40" r="2.5" fill="#34d399" opacity="0.5"/>
      <circle cx="14" cy="52" r="2.5" fill="#38bdf8" opacity="0.4"/>
    </svg>
  )
);
LogoMark.displayName = 'LogoMark';

export function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
  return (
    <span className={`font-syne ${cls} tracking-tight`}>
      <span style={{ color: '#38bdf8', fontWeight: 800 }}>Reward</span>
      <span style={{ color: '#fafafa', fontWeight: 400 }}>Forge</span>
    </span>
  );
}
