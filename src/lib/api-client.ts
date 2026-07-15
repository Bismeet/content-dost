export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // SameSite cookies are transmitted when credentials is set to include
    credentials: 'include',
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    // If unauthorized, redirect to admin login if not already there
    if (!window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  // Handle case where response is not JSON (e.g. CSV download, plain text error)
  const contentType = response.headers.get('content-type');
  let data: any = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else if (contentType && contentType.includes('text/csv')) {
    return (await response.text()) as unknown as T;
  } else {
    // Plain text or HTML response (e.g. Vercel crash response)
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `API request failed with status ${response.status}`);
    }
    return text as unknown as T;
  }

  if (!response.ok) {
    const errorMsg = data?.message || `API request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    (err as any).details = data?.details;
    throw err;
  }

  return data as T;
}
