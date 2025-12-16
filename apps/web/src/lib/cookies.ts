/**
 * Cookie utilities for token management
 * Works on both client and server side
 */

export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string) {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Save authentication tokens
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  // Save to localStorage for API client
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  }

  // Save to cookies for middleware (30 days for access, 7 days for refresh)
  setCookie(TOKEN_KEYS.ACCESS, accessToken, 30);
  setCookie(TOKEN_KEYS.REFRESH, refreshToken, 7);
}

/**
 * Clear authentication tokens
 */
export function clearTokens() {
  // Clear from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  }

  // Clear from cookies
  deleteCookie(TOKEN_KEYS.ACCESS);
  deleteCookie(TOKEN_KEYS.REFRESH);
}

/**
 * Check if user has valid token
 */
export function hasValidToken(): boolean {
  if (typeof window === 'undefined') return false;

  const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS) || getCookie(TOKEN_KEYS.ACCESS);
  return !!accessToken;
}
