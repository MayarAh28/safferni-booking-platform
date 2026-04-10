import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import ManagerHeader from "@/components/ManagerHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faEdit,
  faTrash,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import WhiteBackground from "/WhiteBackground.jpg";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://127.0.0.1:8000";
const API_TRIPS_URL = `${API_BASE_URL}/trips/create/`;
const API_TRIPS_CANCEL_URL = (id) =>
  `${API_BASE_URL}/trips/cancel/${id}/cancel/`;

const ManageTrips = () => {
  const { authToken, user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [tripToDeleteId, setTripToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrips = async () => {
    if (!authToken || !user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(API_TRIPS_URL, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("الرحلات التي تم استلامها من الخادم:", response.data);

      const filteredTrips = response.data.filter(
        (trip) => trip.company_name === user.username && !trip.is_cancelled
      );

      console.log("الرحلات بعد التصفية:", filteredTrips);

      setTrips(filteredTrips);
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("فشل في تحميل قائمة الرحلات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [authToken, user]);

  const handlePreDelete = (tripId) => {
    setTripToDeleteId(tripId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmationOpen(false);
    setIsDeleting(true);

    if (!authToken) {
      toast.error("يرجى تسجيل الدخول أولاً.");
      setIsDeleting(false);
      return;
    }

    try {
      await axios.post(
        API_TRIPS_CANCEL_URL(tripToDeleteId),
        { reason: "تم إلغاء الرحلة من قبل الشركة" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("تم إلغاء الرحلة بنجاح.");
      fetchTrips();
    } catch (err) {
      console.error("Error deleting trip:", err.response?.data || err.message);
      toast.error("فشل في حذف الرحلة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDeleting(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "confirmation-overlay") {
      setIsDeleteConfirmationOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <ManagerHeader />
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={backgroundStyle}
        >
          <p className="text-center text-primary-dark text-lg font-semibold">
            جاري تحميل الرحلات...
          </p>
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
      <ManagerHeader />
      <div className="min-h-screen p-4 pt-24" style={backgroundStyle}>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center text-primary-dark mb-6">
            إدارة رحلات الشركة
          </h1>

          <div className="flex justify-start mb-4">
            <Link
              to="/manager/add-trip"
              className="bg-primary-dark hover:scale-105 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition"
            >
              <FontAwesomeIcon icon={faPlus} className="ml-2" />
              أضف رحلة جديدة
            </Link>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const isDeparted = new Date(trip.departure_date) < new Date();
                return (
                  <div
                    key={trip.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    {isDeparted && (
                      <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full absolute top-2 left-2 mb-2">
                        رحلة منتهية
                      </span>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-primary-dark">
                      <FontAwesomeIcon
                        icon={faBus}
                        className="text-primary-blue ml-2"
                      />
                      {trip.origin} إلى {trip.destination}
                    </h3>
                    <p className="text-gray-600">
                      تاريخ المغادرة:{" "}
                      {new Date(trip.departure_date).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      المقاعد المتاحة: {trip.available_seats} /{" "}
                      {trip.total_seats}
                    </p>
                    <p className="text-gray-600 mb-4">
                      السعر: {parseFloat(trip.price).toLocaleString()} ل.س
                    </p>
                    <div className="flex justify-between items-center mt-4 border-t pt-4">
                      <Link
                        to={`/manager/edit-trip/${trip.id}`}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition text-sm"
                      >
                        <FontAwesomeIcon icon={faEdit} className="ml-2" />
                        تعديل
                      </Link>
                      <button
                        onClick={() => handlePreDelete(trip.id)}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} className="ml-2" />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
              <p className="text-center text-gray-700 text-lg mb-4">
                لا توجد رحلات حالياً.
              </p>
              <Link
                to="/manager/add-trip"
                className="text-primary-blue font-bold hover:underline"
              >
                أضف رحلة جديدة الآن!
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* نافذة تأكيد الحذف */}
      <AnimatePresence>
        {isDeleteConfirmationOpen && (
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
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                تأكيد حذف الرحلة
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                هل أنت متأكد من حذف هذه الرحلة نهائياً؟
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>تأكيد الحذف</>
                  )}
                </button>
                <button
                  onClick={() => setIsDeleteConfirmationOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  disabled={isDeleting}
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

export default ManageTrips;
