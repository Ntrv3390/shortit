import { connectToDB } from "@/db";
import Url from "@/models/url.models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDB();
    let query;

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { shortId: id }] };
    } else {
      query = { shortId: id };
    }
    const userUrls = await Url.findOne(query);

    if (!userUrls) {
      return NextResponse.json(
        {
          message: "Short Url doesn't exists.",
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

export async function PATCH(request, { params }) {
  const { redirectUrl, analytics } = await request.json()
  const { id } = params;

  try {
    await connectToDB();

    const updateFields = {};
    if (redirectUrl) {
      updateFields.redirectUrl = redirectUrl;
    }
    if (analytics) {
      updateFields.$push = { analytics };
      
    }
    let query;

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { shortId: id }] };
    } else {
      query = { shortId: id };
    }
    const updatedUrl = await Url.findOneAndUpdate(query, updateFields, {
      new: true,
    });

    if (!updatedUrl) {
      return NextResponse.json(
        { message: "URL not found", error: true },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { updatedUrl, message: "URL Updated Successfully", error: false },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while updating the url: ${error.message}`,
        error: true,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await connectToDB();
    const deletedUrl = await Url.findByIdAndDelete(id);

    if (!deletedUrl) {
      return NextResponse.json(
        { message: "URL not found", error: true },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { deletedUrl, message: "URL Deleted Successfully", error: false },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error while deleting the url: ${error.message}`,
        error: true,
      },
      { status: 500 }
    );
  }
}
