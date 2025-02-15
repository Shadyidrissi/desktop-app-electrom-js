import crypto from "crypto";
import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/action/user.action"; // تأكد من صحة المسار

// دالة لحساب التوقيع
function generateSignature(secret, payload, timestamp) {
  const message = `${timestamp}.${payload}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("hex");
}

export async function POST(req) {
  try {
    const body = await req.text();

    if (!body) {
      console.error("");
      return NextResponse.json({ message: "Error Data" }, { status: 400 });
    }

    // Log headers to check if they are present
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    console.log("Received headers:", { svixId, svixTimestamp, svixSignature });

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ message: " You Need to Login First " }, { status: 400 });
    }

    const WEBHOOK_SECRET = process.env.WEBHOOKS_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error("need to login first");
      return NextResponse.json({ message: "login first" }, { status: 400 });
    }

    // Log the message being signed
    const expectedSignature = generateSignature(WEBHOOK_SECRET, body, svixTimestamp);
    console.log("Expected signature:", expectedSignature);

    // التحقق من صحة التوقيع
    if (svixSignature !== expectedSignature) {
      console.error("You not Auth to login");
      return NextResponse.json({ message: "You not Auth to login" }, { status: 400 });
    }

    const parsedBody = JSON.parse(body); // تحليل نص الطلب إلى JSON
    console.log("Parsed Body:", parsedBody);

    const newUser = await createUser(parsedBody); // حفظ المستخدم في قاعدة البيانات
    console.log("User created successfully:", newUser);

    return NextResponse.json({ message: "User save success", user: newUser });
  } catch (error) {
    console.error("Unexpected error occurred:", error);
    return NextResponse.json({ message: "  Server  ERROR ", error: error.message }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const users = await User.find();
    return new Response(
      JSON.stringify(users),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}