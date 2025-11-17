import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const goal = formData.get("goal");
  const message = formData.get("message");

  // In a real production app, you would store this in a database
  // or send it to a CRM/email provider (e.g. via Resend, SendGrid, etc.).
  console.log("New contact submission", {
    name,
    email,
    goal,
    message,
  });

  return NextResponse.redirect("/thank-you", { status: 303 });
}
