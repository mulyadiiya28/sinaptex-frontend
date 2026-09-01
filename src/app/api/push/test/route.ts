import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      title = "Sinaptex — Mitra Baru Ditemukan!",
      body: messageBody = "Sistem matching menemukan 3 partner bisnis potensial dengan skor kecocokan 95%.",
      url = "/marketplace",
    } = body;

    return NextResponse.json({
      success: true,
      notification: {
        title,
        body: messageBody,
        url,
        icon: "/icons/icon-192x192.svg",
        badge: "/icons/badge-72x72.svg",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process test push notification",
      },
      { status: 500 }
    );
  }
}
