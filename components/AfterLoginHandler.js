"use client";

import crypto from "crypto";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
  const [secret, setSecret] = useState(null);

  // جلب المتغير السري من الخادم
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await fetch("/api/getEnv");
        const data = await response.json(); // تأكد من الانتظار بشكل صحيح
        console.log("data :", data); // طباعة البيانات بشكل صحيح
        if (data.secret) {
          setSecret(data.secret);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب المتغير السري:", error);
      }
    };
  
    fetchSecret();
  }, []);
  

  useEffect(() => {
    if (isLoaded && userId && secret) {
      const saveUserToDB = async () => {
        try {
          const payload = JSON.stringify({
            clerkId: userId,
            email: user?.emailAddresses[0]?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            photo: user?.imageUrl,
          });

          const timestamp = Math.floor(Date.now() / 1000); // الوقت الحالي بصيغة Unix
          console.log("Payload:", payload);
          console.log("Timestamp:", timestamp);

          const signature = generateSignature(secret, payload, timestamp);

          console.log("Signature generated:", signature);

          const response = await fetch("/api/webhooks/clerk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "svix-id": "unique-request-id",
              "svix-timestamp": timestamp.toString(),
              "svix-signature": signature,
            },
            body: payload,
          });

          const responseBody = await response.json();
          console.log("Response from server:", responseBody);

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
  }, [isLoaded, userId, user, secret]);

  return null; // هذا المكون لا يعرض أي شيء
}
