// apiFetch utility to automatically add JWT token from localStorage
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('narayanji_auth');
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
} 