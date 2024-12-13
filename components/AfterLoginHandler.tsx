"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AfterLoginHandler() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && userId) {
      // إرسال بيانات المستخدم إلى الخادم
      const saveUserToDB = async () => {
        try {
          // const userName = `${user?.firstName} ${user?.lastName}`;
          const response = await fetch("/api/webhooks/clerk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId: userId,
              email: user?.emailAddresses[0]?.emailAddress,
              // username: user?.username,
              photo: user?.imageUrl,
              firstName: user?.firstName,
              lastName: user?.lastName,
            }),
          });

          const responseBody = await response.json();
          console.log(responseBody); // تسجيل محتوى الاستجابة

          if (!response.ok) {
            console.error("فشل في حفظ المستخدم في قاعدة البيانات");
          } else {
            console.log("تم حفظ المستخدم بنجاح");
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
