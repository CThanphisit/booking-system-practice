import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL!;

// ─── ดึง token จาก cookie ────────────────────────────────────────────────────
export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

// ─── Forward JSON request ไป NestJS ─────────────────────────────────────────
export async function proxy(
  path: string,
  options: RequestInit = {},
  requireAuth = true,
): Promise<NextResponse> {
  const token = await getToken();

  if (requireAuth && !token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

// ─── Forward multipart/form-data ─────────────────────────────────────────────
export async function proxyFormData(
  path: string,
  formData: FormData,
): Promise<NextResponse> {
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

// ─── Forward query string จาก request ───────────────────────────────────────
export function forwardQuery(req: NextRequest, path: string): string {
  const search = req.nextUrl.searchParams.toString();
  return search ? `${path}?${search}` : path;
}
