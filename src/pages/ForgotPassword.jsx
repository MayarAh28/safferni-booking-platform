import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WhiteBackground from "/WhiteBackground.jpg";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API_REQUEST_URL = `${API_BASE_URL}/userManagement/password_reset/request/`;
const API_CONFIRM_URL = `${API_BASE_URL}/userManagement/password_reset/confirm/`;

const ForgotPassword = () => {
  const { uid, token } = useParams();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        email: email,
      };
      await axios.post(API_REQUEST_URL, requestData);
      toast.success("تم إرسال رابط الاستعادة على بريدك الإلكتروني.");
    } catch (err) {
      console.error("Error requesting password reset:", err);

      if (err.response && err.response.status === 400) {
        toast.error(
          "هذا البريد الإلكتروني ليس لديه حساب بموقعنا أو غير موجود."
        );
      } else {
        toast.error("فشل في إرسال الطلب. يرجى المحاولة لاحقاً.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        uid,
        token,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      };
      await axios.post(API_CONFIRM_URL, payload);

      toast.success("تم تغيير كلمة السر بنجاح!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error confirming password reset:", err);
      toast.error(
        "فشل في تغيير كلمة المرور. قد يكون الرابط منتهياً أو غير صالح."
      );
    } finally {
      setLoading(false);
    }
  };

  const isConfirmPage = uid && token;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-primary-dark mb-2">
            {isConfirmPage ? "إعادة تعيين كلمة المرور" : "نسيت كلمة المرور؟"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {isConfirmPage
              ? "الرجاء إدخال كلمة المرور الجديدة وتأكيدها."
              : "الرجاء إدخال بريدك الإلكتروني لاستعادة كلمة المرور."}
          </CardDescription>
          <Separator className="my-4 bg-secondary-light" />
        </CardHeader>
        <CardContent>
          {isConfirmPage ? (
            <form onSubmit={handleConfirmSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="new-password"
                  className="block text-right mb-2 text-gray-700 font-medium"
                >
                  <FontAwesomeIcon icon={faLock} className="ml-2" />
                  كلمة السر الجديدة
                </Label>
                <Input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="confirm-password"
                  className="block text-right mb-2 text-gray-700 font-medium"
                >
                  <FontAwesomeIcon icon={faLockOpen} className="ml-2" />
                  تأكيد كلمة السر الجديدة
                </Label>
                <Input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-primary-dark hover:bg-primary-dark cursor-pointer text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "جاري التحديث..." : "تأكيد التغيير"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-right mb-2 text-gray-700 font-medium"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="ml-2" />
                  البريد الإلكتروني
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-primary-dark hover:bg-primary-dark cursor-pointer text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "جاري الإرسال..." : "أرسل رابط الاستعادة"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
