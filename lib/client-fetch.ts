// lib/client-fetch.ts
// ใช้ใน "use client" Component เท่านั้น

export async function clientFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  return res;
}
