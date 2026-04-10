import React, { useState } from "react";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import WhiteBackground from "/WhiteBackground.jpg";

const API_ENDPOINT = "http://127.0.0.1:8000/contact/contact/";

const subjectChoices = [
  { value: "complains", label: "شكوى" },
  { value: "criticism", label: "نقد بناء" },
  { value: "other", label: "شيء أخر" },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject_of_message: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await axios.post(API_ENDPOINT, formData);

      if (response.status === 200 || response.status === 201) {
        setStatusMessage({
          type: "success",
          text: "شكراً لك! تم استلام رسالتك بنجاح وسنتواصل معك قريباً.",
        });
        setFormData({
          full_name: "",
          email: "",
          subject_of_message: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة لاحقاً.";

      if (error.response) {
        if (error.response.status === 400) {
          const errors = error.response.data;
          const fieldErrors = Object.values(errors).flat();
          errorMessage = fieldErrors.join(" ");
        } else {
          errorMessage = "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.";
        }
      }

      setStatusMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMessage({ type: "", text: "" });
      }, 7000);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-[100px] pb-12"
        style={backgroundStyle}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary-dark mb-4">
            تواصل معنا
          </h1>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            نحن هنا لمساعدتك! إذا كان لديك أي استفسار، اقتراح، أو واجهت أي
            مشكلة، لا تتردد في التواصل معنا.
          </p>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-primary-dark text-white p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">معلومات الاتصال</h2>
              <p className="text-primary-lightest mb-6">
                يمكنك التواصل معنا عبر القنوات التالية:
              </p>
              <ul className="space-y-4 text-lg">
                <li className="flex items-center gap-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-secondary-dark text-2xl"
                  />
                  <a href="mailto:safferni2025@gmail.com" className="hover:underline">
                    safferni2025@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-secondary-dark text-2xl"
                  />
                  <span>+963 999 999 999</span>
                </li>
                <li className="flex items-start gap-4">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-secondary-dark text-2xl mt-1"
                  />
                  <span>المركز الرئيسي، دمشق، سوريا</span>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-primary-dark mb-6">
                أرسل لنا رسالة
              </h2>
              {statusMessage.text && (
                <div
                  className={`p-4 rounded-md text-center mb-4 ${
                    statusMessage.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light outline-none border p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light outline-none border p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الموضوع
                  </label>
                  <select
                    id="subject"
                    name="subject_of_message"
                    value={formData.subject_of_message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light outline-none border p-2"
                  >
                    <option value="" disabled>
                      اختر الموضوع...
                    </option>
                    {subjectChoices.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    رسالتك
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light outline-none border p-2"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {loading ? "جاري الإرسال..." : "أرسل الرسالة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
