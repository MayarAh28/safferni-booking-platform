import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import ManagerHeader from "@/components/ManagerHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faClock,
  faDollarSign,
  faChair,
  faTrashAlt,
  faSpinner,
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
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const API_TRIPS_DETAIL_URL = (id) => `${API_BASE_URL}/trips/detail/${id}/`;
const API_TRIPS_CANCEL_URL = (id) =>
  `${API_BASE_URL}/trips/cancel/${id}/cancel/`;

const EditTrip = () => {
  const { authToken, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departure_date: "",
    total_seats: 0,
    price: "",
    company: null,
  });
  const [loading, setLoading] = useState(true);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(API_TRIPS_DETAIL_URL(id), {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const tripData = response.data;
        setFormData({
          origin: tripData.origin,
          destination: tripData.destination,
          departure_date: new Date(tripData.departure_date)
            .toISOString()
            .slice(0, 16),
          total_seats: tripData.total_seats || 0,
          price: tripData.price || "0",
          company: tripData.company,
        });
      } catch (err) {
        console.error("Error fetching trip details:", err);
        toast.error("فشل في تحميل تفاصيل الرحلة.");
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id, authToken]);

  const handlePreEdit = (e) => {
    e.preventDefault();
    setIsEditConfirmationOpen(true);
  };

  const handleConfirmEdit = async () => {
    setIsEditConfirmationOpen(false);
    setLoading(true);

    const payload = {
      ...formData,
      total_seats: parseInt(formData.total_seats, 10),
      price: parseFloat(formData.price),
    };

    try {
      await axios.put(API_TRIPS_DETAIL_URL(id), payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("تم تحديث الرحلة بنجاح!");
      navigate("/manager/manage-trips");
    } catch (err) {
      console.error("Error updating trip:", err.response?.data || err.message);
      toast.error(
        "فشل في تحديث الرحلة. يرجى التأكد من البيانات والمحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    setIsDeleteConfirmationOpen(false);
    setIsDeleting(true);

    if (!authToken) {
      toast.error("يرجى تسجيل الدخول أولاً لإجراء هذا التغيير.");
      setIsDeleting(false);
      return;
    }

    const url = `${API_BASE_URL}/trips/cancel/${id}/cancel/`;

    try {
      await axios.post(
        API_TRIPS_CANCEL_URL(id),
        { reason: "تم إلغاء الرحلة من قبل الشركة" },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("تم حذف الرحلة بنجاح!");
      navigate("/manager/manage-trips");
    } catch (err) {
      console.error("Error deleting trip:", err.response?.data || err.message);
      toast.error("فشل في حذف الرحلة. يرجى المحاولة لاحقاً.");
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
      setIsEditConfirmationOpen(false);
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
            جاري تحميل تفاصيل الرحلة...
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
      <div
        className="min-h-[calc(100vh-62px)] mt-[62px] flex flex-col justify-center items-center p-4"
        style={backgroundStyle}
      >
        <Card className="w-full max-w-2xl shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-primary-dark mb-2">
              تعديل تفاصيل الرحلة
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              الرجاء تحديث تفاصيل الرحلة هنا.
            </CardDescription>
            <Separator className="my-4 bg-secondary-light" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreEdit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="origin"
                    className="block text-right mb-2 text-gray-700 font-medium"
                  >
                    <FontAwesomeIcon icon={faBus} className="ml-2" />
                    نقطة الانطلاق:
                  </Label>
                  <Input
                    type="text"
                    id="origin"
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="destination"
                    className="block text-right mb-2 text-gray-700 font-medium"
                  >
                    <FontAwesomeIcon icon={faBus} className="ml-2" />
                    الوجهة:
                  </Label>
                  <Input
                    type="text"
                    id="destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="departure_date"
                    className="block text-right mb-2 text-gray-700 font-medium"
                  >
                    <FontAwesomeIcon icon={faClock} className="ml-2" />
                    تاريخ ووقت المغادرة:
                  </Label>
                  <Input
                    type="datetime-local"
                    id="departure_date"
                    value={formData.departure_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure_date: e.target.value,
                      })
                    }
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="total_seats"
                    className="block text-right mb-2 text-gray-700 font-medium"
                  >
                    <FontAwesomeIcon icon={faChair} className="ml-2" />
                    إجمالي المقاعد:
                  </Label>
                  <Input
                    type="number"
                    id="total_seats"
                    value={formData.total_seats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_seats: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="price"
                    className="block text-right mb-2 text-gray-700 font-medium"
                  >
                    <FontAwesomeIcon icon={faDollarSign} className="ml-2" />
                    السعر:
                  </Label>
                  <Input
                    type="number"
                    id="price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse gap-4">
                <Button
                  type="submit"
                  className="flex-1 py-3 text-lg font-semibold bg-green-500 cursor-pointer hover:bg-green-600 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  disabled={loading || isDeleting}
                >
                  {loading ? "جاري التحديث..." : "تأكيد التعديل"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsDeleteConfirmationOpen(true)}
                  className="flex-1 py-3 text-lg font-semibold bg-red-500 cursor-pointer hover:bg-red-600 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  disabled={loading || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrashAlt} className="ml-2" />
                      حذف الرحلة
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* نافذة تأكيد التعديل */}
      <AnimatePresence>
        {isEditConfirmationOpen && (
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
                تأكيد تعديل الرحلة
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                هل أنت متأكد من تحديث الرحلة بهذه المعلومات الجديدة؟
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mt-4 text-right">
                <p className="text-primary-dark font-semibold">
                  نقطة الانطلاق: {formData.origin}
                </p>
                <p className="text-primary-dark font-semibold">
                  الوجهة: {formData.destination}
                </p>
                <p className="text-primary-dark font-semibold">
                  تاريخ المغادرة:{" "}
                  {new Date(formData.departure_date).toLocaleDateString(
                    "ar-EG",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                <p className="text-primary-dark font-semibold">
                  المقاعد الإجمالية: {formData.total_seats}
                </p>
                <p className="text-primary-dark font-semibold">
                  السعر: {formData.price} ل.س
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleConfirmEdit}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  تأكيد التعديل
                </button>
                <button
                  onClick={() => setIsEditConfirmationOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  disabled={loading}
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  onClick={handleDeleteTrip}
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

export default EditTrip;
