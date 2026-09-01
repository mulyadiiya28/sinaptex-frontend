import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, userId } = body;

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription payload is required" },
        { status: 400 }
      );
    }

    // Log or persist push subscription in backend database/store
    console.log("[Push Subscription Registered]", {
      userId: userId || "anonymous",
      endpoint: subscription.endpoint,
    });

    return NextResponse.json({
      success: true,
      message: "Push notification subscription registered successfully",
      registeredAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to register subscription",
      },
      { status: 500 }
    );
  }
}
