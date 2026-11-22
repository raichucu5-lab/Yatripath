const API_BASE="http://127.0.0.1:8000"
async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(API_BASE + path, { method, headers, body: body && JSON.stringify(body) });
   if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}