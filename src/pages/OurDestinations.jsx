import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import WhiteBackground from "/WhiteBackground.jpg";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const API_TRIPS_URL = `${API_BASE_URL}/trips/create`;

const OurDestinations = () => {
  const { authToken, isLoading: isAuthLoading } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (authToken && !isAuthLoading) {
        try {
          setLoading(true);
          const response = await axios.get(API_TRIPS_URL, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const allTrips = response.data;
          const allRegions = new Set();
          allTrips.forEach((trip) => {
            allRegions.add(trip.origin);
            allRegions.add(trip.destination);
          });
          const uniqueDestinations = Array.from(allRegions).sort();
          setDestinations(uniqueDestinations);
          setError(null);
        } catch (err) {
          setError("فشل في جلب الوجهات. يرجى المحاولة مرة أخرى.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDestinations();
  }, [authToken, isAuthLoading]);

  const backgroundStyle = {
    backgroundImage: `url(${WhiteBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (loading || isAuthLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-[62px] text-center"
        style={backgroundStyle}
      >
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-4xl text-primary-dark ml-4"
        />
        <p className="text-xl text-gray-700">جاري تحميل الوجهات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-[62px] p-4"
        style={backgroundStyle}
      >
        <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-3xl mb-2"
          />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div
        className="min-h-screen pt-[100px] pb-12 bg-cover bg-center"
        style={backgroundStyle}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary-dark mb-4">
            وجهاتنا
          </h1>
          <p className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            اكتشف المدن التي نخدمها واستعد لرحلتك القادمة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <div
                key={destination}
                className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-secondary-dark text-5xl mb-4"
                />
                <h2 className="text-xl font-bold text-primary-dark">
                  {destination}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OurDestinations;
