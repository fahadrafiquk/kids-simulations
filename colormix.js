function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex) {
  return rgbToHsl(...hexToRgb(hex));
}

function hslToHex(h, s, l) {
  return rgbToHex(...hslToRgb(h, s, l));
}

/**
 * Mix two hex colors by finding the geometric midpoint
 * in HSL polar space (hue = angle, saturation = radius).
 * The midpoint coordinate maps to a real color already
 * living in the color space — no rules, pure math.
 *
 * @param {string} hexA - e.g. "#dc3232"
 * @param {string} hexB - e.g. "#3250dc"
 * @returns {string} hex of the mixed color
 */
function mixColors(hexA, hexB) {
  const [h1, s1, l1] = hexToHsl(hexA);
  const [h2, s2, l2] = hexToHsl(hexB);

  // Shortest path around the hue circle
  let dh = h2 - h1;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;

  const h = (h1 + dh / 2 + 360) % 360;
  const s = (s1 + s2) / 2;
  const l = (l1 + l2) / 2;

  return hslToHex(Math.round(h), Math.round(s), Math.round(l));
}

// ─── Demo ────────────────────────────────────────────────────────────────────

const red    = '#dc3232';
const blue   = '#3250dc';
const yellow = '#dccc32';

const redBlue    = mixColors(red, blue);       // purple-ish
const redYellow  = mixColors(red, yellow);     // orange-ish
const blueYellow = mixColors(blue, yellow);    // green-ish
const allThree   = mixColors(redBlue, yellow); // further mix

console.log('red + blue    =>', redBlue);
console.log('red + yellow  =>', redYellow);
console.log('blue + yellow =>', blueYellow);
console.log('(red+blue) + yellow =>', allThree);

// Recursive: mix the result back in again
const deeper = mixColors(allThree, red);
console.log('((red+blue)+yellow) + red =>', deeper);

module.exports = { mixColors, hexToHsl, hslToHex, hexToRgb, rgbToHex, hslToRgb, rgbToHsl };
