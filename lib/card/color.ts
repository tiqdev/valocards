const toHsl = (hex: string): [number, number, number] => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) / 6
      : max === g
        ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6;

  return [h, s, l];
};

const toHex = (h: number, s: number, l: number) => {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

export const withAlpha = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Ajanların API'deki renkleri koyu tonlarda; kart üzerinde aksan olarak
 * okunabilmesi için tonu koruyup doygunluk ve parlaklığı yükseltir.
 */
export const toAccentColor = (hex: string) => {
  const [h, s, l] = toHsl(hex);
  return toHex(h, Math.max(s, 0.55), Math.max(l, 0.6));
};
