/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const originalFetch = window.fetch;

export function initApiInterceptor() {
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // Only intercept /api/ routes, excluding login, register, and healthcheck
    if (urlStr.startsWith('/api/') && !urlStr.startsWith('/api/login') && !urlStr.startsWith('/api/register') && !urlStr.startsWith('/api/health')) {
      const token = localStorage.getItem('devops_mentor_token');
      if (token) {
        const headers = new Headers(init?.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        
        init = {
          ...init,
          headers
        };
      }
    }

    try {
      const response = await originalFetch(input, init);
      
      // If 401 Unauthorized occurs on protected API requests, clear the credentials and notify the app
      if (response.status === 401 && urlStr.startsWith('/api/') && !urlStr.startsWith('/api/login') && !urlStr.startsWith('/api/register')) {
        localStorage.removeItem('devops_mentor_token');
        localStorage.removeItem('devops_mentor_username');
        window.dispatchEvent(new CustomEvent('devops_mentor_unauthorized'));
      }
      
      return response;
    } catch (error) {
      console.error('[API Interceptor] Fetch error:', error);
      throw error;
    }
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log('[API Interceptor] Successfully initialized window.fetch interception.');
  } catch (e) {
    console.warn('[API Interceptor] Failed to define window.fetch via Object.defineProperty. Falling back to direct assignment.', e);
    try {
      window.fetch = customFetch;
    } catch (err) {
      console.error('[API Interceptor] CRITICAL: Failed to override window.fetch entirely.', err);
    }
  }
}
