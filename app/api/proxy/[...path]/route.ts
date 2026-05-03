import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const BACKEND_URL = "https://backend-booking-system-practice.onrender.com";
// const BACKEND_URL = "http://localhost:3001";

async function handler(req: NextRequest, context: any) {
  const { path } = await context.params;
  const joinedPath = path.join("/");

  const headerList = await headers();
  const cookie = headerList.get("cookie") || "";

  console.log("forward cookie:", cookie);

  const res = await fetch(`${BACKEND_URL}/${joinedPath}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
  });

  const response = new NextResponse(await res.text(), {
    status: res.status,
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
