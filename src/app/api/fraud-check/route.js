import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    const response = await fetch(
      "https://fraudbd.com/api/check-courier-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.FRAUDBD_API_KEY,
        },
        body: JSON.stringify({
          phone_number: phone,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}