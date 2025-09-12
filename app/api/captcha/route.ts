import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  const secretKey = process.env.CAPTCHA_SECRET_KEY;

  const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

  const formData = new URLSearchParams();
  formData.append("secret", secretKey!);
  formData.append("response", token);

  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Captcha verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
