import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChair,
  faDollarSign,
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faTicketAlt,
  faTrashAlt,
  faBus,
  faUsers,
  faClock,
  faMoneyBillWave,
  faPlaneDeparture,
  faPlaneArrival,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import WhiteBackground from "/WhiteBackground.jpg";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const API_MY_BOOKINGS_URL = `${API_BASE_URL}/me/`;
const API_BOOKING_DETAIL_URL = (id) => `${API_BASE_URL}/book/${id}/`;

const MyBookings = () => {
  const { authToken, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancellationConfirmationOpen, setIsCancellationConfirmationOpen] =
    useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyBookings = async () => {
    if (!authToken || !user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_MY_BOOKINGS_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError("فشل في جلب الحجوزات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [authToken, user]);

  const handleDeleteBookingPermanently = async (bookingId) => {
    setIsDeleting(true);
    try {
      await axios.delete(API_BOOKING_DETAIL_URL(bookingId), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      toast.success(`تم حذف الحجز رقم ${bookingId} من قاعدة البيانات بنجاح!`);
    } catch (err) {
      console.error("Failed to delete booking:", err);
      let errorMessage = "فشل في حذف الحجز. يرجى المحاولة مرة أخرى.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = `فشل الحذف: ${err.response.data.detail}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCancelBooking = (booking) => {
    const departureDate = new Date(booking.trip_details.departure_date);
    const now = new Date();

    if (departureDate < now) {
      toast.error("هذه الرحلة غادرت بالفعل ولا يمكنك إلغاؤها.");
      return;
    }

    setBookingToCancel(booking);
    setIsCancellationConfirmationOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);

    try {
      await axios.patch(
        API_BOOKING_DETAIL_URL(bookingToCancel.id),
        {
          is_cancelled: true,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(`تم إلغاء الحجز رقم ${bookingToCancel.id} بنجاح!`);
      fetchMyBookings();
    } catch (err) {
      let errorMessage = "فشل في إلغاء الحجز. يرجى المحاولة مرة أخرى.";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = `فشل الإلغاء: الحجز غير موجود.`;
        } else if (err.response.status === 403) {
          errorMessage = `فشل الإلغاء: ليس لديك الصلاحية لإلغاء هذا الحجز.`;
        } else if (err.response.data && err.response.data.detail) {
          errorMessage = `فشل الإلغاء: ${err.response.data.detail}`;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
      setIsCancellationConfirmationOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "confirmation-overlay") {
      setIsCancellationConfirmationOpen(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={backgroundStyle}
        >
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary-dark">
                صفحة حجوزاتي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="text-primary-blue"
                />
                جاري تحميل الحجوزات...
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={backgroundStyle}
        >
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-red-600">
                خطأ في التحميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (bookings.length === 0) {
    return (
      <>
        <Header />
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={backgroundStyle}
        >
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary-dark">
                صفحة حجوزاتي
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                لا توجد لديك حجوزات حالياً.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Link to="/booking" className="text-primary-blue hover:underline">
                اضغط هنا لحجز رحلة جديدة
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          .bg-modal-overlay {
            background-color: rgba(0, 0, 0, 0.6);
          }
        `}
      </style>
      <Header />
      <div
        className="min-h-screen pt-[100px] pb-12 bg-cover bg-center"
        style={backgroundStyle}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary-dark mb-4">
            حجوزاتي
          </h1>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            يمكنك عرض وإدارة جميع حجوزاتك من هنا.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const departureDate = new Date(
                booking.trip_details.departure_date
              );
              const isPastTrip = departureDate < new Date();
              const isCancelled = booking.is_cancelled;
              const shouldShowCancelButton = !isPastTrip && !isCancelled;
              const showPastTripMessage = isPastTrip && !isCancelled;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:scale-105 transition duration-200 relative"
                >
                  {(isPastTrip || isCancelled) && (
                    <button
                      onClick={() => handleDeleteBookingPermanently(booking.id)}
                      className="absolute top-2 left-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="حذف الحجز من القائمة"
                      disabled={isDeleting}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                  )}
                  <h2 className="text-2xl font-extrabold text-primary-dark mb-4 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      className="text-secondary-dark"
                    />
                    الحجز رقم: {booking.id}
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faBus}
                        className="text-primary-light"
                      />
                      <span className="font-bold">الشركة:</span>{" "}
                      {booking.trip_details
                        ? booking.trip_details.company_name
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-primary-light"
                      />
                      <span className="font-bold">تاريخ المغادرة:</span>{" "}
                      {booking.trip_details
                        ? new Date(
                            booking.trip_details.departure_date
                          ).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faPlaneDeparture}
                        className="text-primary-light"
                      />
                      <span className="font-bold">من:</span>{" "}
                      {booking.trip_details
                        ? booking.trip_details.origin
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faPlaneArrival}
                        className="text-primary-light"
                      />
                      <span className="font-bold">إلى:</span>{" "}
                      {booking.trip_details
                        ? booking.trip_details.destination
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faChair}
                        className="text-primary-light"
                      />
                      <span className="font-bold">عدد المقاعد المحجوزة:</span>{" "}
                      {booking.number_of_seats}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-primary-light"
                      />
                      <span className="font-bold">السعر لكل مقعد:</span>{" "}
                      {booking.trip_details
                        ? booking.trip_details.price
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="text-primary-light"
                      />
                      <span className="font-bold">السعر الإجمالي للحجز:</span>{" "}
                      {booking.total_price}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">حالة الحجز:</span>{" "}
                      {isCancelled ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <FontAwesomeIcon icon={faTimesCircle} /> ملغاة
                        </span>
                      ) : (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          <FontAwesomeIcon icon={faCheckCircle} /> مؤكدة
                        </span>
                      )}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="text-primary-light"
                      />
                      <span className="font-bold">مقاعدك:</span>{" "}
                      {booking.assigned_seats &&
                      booking.assigned_seats.length > 0
                        ? booking.assigned_seats.join(", ")
                        : "لم يتم التعيين بعد"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-primary-light"
                      />
                      <span className="font-bold">تاريخ الحجز:</span>{" "}
                      {new Date(booking.booking_date).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {shouldShowCancelButton && (
                    <button
                      onClick={() => handleOpenCancelBooking(booking)}
                      className="mt-4 w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> إلغاء الحجز
                    </button>
                  )}
                  {isCancelled && (
                    <p className="mt-4 text-center text-red-700 font-medium flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faInfoCircle} /> الحجز ملغى ولا
                      يمكن إلغاؤه مرة أخرى.
                    </p>
                  )}
                  {showPastTripMessage && (
                    <p className="mt-4 text-center text-red-700 font-medium flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faInfoCircle} /> هذه الرحلة غادرت
                      بالفعل.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isCancellationConfirmationOpen && bookingToCancel && (
          <div
            id="confirmation-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-modal-overlay p-4"
            onClick={handleOverlayClick}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCancellationConfirmationOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
              <h3 className="text-2xl font-bold text-primary-dark mb-4">
                تأكيد إلغاء الحجز
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                هل أنت متأكد من إلغاء هذا الحجز؟ هذا الإجراء لا يمكن التراجع
                عنه.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mt-4 text-right">
                <p className="text-primary-dark font-semibold">
                  الحجز رقم: {bookingToCancel.id}
                </p>
                <p className="text-primary-dark font-semibold">
                  من: {bookingToCancel.trip_details.origin}
                </p>
                <p className="text-primary-dark font-semibold">
                  إلى: {bookingToCancel.trip_details.destination}
                </p>
                <p className="text-primary-dark font-semibold">
                  عدد المقاعد: {bookingToCancel.number_of_seats}
                </p>
                <p className="text-primary-dark font-semibold">
                  تاريخ الرحلة:{" "}
                  {new Date(
                    bookingToCancel.trip_details.departure_date
                  ).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleCancelBooking}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      جاري الإلغاء...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrashAlt} /> تأكيد الإلغاء
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsCancellationConfirmationOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  disabled={isCancelling}
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyBookings;
