// src/components/Header.jsx
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "/PrimaryLogo.png";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ManagerHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed bg-white container mx-auto z-50 shadow-md top-0 left-0 flex items-center justify-between px-6 py-2 md:px-16 min-w-screen">
      <div className="logo">
        <img src={Logo} alt="Logo" className="w-20" />
      </div>

      <nav className="hidden md:block">
        <ul className="flex gap-1">
          <li className="font-bold text-primary-dark py-2 px-2.5 hover:text-primary-light cursor-pointer">
            <Link to="/manager-dashboard">لوحة التحكم</Link>
          </li>
          <li className="font-bold text-primary-dark py-2 px-2.5 hover:text-primary-light cursor-pointer">
            <Link to="/manager/manage-trips">إدارة الرحلات</Link>
          </li>
          <li className="font-bold text-primary-dark py-2 px-2.5 hover:text-primary-light cursor-pointer">
            <Link to="/manager/add-trip">إضافة رحلة</Link>
          </li>
        </ul>
      </nav>

      <div className="hidden md:flex gap-2">
        {user ? (
          <>
            <span className="text-primary-dark font-bold py-2 px-3">
              شركة {user.username || user.first_name}{" "}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-secondary-dark text-primary-dark font-bold hover:bg-secondary-light"
            >
              تسجيل خروج
            </Button>
          </>
        ) : (
          <>
            <Button className="bg-secondary-dark text-primary-dark font-bold hover:bg-secondary-light">
              <Link to="/login">تسجيل دخول</Link>
            </Button>
            <Button variant="ghost" className="font-bold text-primary-dark">
              <Link to="/signup">تسجيل</Link>
            </Button>
          </>
        )}
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        <FontAwesomeIcon
          icon={faBars}
          className="text-3xl text-primary-dark cursor-pointer"
        />
      </button>

      {isOpen && (
        <nav className="absolute w-full top-[61px] left-0 text-center md:hidden bg-white shadow-lg">
          <ul>
            <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
              <Link to="/">الرئيسية</Link>
            </li>
            {isAuthenticated && (
              <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
                <Link to="/booking">حجوزاتي</Link>
              </li>
            )}
            <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
              <Link to="/manager/manage-trips">إدارة الرحلات</Link>
            </li>
            <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
              <Link to="/manager/add-trip">إضافة رحلة</Link>
            </li>
            <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
              <Link to="/contact">اتصل بنا</Link>
            </li>
            {user ? (
              <>
                <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
                  أهلاً، {user.username || user.first_name}
                </li>
                <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
                  <button onClick={handleLogout} className="w-full text-center">
                    تسجيل خروج
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    تسجيل دخول
                  </Link>
                </li>
                <li className="py-2 border-b border-b-primary-dark hover:bg-gray-100">
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    تسجيل
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default ManagerHeader;
