import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (gunakan Redis di production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 menit
const RATE_LIMIT_MAX = 10; // 10 request per menit per IP

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  // Izinkan same-origin atau known origins
  if (!origin) return true; // non-browser requests (curl, etc)
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Too many requests." },
        { status: 429 }
      );
    }

    // Origin validation
    if (!validateOrigin(req)) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { subscription, userId } = body;

    if (!subscription || typeof subscription !== "object") {
      return NextResponse.json(
        { error: "Subscription payload is required" },
        { status: 400 }
      );
    }

    if (!subscription.endpoint || typeof subscription.endpoint !== "string") {
      return NextResponse.json(
        { error: "Subscription endpoint is required" },
        { status: 400 }
      );
    }

    // TODO: Persist ke database backend (Supabase/Prisma)
    // const { data: { user } } = await supabase.auth.getUser();
    // await db.pushSubscription.create({ ... });

    console.log("[Push Subscription Registered]", {
      userId: userId || "anonymous",
      endpoint: subscription.endpoint.slice(0, 80) + "...",
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "Push notification subscription registered successfully",
      registeredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Push Subscribe Error]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to register subscription",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // TODO: Hapus subscription dari database backend
    console.log("[Push Subscription Deleted]", {
      endpoint: endpoint.slice(0, 80) + "...",
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "Push notification subscription removed",
    });
  } catch (error) {
    console.error("[Push Unsubscribe Error]", error);
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 }
    );
  }
}