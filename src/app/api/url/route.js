import { connectToDB } from "@/db";
import Url from "@/models/url.models";
import generateShortId from "@/lib/generateShortId";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { uri, userId } = await request.json();
    await connectToDB();

    const shortId = await generateShortId();
    const newUrl = new Url({
      shortId,
      redirectUrl: uri,
      createdBy: userId,
    });

    await newUrl.save();

    return NextResponse.json(
      {
        newUrl,
        message: "Short url created successfully.",
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

export async function GET(request) {
  try {
    const params = request.nextUrl.searchParams;
    const userId = params.get("userId");
    await connectToDB();

    const userUrls = await Url.find({ createdBy: userId }).lean().exec();

    if (!userUrls || userUrls.length === 0) {
      return NextResponse.json(
        {
          message: "No URLs exist for this user",
          error: true,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        userUrls,
        message: "URL fetched successfully.",
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
