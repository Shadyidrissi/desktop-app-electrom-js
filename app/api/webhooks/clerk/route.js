import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/action/user.action"; // إذا كنت في مجلد مختلف
import { Webhook } from "svix";

export async function POST(req) {
  const body = await req.json();

  // قراءة المفتاح السري من ملف البيئة .env.local
  const WEBHOOK_SECRET = process.env.WEBHOOKS_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ message: "مفتاح ويب هوك مفقود" }, { status: 400 });
  }

  // التحقق من وجود البيانات المطلوبة في الطلب
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ message: "البيانات غير مكتملة" }, { status: 400 });
  }

  try {
    // التحقق من صحة الطلب باستخدام مفتاح ويب هوك
    const wh = new Webhook(WEBHOOK_SECRET);
    wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    // إذا كان التحقق صحيحًا، قم بحفظ المستخدم في قاعدة البيانات
    const newUser = await createUser(body);
    return NextResponse.json({ message: "تم حفظ المستخدم بنجاح", user: newUser });
  } catch (error) {
    console.error("خطأ في التحقق أو حفظ المستخدم:", error);
    return NextResponse.json({ message: "فشل في حفظ المستخدم" }, { status: 500 });
  }
}
