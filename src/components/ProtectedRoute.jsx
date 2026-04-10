// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // إذا كان لا يزال يحمل، يمكنك عرض شاشة تحميل هنا
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "24px",
          color: "#001840",
        }}
      >
        جاري التحقق من الوصول...
      </div>
    );
  }

  // إذا لم يكن مصادقًا، أعد التوجيه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان مصادقًا، اسمح بالوصول إلى المكونات الفرعية
  return children;
};
