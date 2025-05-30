// apiFetch utility to automatically add JWT token from localStorage
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('narayanji_auth');
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  let url = input as string;
  if (url.startsWith('/api')) {
    url = import.meta.env.VITE_API_BASE_URL + url;
  }
  return fetch(url, { ...init, headers });
} 