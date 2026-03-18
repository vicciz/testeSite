export function encodeProductId(id: number | string): string {
  const raw = `p_${id}`;
  const base64 = toBase64(raw);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeProductCode(code: string): number | null {
  try {
    const normalized = code.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const raw = fromBase64(padded);
    if (!raw.startsWith('p_')) return null;
    const idStr = raw.slice(2);
    const id = Number(idStr);
    if (!Number.isFinite(id) || id <= 0) return null;
    return id;
  } catch {
    return null;
  }
}

function toBase64(value: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(value);
  }
  return Buffer.from(value, 'utf8').toString('base64');
}

function fromBase64(value: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(value);
  }
  return Buffer.from(value, 'base64').toString('utf8');
}
