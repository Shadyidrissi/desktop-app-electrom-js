// app/user/dashboard/page.js (or pages/user/dashboard.js)
import { useAuth } from "@clerk/nextjs";

const UserDashboard = () => {
  const { user } = useAuth();

  if (user?.role === "viewer") {
    return <p>أنت مشاهد فقط.</p>;
  }

  if (user?.role === "blogger") {
    return <p>أنت مدوّن. يمكنك إضافة منشورات جديدة.</p>;
  }

  if (user?.role === "admin") {
    return <p>أنت مسؤول. لديك صلاحيات كاملة.</p>;
  }

  return <p>يتم تحميل بياناتك...</p>;
};

export default UserDashboard;
