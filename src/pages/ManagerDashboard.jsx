import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ManagerHeader from "@/components/ManagerHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";

// استيراد صورة الخلفية
import WhiteBackground from "/WhiteBackground.jpg";

const ManagerDashboard = () => {
  const { user } = useAuth();

  // تعريف نمط الخلفية
  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <>
      <ManagerHeader />
      <div
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
        style={backgroundStyle}
      >
        <div className="container mx-auto text-center pt-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark mb-6">
            لوحة تحكم المدير
          </h1>
          {user && (
            <p className="text-xl sm:text-2xl text-gray-700 mb-8">
              أهلاً بك يا شركة، {user.company_name || user.username}!
            </p>
          )}
        </div>

        {/* Dashboard Sections Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* إضافة رحلة جديدة */}
          <Link to="/manager/add-trip" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer h-full">
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="text-5xl text-secondary-dark mb-4"
              />
              <h2 className="text-2xl font-semibold text-primary-dark mb-2">
                إضافة رحلة جديدة
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                أضف تفاصيل رحلة جديدة إلى النظام، بما في ذلك المسار، الأوقات،
                والسعة.
              </p>
            </div>
          </Link>

          {/* إدارة الرحلات */}
          <Link to="/manager/manage-trips" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer h-full">
              <FontAwesomeIcon
                icon={faEdit}
                className="text-5xl text-secondary-dark mb-4"
              />
              <h2 className="text-2xl font-semibold text-primary-dark mb-2">
                إدارة الرحلات
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                شاهد، عدّل، واحذف الرحلات الخاصة بشركتك.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
