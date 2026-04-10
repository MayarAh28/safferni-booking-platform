import React, { useState, useEffect } from "react";
import ManagerHeader from "@/components/ManagerHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// استيراد مكونات التقويم والنافذة المنبثقة
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
// استيراد الدوال الضرورية
import { cn } from "@/lib/utils";
import { format, startOfDay } from "date-fns";
import { arEG } from "date-fns/locale";

// استيراد مكتبة framer-motion لإضافة الحركة
import { motion, AnimatePresence } from "framer-motion";
// استيراد أيقونة الدوران من FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import WhiteBackground from "/WhiteBackground.jpg";

const AddTrip = () => {
  const { authToken, user } = useAuth();
  const API_CREATE_URL = "http://127.0.0.1:8000/trips/create/";
  const API_COMPANIES_URL = "http://127.0.0.1:8000/companies/companies/";

  const [formData, setFormData] = useState({
    company: "",
    origin: "",
    destination: "",
    total_seats: "",
    price: "",
  });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companyFound, setCompanyFound] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAndSetCompany = async () => {
      if (!authToken || !user) {
        setCompaniesLoading(false);
        return;
      }
      try {
        const response = await axios.get(API_COMPANIES_URL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const fetchedCompanies = response.data;
        setCompanies(fetchedCompanies);

        const matchedCompany = fetchedCompanies.find(
          (comp) =>
            comp.company_name.trim().toLowerCase() ===
            user.username.trim().toLowerCase()
        );

        if (matchedCompany) {
          setFormData((prevData) => ({
            ...prevData,
            company: matchedCompany.id.toString(),
          }));
          setCompanyFound(true);
        } else {
          console.warn("No company found matching the username.");
          toast.error("لم يتم العثور على شركة مطابقة لحسابك.", {
            description: "الرجاء التواصل مع الدعم الفني.",
          });
          setCompanyFound(false);
        }
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        toast.error("فشل تحميل قائمة الشركات. يرجى المحاولة لاحقًا.");
        setCompanyFound(false);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchAndSetCompany();
  }, [authToken, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.company ||
      !formData.origin ||
      !formData.destination ||
      !date ||
      !time ||
      formData.total_seats === "" ||
      formData.price === ""
    ) {
      toast.error("الرجاء ملء جميع الحقول الإجبارية.", {
        description: "تأكد من إدخال جميع المعلومات المطلوبة.",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsDialogOpen(false);
    setLoading(true);

    const departureDateTime = new Date(
      `${format(date, "yyyy-MM-dd")}T${time}:00`
    );

    const tripData = {
      company: parseInt(formData.company),
      origin: formData.origin,
      destination: formData.destination,
      departure_date: departureDateTime.toISOString(),
      total_seats: parseInt(formData.total_seats),
      available_seats: parseInt(formData.total_seats),
      price: parseFloat(formData.price),
    };

    if (tripData.total_seats <= 0) {
      toast.error("عدد المقاعد الإجمالية يجب أن يكون أكبر من صفر.", {
        description: "الرجاء إدخال عدد صحيح موجب للمقاعد.",
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(API_CREATE_URL, tripData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("تمت إضافة الرحلة بنجاح!", {
        description: "يمكنك الآن عرض الرحلات في قائمة الرحلات.",
      });
      setFormData({
        company: formData.company,
        origin: "",
        destination: "",
        total_seats: "",
        price: "",
      });
      setDate(null);
      setTime("");
    } catch (err) {
      console.error(
        "Failed to create trip:",
        err.response ? err.response.data : err.message
      );
      const errorMessage =
        err.response?.data?.message ||
        "فشل إضافة الرحلة. الرجاء المحاولة مرة أخرى.";
      toast.error(errorMessage, {
        description:
          "حدث خطأ أثناء الاتصال بالخادم. تأكد من أن جميع البيانات صحيحة.",
      });
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "confirmation-overlay") {
      setIsDialogOpen(false);
    }
  };

  if (!companyFound && !companiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          خطأ: لا يمكن العثور على معرّف الشركة.
        </h1>
        <p className="text-gray-700 text-lg">
          لا يوجد شركة مسجلة بنفس اسم المستخدم. يرجى التأكد من أن اسم المستخدم
          يطابق اسم الشركة.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* إضافة الأنماط المخصصة للنافذة المنبثقة */}
      <style>
        {`
          .bg-modal-overlay {
            background-color: rgba(0, 0, 0, 0.6);
          }
        `}
      </style>
      <ManagerHeader />
      <div
        className="min-h-[calc(100vh-62px)] mt-[62px] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
        style={backgroundStyle}
      >
        <Card className="w-full max-w-2xl shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-primary-dark mb-2">
              إضافة رحلة جديدة
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              الرجاء إدخال تفاصيل الرحلة الجديدة.
            </CardDescription>
            <Separator className="my-4 bg-secondary-light" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="company"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    الشركة:
                  </Label>
                  <Select value={formData.company} dir="rtl" disabled>
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="جاري تحديد شركتك..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>الشركات</SelectLabel>
                        {companiesLoading ? (
                          <div className="p-2 text-gray-500 text-sm text-center">
                            جاري تحميل الشركات...
                          </div>
                        ) : (
                          companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id.toString()}
                            >
                              {company.company_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="origin"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    نقطة الانطلاق:
                  </Label>
                  <Input
                    type="text"
                    id="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="مثال: دمشق"
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="destination"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    الوجهة:
                  </Label>
                  <Input
                    type="text"
                    id="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="مثال: اللاذقية"
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="departure_date"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    تاريخ ووقت المغادرة:
                  </Label>
                  <div className="flex flex-row-reverse gap-4">
                    <Popover dir="rtl">
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-end text-right font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            format(date, "PPP", { locale: arEG })
                          ) : (
                            <span className="ml-auto">اختر تاريخًا</span>
                          )}
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="ml-2"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < startOfDay(new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="total_seats"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    المقاعد الإجمالية:
                  </Label>
                  <Input
                    type="number"
                    id="total_seats"
                    value={formData.total_seats}
                    onChange={handleChange}
                    placeholder="مثال: 50"
                    min="1"
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="price"
                    className="text-right block mb-2 text-gray-700 font-medium"
                  >
                    سعر المقعد:
                  </Label>
                  <Input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="مثال: 20000.00"
                    step="0.01"
                    className="w-full text-right border-gray-300 focus:border-primary-blue focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-primary-dark cursor-pointer hover:bg-primary-dark text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={loading || companiesLoading || !companyFound}
              >
                {loading ? "جاري الإضافة..." : "إضافة رحلة الباص"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* النافذة المنبثقة المخصصة */}
      <AnimatePresence>
        {isDialogOpen && (
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
                تأكيد إضافة الرحلة
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                هل أنت متأكد من إضافة هذه الرحلة بالمعلومات التالية؟
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
                  {date ? format(date, "PPP", { locale: arEG }) : "غير محدد"}{" "}
                  {time ? `في الساعة: ${time}` : "الوقت غير محدد"}
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
                  onClick={handleConfirmSubmit}
                  className="bg-primary-dark hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>تأكيد الإضافة</>
                  )}
                </button>
                <button
                  onClick={() => setIsDialogOpen(false)}
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
    </>
  );
};

export default AddTrip;
