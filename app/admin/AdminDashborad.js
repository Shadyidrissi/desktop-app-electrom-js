"use client";

import { useState, useEffect } from "react";

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      // Fetch all users from the backend
      fetch("/api/getUsers")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else {
      alert("ليس لديك صلاحيات للوصول إلى هذه الصفحة.");
    }
  }, [user]);

  const changeRole = async (userId, newRole) => {
    const response = await fetch("/api/updateUserRole", {
      method: "POST",
      body: JSON.stringify({ userId, newRole }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.success) {
      alert(`تم تغيير الدور إلى ${newRole}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } else {
      alert("فشل في تغيير الدور");
    }
  };

  const blockUser = async (userId) => {
    const response = await fetch("/api/blockUser", {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.success) {
      alert("تم حظر المستخدم");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: true } : user
        )
      );
    } else {
      alert("فشل في الحظر");
    }
  };

  return (
    <div>
      <h1>لوحة تحكم المسؤول</h1>
      <table>
        <thead>
          <tr>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>تغيير الدور</th>
            <th>حظر المستخدم</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  value={user.role}
                  disabled={user.isBlocked}
                >
                  <option value="viewer">مشاهد</option>
                  <option value="blogger">مدوّن</option>
                  <option value="admin">مسؤول</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => blockUser(user._id)}
                  disabled={user.isBlocked}
                >
                  {user.isBlocked ? "محظور" : "حظر"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
