export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
}

// Origin the API is served from, without the /api/v1 suffix — used to resolve
// file paths (e.g. task attachments) that the API returns as server-relative URLs.
export const ASSET_BASE_URL = API_CONFIG.baseURL.replace(/\/api\/v1\/?$/, '')
