import type { MediaType } from '../types/media';

/**
 * Generates an inline SVG data URI as a stylish fallback poster.
 * Uses a deterministic gradient based on the title and media type.
 */
export function getPlaceholderPoster(title: string, type: MediaType, genre?: string): string {
  // Compute simple hash for color variation
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palettes = type === 'Anime' ? [
    ['#831843', '#be185d', '#f43f5e'], // Pink/Rose
    ['#4c1d95', '#6d28d9', '#c084fc'], // Purple
    ['#064e3b', '#059669', '#34d399'], // Emerald
    ['#1e1b4b', '#4338ca', '#818cf8'], // Indigo
  ] : type === 'Series' ? [
    ['#064e3b', '#047857', '#10b981'], // Emerald/Green
    ['#134e4a', '#0f766e', '#14b8a6'], // Teal/Cyan
    ['#312e81', '#4338ca', '#6366f1'], // Indigo
    ['#701a75', '#86198f', '#d946ef'], // Fuchsia
  ] : [
    ['#0f172a', '#1e293b', '#38bdf8'], // Slate/Sky
    ['#451a03', '#9a3412', '#fb923c'], // Amber/Orange
    ['#18181b', '#27272a', '#a1a1aa'], // Zinc
    ['#14532d', '#15803d', '#4ade80'], // Forest
  ];

  const paletteIndex = Math.abs(hash) % palettes.length;
  const [c1, c2, c3] = palettes[paletteIndex];

  // Title monogram (first 2 words first letter, or first 2 chars)
  const words = title.trim().split(/\s+/);
  const initials = words.length > 1 
    ? (words[0][0] + words[1][0]).toUpperCase() 
    : title.substring(0, 2).toUpperCase();

  const primaryGenre = genre || (type === 'Anime' ? 'ANIME' : 'CINEMA');
  const safeTitle = escapeXml(title.length > 25 ? title.substring(0, 23) + '...' : title);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="50%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c3}" />
      </linearGradient>
      <radialGradient id="r_${Math.abs(hash)}" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.75" />
      </radialGradient>
    </defs>
    <rect width="300" height="450" fill="url(#g_${Math.abs(hash)})" />
    <rect width="300" height="450" fill="url(#r_${Math.abs(hash)})" />
    
    <!-- Pattern lines -->
    <g stroke="rgba(255,255,255,0.06)" stroke-width="1.5">
      <line x1="20" y1="20" x2="280" y2="20" />
      <line x1="20" y1="430" x2="280" y2="430" />
      <circle cx="150" cy="190" r="75" fill="none" stroke-dasharray="4,4" />
    </g>

    <!-- Type Tag badge -->
    <rect x="25" y="35" width="${type === 'Anime' ? 70 : type === 'Series' ? 74 : 65}" height="24" rx="12" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.2)" />
    <text x="${type === 'Anime' ? 60 : type === 'Series' ? 62 : 57}" y="51" fill="#ffffff" font-size="11" font-weight="700" font-family="system-ui, sans-serif" text-anchor="middle" letter-spacing="1">
      ${type.toUpperCase()}
    </text>

    <!-- Big Center Monogram -->
    <circle cx="150" cy="190" r="54" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
    <text x="150" y="206" fill="#ffffff" font-size="42" font-weight="900" font-family="system-ui, sans-serif" text-anchor="middle" letter-spacing="2">
      ${escapeXml(initials)}
    </text>

    <!-- Bottom info container -->
    <rect x="0" y="340" width="300" height="110" fill="rgba(0,0,0,0.6)" />
    <text x="150" y="375" fill="#e2e8f0" font-size="15" font-weight="700" font-family="system-ui, sans-serif" text-anchor="middle">
      ${safeTitle}
    </text>
    <text x="150" y="402" fill="rgba(255,255,255,0.6)" font-size="11" font-weight="500" font-family="system-ui, sans-serif" text-anchor="middle" letter-spacing="2">
      ${escapeXml(primaryGenre.toUpperCase())}
    </text>
  </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
