"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser(); // Get the logged-in user
  const [dbUser, setDbUser] = useState(null); // Store database user info
  const [loading, setLoading] = useState(true); // Track loading state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [categorie, setCategorie] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the user data from the server when the component mounts
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const response = await fetch(`/api/getUser?clerkId=${user.id}`);
          const data = await response.json();

          if (response.ok) {
            setDbUser(data.user); // Save the user data from the database
          } else {
            console.error("Error fetching user:", data.error);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false); // Stop the loading state
        }
      })();
    } else {
      setLoading(false); // If no user, stop the loading state
    }
  }, [user]); // Dependency array ensures this runs only when `user` changes

  // Show loading indicator while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  // If the user is not a blogger, deny access
  if (!dbUser || dbUser.role !== "blogger") {
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

export default Page;
