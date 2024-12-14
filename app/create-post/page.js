// pages/blogger/create-post.js
"use client"
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const page = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [categorie, setCategorie] = useState("");
  const [message, setMessage] = useState("");

  // Check if the user is a blogger
  if (user?.role !== "blogger") {
    return <p>ليس لديك صلاحيات لإنشاء منشورات.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, city, phone, categorie }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("تم إنشاء المنشور بنجاح.");
      setTitle("");
      setContent("");
      setCity("");
      setPhone("");
      setCategorie("");
    } else {
      setMessage(data.error || "حدث خطأ.");
    }
  };

  return (
    <div>
      <h1>إضافة منشور جديد</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>المحتوى</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>المدينة</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>الهاتف</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>الفئة</label>
          <input
            type="text"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            required
          />
        </div>
        <button type="submit">إرسال</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default page;

