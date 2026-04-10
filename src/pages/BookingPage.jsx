import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const BookingPage = () => {
  const { user, authToken, isLoading } = useAuth();

  const API_BASE_URL = "http://127.0.0.1:8000";
  const API_TRIPS_URL = `${API_BASE_URL}/trips/create`;

  const [availableRegions, setAvailableRegions] = useState([]);
  const [allTrips, setAllTrips] = useState([]); // تم تغيير الاسم إلى allTrips

  useEffect(() => {
    const fetchAllTripsAndRegions = async () => {
      // الشرط أصبح يعتمد على authToken فقط
      if (authToken) {
        try {
          const response = await axios.get(API_TRIPS_URL, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const tripsData = response.data; // استخدام اسم متغير مؤقت
          setAllTrips(tripsData);
          const origins = new Set(tripsData.map((trip) => trip.origin));
          const destinations = new Set(
            tripsData.map((trip) => trip.destination)
          );
          const uniqueRegions = [
            ...new Set([...origins, ...destinations]),
          ].sort();
          setAvailableRegions(uniqueRegions);
        } catch (error) {
          console.error("Failed to fetch trips or regions:", error);
        }
      }
    };
    fetchAllTripsAndRegions();
  }, [authToken]); // تم إزالة isLoading من هنا

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl text-blue-800 bg-gray-50">
        <FontAwesomeIcon icon={faSpinner} spin className="mr-3 text-3xl" />
        جاري تحميل بيانات الصفحة...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-700 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md">
        <FontAwesomeIcon icon={faExclamationCircle} className="mr-3 text-2xl" />
        حدث خطأ: لا يمكن تحميل بيانات المستخدم. يرجى التأكد من تسجيل الدخول.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/bus-bg.jpg)" }}
    >
      <Header />
      <div className="container mx-auto mt-[62px] flex justify-center items-center min-h-[calc(100vh-62px)] w-full px-4 py-8">
        <BookingForm
          user={user}
          availableRegions={availableRegions}
          allTrips={allTrips} // تم تغيير الاسم ليتوافق مع BookingForm
        />
      </div>
    </div>
  );
};

export default BookingPage;
