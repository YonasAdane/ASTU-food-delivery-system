import { getTokenFromCookie } from "./auth";
import { decodeJwt } from "./jwt";

interface ApiClientConfig {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  endpoint: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
  token?: string | null; 
  fetchOptions?: RequestInit;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
  responseType?: 'json' | 'blob' | 'text';
}

export async function apiClient<T>(config: ApiClientConfig): Promise<T> {
  const { method, endpoint, query = {}, body, fetchOptions, cache } = config;

  const token = await getTokenFromCookie() as string;
  
  // Construct query string
  const queryString = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryString.append(key, String(value));
    }
  });

  // Construct URL
  const url = new URL(
    `${process.env.API_URL}${endpoint}${queryString.toString() ? `?${queryString}` : ''}`
  );
  console.log("Prepared url: ", url);

  // Prepare headers
  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions?.headers instanceof Headers
      ? Object.fromEntries(fetchOptions.headers.entries())
      : (fetchOptions?.headers as Record<string, string>)),
  };

  let requestBody = body;
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    // Let browser set Content-Type for FormData
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  // Make the request
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: requestBody,
    ...fetchOptions,
    ...(config.next ? { next: config.next } : {}),
    ...(cache ? { cache } : {}),
  });

  // Clone the response for later use
  const responseClone = response.clone();

  // Handle errors
  if (!response.ok) {
    let errorText = response.statusText;

    if (response.status >= 500) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('text/html')) {
        // Read the body only once using the clone
        const htmlBody = await responseClone.text();

        // Use regex to extract the title from the <title> tag
        const titleMatch = htmlBody.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1]) {
          // Extract the error message after the " | " symbol
          const errorMessage = titleMatch[1].split('|')[1]?.trim();
          if (errorMessage) {
            errorText = `Server Error ${errorMessage}`; // "522: Connection timed out"
          } else {
            errorText = 'Server Error';
          }
        } else {
          errorText = 'Server Error';
        }
      } else {
        // If the content is not HTML, just use the status text
        errorText = response.statusText;
      }
    }

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        // Use the original response to get JSON
        const json = await response.json();
        errorText = json.message || json.error || 'Unknown error message';
      } else if (contentType?.includes('text/plain')) {
        // Use the cloned response to get plain text
        errorText = await responseClone.text();
      }

      console.log("errorText: ", errorText);
    } catch (err) {
      console.error('Error parsing error response:', err);
    }

    // Handle token expiration
    const tokenError = await handleTokenExpiration(
      new Error(errorText),
      token
    );

    if (tokenError?.expired) {
      throw new Error(
        `Session expired at ${tokenError?.expiredAt?.toLocaleString()}`
      );
    }

    throw new Error(tokenError?.message || errorText);
  }

  switch (config.responseType) {
  case 'blob':
    return response.blob() as Promise<T>;
  case 'text':
    return response.text() as Promise<T>;
  default:
    return response.json() as Promise<T>;
}

}
async function handleTokenExpiration(error: Error, token?: string) {
  if (error.message.includes('401')) {
    if (!token) return { expired: false, message: 'Not authenticated' };

    const payload = decodeJwt(token);
    if (!payload) return { expired: false, message: 'Invalid token' };

    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const buffer = 30000; // 30-second buffer

    return {
      expired: expirationTime < currentTime - buffer,
      expiredAt: new Date(expirationTime),
      message: expirationTime < currentTime - buffer 
        ? 'Session expired' 
        : 'Invalid session'
    };
  }
  return null;
}
