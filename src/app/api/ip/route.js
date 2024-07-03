import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const response = await fetch("http://ip-api.com/json");
    const data = await response.json();
    return NextResponse.json(
      {
        data,
        error: false,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, error: true },
      { status: 500 }
    );
  }
}
