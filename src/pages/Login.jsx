import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginImage from "/LoginImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const location = useLocation();
  const initialSuccessMessage = location.state?.successMessage;
  const { login, isLoading, isAuthenticating } = useAuth();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);
  const [rememberMe, setRememberMe] = useState(false);

  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, location.pathname]);

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password, rememberMe);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center text-primary-dark">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mb-4" />
          <p className="text-lg font-semibold">
            جاري التحقق من حالة المصادقة...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#fafafa] min-h-screen px-3">
        <div className="flex flex-col md:flex-row min-h-screen w-full p-10 justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full p-10 flex flex-col items-center justify-center md:w-1/2"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">
              تسجيل الدخول
            </h2>
            {successMessage && (
              <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 w-full text-center">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 w-full text-center">
                {error}
              </p>
            )}
            <label htmlFor="username" className="mb-2 block w-full">
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="اكتب اسم المستخدم"
              onChange={handleUsernameChange}
              value={username}
              ref={usernameInputRef}
              required
              disabled={isAuthenticating}
            />
            <label htmlFor="password" className="mb-2 block w-full">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="اكتب كلمة المرور"
              onChange={handlePasswordChange}
              value={password}
              required
              disabled={isAuthenticating}
            />
            <div className="flex justify-between items-center w-full mb-3">
              <div>
                <input
                  type="checkbox"
                  id="remember"
                  className="accent-secondary-dark"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isAuthenticating}
                />
                <label htmlFor="remember" className="mr-1.5">
                  تذكرني
                </label>
              </div>
              <Link to="/forgot-password" className="text-primary-light">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full mb-3 bg-secondary-dark hover:bg-secondary-light"
              disabled={
                !username.trim() || !password.trim() || isAuthenticating
              }
            >
              {isAuthenticating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
            <p className="text-center">
              أو سجل حساب جديد,{" "}
              <Link to="/signup" className="font-bold text-secondary-dark">
                تسجيل
              </Link>
            </p>
          </form>
          <div className="image hidden md:w-1/2 md:block">
            <img
              src={LoginImage}
              alt="Login"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
