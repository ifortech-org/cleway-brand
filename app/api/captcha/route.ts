export async function POST(request: Request) {
  const { token } = await request.json();
  const hcaptchaSecretKey = process.env.HCAPTCHA_SECRET_KEY;

  if (!hcaptchaSecretKey) {
    return new Response("Missing HCAPTCHA_SECRET_KEY", { status: 500 });
  }

  if (!token) {
    return new Response("Missing captcha token", { status: 400 });
  }

  // Google expects application/x-www-form-urlencoded
  const body = new URLSearchParams({
    secret: hcaptchaSecretKey,
    response: token,
  });

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const resData = await response.json();

  if (resData.success) {
    return new Response("success!", { status: 200 });
  }

  return new Response("Failed Captcha", { status: 400 });
}
