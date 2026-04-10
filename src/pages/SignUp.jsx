import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "/LoginImage.png";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  function handleSignUp(e) {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "كلمة السر غير متطابقة !",
      }));
      return;
    }

    if (!phoneNumber.startsWith("+963")) {
      setErrors((prev) => ({
        ...prev,
        phone: "يجب أن يبدأ رقم الهاتف بـ +963",
      }));
      return;
    }

    const user = {
      first_name: firstName,
      last_name: lastName,
      username: userName,
      email,
      password,
      phone_number: phoneNumber,
    };

    axios
      .post("http://127.0.0.1:8000/userManagement/register/", user)
      .then((res) => {
        navigate("/login", {
          state: {
            successMessage: "تم إنشاء الحساب بنجاح ! يمكنك الآن تسجيل الدخول.",
          },
        });
      })
      .catch((err) => {
        const apiError =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "حدث خطأ غير متوقع. حاول مرة أخرى.";
        setErrors({ api: apiError });
      });
  }

  return (
    <div className="bg-[#fafafa]">
      <Header />
      <div className="container mx-auto mt-[62px] flex justify-center items-center min-h-[91vh] w-full px-3 ">
        <div className="login w-full min-h-full p-10 flex flex-col md:w-1/2">
          <h3 className="text-primary-dark text-3xl font-bold text-center">
            إنشاء حساب
          </h3>
          <form action="" className="mt-7 w-full" onSubmit={handleSignUp}>
            <label htmlFor="" className="mb-2 block">
              الاسم الأول
            </label>
            <input
              type="text"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="مثال: محمد"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              الاسم الأخير
            </label>
            <input
              type="text"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="مثال: علي"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              اسم المستخدم
            </label>
            <input
              type="text"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="مثال: mohamed.ali"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="مثال: user@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              رقم الموبايل
            </label>
            <input
              type="text"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="يجب أن يبدأ بـ +963"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              كلمة المرور
            </label>
            <input
              type="password"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="8 أحرف على الأقل"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="" className="mb-2 block">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light"
              placeholder="أعد كتابة كلمة المرور"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {errors.password && (
              <p className="p-2 bg-red-300 text-red-700 font-bold mb-3 rounded-md">
                {errors.password}
              </p>
            )}
            {errors.phone && (
              <p className="p-2 bg-red-300 text-red-700 font-bold mb-3 rounded-md">
                {errors.phone}
              </p>
            )}
            {errors.api && (
              <p className="p-2 bg-red-300 text-red-700 font-bold mb-3 rounded-md">
                {errors.api}
              </p>
            )}

            <Button
              className="w-full mb-3 bg-secondary-dark hover:bg-secondary-light cursor-pointer"
              disabled={
                !firstName ||
                !lastName ||
                !userName ||
                !email ||
                !phoneNumber ||
                !password ||
                !confirmPassword
              }
            >
              إنشاء حساب
            </Button>
          </form>
        </div>
        <div className="image hidden md:w-1/2 md:block">
          <img src={LoginImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
