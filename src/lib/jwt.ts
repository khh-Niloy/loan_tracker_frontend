/**
 * JWT decoding utility that works in browser environment
 * Since jsonwebtoken is primarily for Node.js, we use manual base64 decoding for frontend
 */

interface JWTPayload {
  user?: {
    name: string;
    phoneNumber: string;
  };
  name?: string;
  phoneNumber?: string;
  sub?: string;
  [key: string]: any;
}

export function decodeJWT(token: string): { name: string; phoneNumber: string } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded: JWTPayload = JSON.parse(jsonPayload);
    // console.log('JWT Decoded:', decoded);
    
    // Handle various JWT formats
    if (decoded.user) {
      return decoded.user;
    }
    if (decoded.name && decoded.phoneNumber) {
      return { name: decoded.name, phoneNumber: decoded.phoneNumber };
    }
    if (decoded.name && decoded.sub) {
      return { name: decoded.name, phoneNumber: decoded.sub };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}