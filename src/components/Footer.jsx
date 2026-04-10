// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/3 text-center md:text-right">
            <h2 className="text-3xl font-bold text-secondary-dark mb-2">
              سفّرني
            </h2>
            <p className="text-gray-300 text-sm">
              شريكك الموثوق في رحلات السفر البري. احجز تذكرتك بسهولة وسرعة
              واستمتع بمغامرة لا تُنسى.
            </p>
          </div>

          <div className="w-full md:w-1/3 text-center">
            <h3 className="text-xl font-bold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
                >
                  وجهاتنا
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
                >
                  حجز رحلة
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4 text-center md:text-right">
              تابعنا على
            </h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faXTwitter} size="2x" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary-dark transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} سفّرني. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
