"use client";

import crypto from "crypto";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

// دالة لحساب التوقيع
function generateSignature(secret, payload, timestamp) {
  // Log all the parameters to see what is being passed
  console.log("Generating signature with:", {
    secret,
    payload,
    timestamp
  });

  const message = `${timestamp}.${payload}`; // الصيغة التي يتم توقيعها
  console.log("Message to sign:", message);

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const signature = hmac.digest("hex");


  return signature;
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

          // Log the payload and timestamp
          const timestamp = Math.floor(Date.now() / 1000); // الوقت الحالي بصيغة Unix
          console.log("Payload:", payload);
          console.log("Timestamp:", timestamp);
          // console.log("ENV:", process.env.WEBHOOKS_SECRET);

          const secret = "whsec_s2AmRYnDDqDP7QMQaKovuXjcLfp6JXdx"; 

          // Generate the signature
          const signature = generateSignature(secret, payload, timestamp);

          // Log the final signature
          console.log("Signature generated:", signature);

          const response = await fetch("/api/webhooks/clerk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "svix-id": "unique-request-id", // Ensure you're generating a proper UUID or unique ID
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
  }, [isLoaded, userId, user]);

  return null; // هذا المكون لا يعرض أي شيء
}
