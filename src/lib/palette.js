/**
 * Visual Rhyme brand palette — single source of truth.
 *
 * Import these constants for JSX inline color props (Three.js scene colors,
 * SVG stroke/fill, LogoIcon, etc.) where CSS custom properties can't reach.
 *
 * CSS side of the same palette lives at the top of src/App.css as
 * --brand, --brand-glow, --brand-deep, --brand-ink, --brand-void, plus
 * the --purple-50..950 scale (derived from --brand).
 */

// Canonical brand color — locked. #9D20D6.
export const BRAND = '#9D20D6';

// Lighter accent — used for glows, hover states, secondary emphasis.
export const BRAND_GLOW = '#BB50EE';

// Deeper accent — used for shadows, dark states, dark-on-light emphasis.
export const BRAND_DEEP = '#66138A';

// Near-black brand ink — for very dark accents against pure black.
export const BRAND_INK = '#170220';

// Absolute dark bg — the site's "off-black" for hero and modals.
export const BRAND_VOID = '#0A0010';

// Convenience tuples for common Three.js gradient pairs.
export const BRAND_TRIAD = [BRAND_DEEP, BRAND, BRAND_GLOW];
export const BRAND_PAIR  = [BRAND, BRAND_GLOW];
