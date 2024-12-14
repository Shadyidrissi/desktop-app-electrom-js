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
        console.error("ERROR", error);
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

          const signature = generateSignature(secret, payload, timestamp);


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

          if (!response.ok) {
            console.error("Error Save User", responseBody);
          } else {
            console.log("User Save success", responseBody);
          }
        } catch (error) {
          console.error("Error Save User", error);
        }
      };

      saveUserToDB();
    }
  }, [isLoaded, userId, user, secret]);

  return null; // هذا المكون لا يعرض أي شيء
}
