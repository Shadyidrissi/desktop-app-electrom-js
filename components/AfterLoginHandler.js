"use client";

import crypto from "crypto";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

// دالة لحساب التوقيع
function generateSignature(secret, payload, timestamp) {
  const message = `${timestamp}.${payload}`; // الصيغة التي يتم توقيعها
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("hex");
}

export default function AfterLoginHandler() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && userId) {
      const saveUserToDB = async () => {
        try {
          const payload = JSON.stringify({
            clerkId: userId,
            email: user?.emailAddresses[0]?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            photo: user?.imageUrl,
          });

          // const timestamp = Math.floor(Date.now() / 1000); // الوقت الحالي بصيغة Unix
          // const secret = process.env.WEBHOOKS_SECRET; // المفتاح السري المخصص
          // const signature = await generateSignature(secret, payload, timestamp);

          const response = await fetch("/api/webhooks/clerk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // تم تعليق رؤوس الـ headers لأنها ليست ضرورية الآن للاختبار
              // "svix-id": "unique-request-id", // يمكنك استخدام مكتبة لإنشاء UUID
              // "svix-timestamp": timestamp.toString(),
              // "svix-signature": signature,
            },
            body: payload,
          });

          const responseBody = await response.json();
          // console.log(responseBody);

          if (!response.ok) {
            console.error("فشل في حفظ المستخدم في قاعدة البيانات:", responseBody);
          } else {
            console.log("تم حفظ المستخدم بنجاح:", responseBody);
          }
        } catch (error) {
          console.error("حدث خطأ أثناء حفظ المستخدم:", error);
        }
      };

      saveUserToDB();
    }
  }, [isLoaded, userId, user]);

  return null; // هذا المكون لا يعرض أي شيء
}
