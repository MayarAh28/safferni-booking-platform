import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const BookingForm = ({ user, availableRegions, allTrips }) => {
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [regions, setRegions] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [closestTrip, setClosestTrip] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [tripToConfirm, setTripToConfirm] = useState(null);

  const { authToken } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:8000";
  const API_BOOKING_CREATE_URL = `${API_BASE_URL}/booking/book/`;

  useEffect(() => {
    if (availableRegions && availableRegions.length > 0) {
      setRegions(availableRegions);
    }
  }, [availableRegions]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setBookingMessage(null);
    setClosestTrip(null);
    setFilteredTrips([]);

    if (!origin || !destination || !departureDate || !numberOfSeats) {
      setError("الرجاء تعبئة جميع حقول البحث عن الرحلات.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    const formattedSelectedDate = format(departureDate, "yyyy-MM-dd");

    const filtered = allTrips.filter((trip) => {
      const tripDateFromAPI = new Date(trip.departure_date);
      const formattedTripDate = format(tripDateFromAPI, "yyyy-MM-dd");

      const matchOrigin = trip.origin === origin;
      const matchDestination = trip.destination === destination;
      const matchDate = formattedTripDate === formattedSelectedDate;
      const matchSeats = trip.available_seats >= parseInt(numberOfSeats);

      return matchOrigin && matchDestination && matchDate && matchSeats;
    });

    if (filtered.length > 0) {
      setFilteredTrips(filtered);
    } else {
      const tripsForSameRoute = allTrips.filter(
        (trip) => trip.origin === origin && trip.destination === destination
      );

      if (tripsForSameRoute.length > 0) {
        const searchDate = new Date(formattedSelectedDate);
        tripsForSameRoute.sort((a, b) => {
          const dateA = new Date(a.departure_date);
          const dateB = new Date(b.departure_date);
          return Math.abs(dateA - searchDate) - Math.abs(dateB - searchDate);
        });

        setClosestTrip(tripsForSameRoute[0]);
        setError("عذراً، لا توجد رحلات مطابقة تمامًا. ولكن يوجد موعد قريب.");
        setTimeout(() => setError(null), 5000);
      } else {
        setError("عذراً، لا توجد رحلات مطابقة لمعايير البحث.");
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleOriginChange = (value) => {
    setOrigin(value);
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
  };

  const openConfirmationPopup = (trip) => {
    if (!user || !authToken) {
      setBookingMessage({
        type: "error",
        message: "الرجاء تسجيل الدخول لإتمام الحجز.",
      });
      setTimeout(() => setBookingMessage(null), 5000);
      return;
    }

    const seatsToBook = parseInt(numberOfSeats);
    if (isNaN(seatsToBook) || seatsToBook <= 0) {
      setBookingMessage({
        type: "error",
        message: "الرجاء تحديد عدد مقاعد صالح.",
      });
      setTimeout(() => setBookingMessage(null), 5000);
      return;
    }

    if (!firstName || !lastName || !phoneNumber) {
      setBookingMessage({
        type: "error",
        message:
          "الرجاء إدخال الاسم الأول، الاسم الأخير، ورقم الموبايل لإتمام الحجز.",
      });
      setTimeout(() => setBookingMessage(null), 5000);
      return;
    }

    if (seatsToBook > trip.available_seats) {
      setBookingMessage({
        type: "error",
        message: "عدد المقاعد المطلوب غير متاح لهذه الرحلة.",
      });
      setTimeout(() => setBookingMessage(null), 5000);
      return;
    }

    setTripToConfirm(trip);
    setIsConfirmationOpen(true);
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    setBookingMessage(null);

    try {
      const response = await axios.post(
        API_BOOKING_CREATE_URL,
        {
          trip: tripToConfirm.id,
          user: user.id,
          number_of_seats: parseInt(numberOfSeats),
          user_name: `${firstName} ${lastName}`,
          user_phone_number: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setBookingMessage({ type: "success", message: "تم حجز الرحلة بنجاح!" });
        setTimeout(() => {
          navigate("/my-bookings");
        }, 1500);
      } else {
        setBookingMessage({
          type: "error",
          message: "فشل الحجز: " + (response.data.message || "خطأ غير معروف"),
        });
        setTimeout(() => setBookingMessage(null), 5000);
      }
    } catch (error) {
      let errorMessage = "فشل في حجز الرحلة. يرجى المحاولة مرة أخرى.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = "فشل الحجز: " + error.response.data.detail;
        } else if (typeof error.response.data === "object") {
          const fieldErrors = Object.keys(error.response.data)
            .map(
              (key) =>
                `${key}: ${
                  Array.isArray(error.response.data[key])
                    ? error.response.data[key].join(", ")
                    : error.response.data[key]
                }`
            )
            .join("; ");
          errorMessage = "فشل الحجز: " + fieldErrors;
        } else {
          errorMessage = "فشل الحجز: " + error.response.data;
        }
      }
      setBookingMessage({ type: "error", message: errorMessage });
      setTimeout(() => setBookingMessage(null), 5000);
    } finally {
      setIsBooking(false);
      setIsConfirmationOpen(false);
      setTripToConfirm(null);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "confirmation-overlay") {
      setIsConfirmationOpen(false);
    }
  };

  return (
    <>
      <style>
        {`
          .bg-modal-overlay {
            background-color: rgba(0, 0, 0, 0.6);
          }
        `}
      </style>
      <div className="flex flex-col md:flex-row gap-5 w-full justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-[#fafafa] p-6 rounded-lg shadow-md max-w-sm min-w-80 md:w-1/3"
        >
          <h2 className="text-primary-dark text-3xl font-bold text-center mb-8">
            ابحث عن رحلتك
          </h2>
          {error && (
            <div className="mb-4 bg-red-100 text-red-800 border border-red-300 p-3 rounded">
              ❌ {error}
            </div>
          )}
          {bookingMessage && (
            <div
              className={`mb-4 p-3 rounded ${
                bookingMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {bookingMessage.type === "success" ? "✅" : "❌"}{" "}
              {bookingMessage.message}
            </div>
          )}
          <div className="flex gap-2.5">
            <div className="w-1/2">
              <label htmlFor="firstName" className="mb-2 block">
                الاسم الأول
              </label>
              <input
                id="firstName"
                type="text"
                className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light border border-gray-300"
                placeholder="ادخل اسمك الأول"
                onChange={(e) => setFirstName(e.target.value)}
                required
                value={firstName}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="mb-2 block">
                الاسم الأخير
              </label>
              <input
                id="lastName"
                type="text"
                className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light border border-gray-300"
                placeholder="ادخل اسمك الأخير"
                onChange={(e) => setLastName(e.target.value)}
                required
                value={lastName}
              />
            </div>
          </div>
          <div className="flex gap-2.5">
            <div className="w-2/3">
              <label htmlFor="phoneNumber" className="mb-2 block">
                رقم الموبايل
              </label>
              <input
                id="phoneNumber"
                type="text"
                className="bg-white rounded-2xl py-2.5 px-3.5 w-full mb-3 outline-primary-light border border-gray-300"
                placeholder="ادخل رقم الموبايل"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                value={phoneNumber}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="numberOfSeats" className="mb-2 block">
                عدد المقاعد
              </label>
              <input
                id="numberOfSeats"
                type="number"
                className="bg-white rounded-2xl py-2.5 px-3.5 w-2/3 mb-3 outline-primary-light border border-gray-300"
                onChange={(e) => setNumberOfSeats(e.target.value)}
                required
                value={numberOfSeats}
                min="1"
              />
            </div>
          </div>
          <label htmlFor="originSelect" className="mb-2 block">
            نقطة الإنطلاق
          </label>
          <Select dir="rtl" onValueChange={handleOriginChange} value={origin}>
            <SelectTrigger className="w-full bg-white mb-3" id="originSelect">
              <SelectValue placeholder="اختر نقطة الإنطلاق" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>المناطق</SelectLabel>
                {regions.map((region) => (
                  <SelectItem value={region} key={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <label htmlFor="destinationSelect" className="mb-2 block">
            الوجهة
          </label>
          <Select
            dir="rtl"
            onValueChange={handleDestinationChange}
            value={destination}
          >
            <SelectTrigger
              className="w-full bg-white mb-3"
              id="destinationSelect"
            >
              <SelectValue placeholder="اختر الوجهة" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>المناطق</SelectLabel>
                {regions.map((region) => (
                  <SelectItem value={region} key={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label className="mb-2 block">تاريخ الرحلة</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between text-right font-normal bg-white border border-gray-300 ${
                  !departureDate ? "text-muted-foreground" : ""
                }`}
              >
                {departureDate
                  ? format(departureDate, "yyyy-MM-dd")
                  : "اختر تاريخ الرحلة"}
                <CalendarIcon className="ml-2 h-4 w-4 text-primary-light" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            className="w-full bg-secondary-dark hover:bg-secondary-light cursor-pointer mt-5"
          >
            اعرض الرحلات
          </Button>
        </form>

        <div className="w-full md:w-2/3 bg-[#fafafa] p-6 rounded-lg shadow-md">
          <h3 className="text-primary-dark text-2xl font-bold text-center mb-4">
            الرحلات المتوفرة
          </h3>
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredTrips.map((trip) => {
                const departureDateTime = new Date(trip.departure_date);
                const formattedTime = departureDateTime.toLocaleTimeString(
                  "ar-EG",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                );
                return (
                  <div
                    key={trip.id}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <p className="font-bold text-lg text-primary-dark">
                      {trip.origin} &#8592; {trip.destination}
                    </p>
                    <p className="text-sm text-gray-700">
                      التاريخ:{" "}
                      {format(new Date(trip.departure_date), "yyyy-MM-dd")}
                    </p>
                    <p className="text-sm text-gray-700">
                      وقت الإنطلاق: {formattedTime}
                    </p>
                    <p className="text-sm text-gray-700">
                      المقاعد المتاحة: {trip.available_seats}
                    </p>
                    <p className="text-sm text-gray-700">
                      الشركة: {trip.company_name}
                    </p>
                    <p className="text-lg font-bold text-secondary-dark mt-2">
                      السعر: {trip.price} SYP
                    </p>
                    <Button
                      onClick={() => openConfirmationPopup(trip)}
                      className="mt-3 w-full bg-primary-light hover:bg-primary-dark hover:cursor-pointer"
                      disabled={
                        parseInt(numberOfSeats) <= 0 ||
                        parseInt(numberOfSeats) > trip.available_seats
                      }
                    >
                      احجز الآن
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : closestTrip ? (
            <div className="w-full py-8 text-center">
              <p className="text-lg font-semibold text-primary-dark mb-4">
                لا توجد رحلات مطابقة، ولكن يوجد موعد قريب:
              </p>
              <div
                key={closestTrip.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <p className="font-bold text-lg text-primary-dark">
                  {closestTrip.origin} &#8592; {closestTrip.destination}
                </p>
                <p className="text-sm text-gray-700">
                  التاريخ:{" "}
                  {format(new Date(closestTrip.departure_date), "yyyy-MM-dd")}
                </p>
                <p className="text-sm text-gray-700">
                  وقت الإنطلاق:{" "}
                  {new Date(closestTrip.departure_date).toLocaleTimeString(
                    "ar-EG",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
                <p className="text-sm text-gray-700">
                  المقاعد المتاحة: {closestTrip.available_seats}
                </p>
                <p className="text-sm text-gray-700">
                  الشركة: {closestTrip.company_name}
                </p>
                <p className="text-lg font-bold text-secondary-dark mt-2">
                  السعر: {closestTrip.price} SYP
                </p>
                <Button
                  onClick={() => openConfirmationPopup(closestTrip)}
                  className="mt-3 w-full bg-primary-light hover:bg-primary-dark hover:cursor-pointer"
                  disabled={
                    parseInt(numberOfSeats) <= 0 ||
                    parseInt(numberOfSeats) > closestTrip.available_seats
                  }
                >
                  احجز الآن
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              لا توجد رحلات مطابقة لمعايير البحث. يرجى تعديل خيارات البحث.
            </p>
          )}
        </div>

        <AnimatePresence>
          {isConfirmationOpen && tripToConfirm && (
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
                className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-primary-dark mb-4">
                  تأكيد الحجز
                </h3>
                <p className="text-lg text-gray-700 mb-2">
                  هل أنت متأكد من حجز هذه الرحلة؟
                </p>
                <div className="bg-gray-100 rounded-lg p-4 mt-4 text-right">
                  <p className="text-primary-dark font-semibold">
                    من: {tripToConfirm.origin}
                  </p>
                  <p className="text-primary-dark font-semibold">
                    إلى: {tripToConfirm.destination}
                  </p>
                  <p className="text-primary-dark font-semibold">
                    تاريخ:{" "}
                    {format(
                      new Date(tripToConfirm.departure_date),
                      "yyyy-MM-dd"
                    )}
                  </p>
                  <p className="text-primary-dark font-semibold">
                    وقت:{" "}
                    {new Date(tripToConfirm.departure_date).toLocaleTimeString(
                      "ar-EG",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                  <p className="text-primary-dark font-semibold">
                    عدد المقاعد: {numberOfSeats}
                  </p>
                  <p className="text-primary-dark font-semibold text-lg mt-2">
                    السعر الإجمالي: {tripToConfirm.price * numberOfSeats} SYP
                  </p>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={confirmBooking}
                    className="bg-primary-light hover:bg-primary-dark cursor-pointer text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="ml-2"
                        />
                        جاري التأكيد...
                      </>
                    ) : (
                      "تأكيد الحجز"
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsConfirmationOpen(false)}
                    className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    إلغاء
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BookingForm;
