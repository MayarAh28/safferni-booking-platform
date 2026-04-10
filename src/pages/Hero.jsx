import React from "react";
import Header from "@/components/Header";
import Bus from "/WelcomeBus.png";
import YellowEffect from "/YellowEffect.png";
import DarkBlueEffect from "/DarkBlueEffect.png";
import WhiteLogo from "/WhiteLogo.png";
import { Button } from "@/components/ui/button";
import CircleNumber from "@/components/CircleNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faRoute,
  faUsers,
  faChevronRight,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Hero = () => {
  const busVariants = {
    hidden: { x: "-100vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 1, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10, delay: 1 },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="relative overflow-hidden w-full">
        <Header />
        <div className="relative container mx-auto min-h-screen w-full flex items-center ">
          <img
            src={YellowEffect}
            alt="Yellow Background Effect"
            className="absolute top-[-100px] right-[-200px] md:w-[800px] md:top-[-150px] md:right-[-450px] opacity-70"
          />
          <img
            src={DarkBlueEffect}
            alt="Dark Blue Background Effect"
            className="absolute bottom-[-100px] left-[-200px] md:w-[800px] md:bottom-[-150px] md:left-[-450px] rotate-10 opacity-70"
          />

          <div className="flex flex-col text-center items-center px-8 md:flex-row-reverse md:px-10 z-10">
            <motion.img
              src={Bus}
              alt="Safferni Welcome Bus"
              className="w-3/4 md:w-1/2"
              variants={busVariants}
              initial="hidden"
              animate="visible"
            />

            <motion.div
              className="md:text-right"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="font-bold text-primary-dark text-3xl mb-2.5 -mt-4 md:text-5xl md:mb-5">
                سفّرني - Safferni
              </h3>
              <p className="md:text-xl">
                "سفّرني" هي منصة رائدة لتسهيل حجز تذاكر السفر في محطات الإنطلاق
                عبر جميع المحافظات السورية. نقدم لكم تجربة سفر سلسة ومريحة, حيث
                يمكنك حجز تذكرتك بكل سهولة وأمان, والإستمتاع برحلات خالية من
                المتاعب.
              </p>
              
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Button
                    size="lg"
                    className=" cursor-pointer mt-5 bg-secondary-dark text-primary-dark font-bold hover:bg-secondary-light flex items-center gap-2"
                  >
                  <Link
                to="booking"
                className="flex justify-center md:justify-start items-center "
              >
                    احجز الآن <FontAwesomeIcon icon={faChevronRight} className="mr-1" />
                    </Link>
                  </Button>
                </motion.div>
            </motion.div>
          </div>
        </div>

        <div
          className="w-full relative top-0 left-0 overflow-x-hidden bg-primary-dark bg-cover py-12"
          style={{ backgroundImage: "url(/Background_01.jpg)" }}
        >
          <div className="container mx-auto py-12 px-8">
            <img
              src={WhiteLogo}
              alt="Safferni White Logo"
              className="w-3xs mx-auto mb-8"
            />
            <h3 className="text-white font-black text-center text-3xl mb-8 md:mb-12">
              لـمـاذا سـفّرني ؟
            </h3>
            <ul className="text-white flex flex-col gap-8 md:gap-12 md:flex-row md:flex-wrap md:justify-center">
              <motion.li
                className="md:w-1/3 p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
              >
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-dark flex items-center justify-center font-bold w-[35px] h-[35px] text-lg rounded-full bg-secondary-dark ml-2 flex-shrink-0">
                    1
                  </span>
                  <h4 className="inline-block font-bold text-xl text-secondary-light">
                    تجربة حجز سلسة وسريعة
                  </h4>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  - نقدم واجهة مستخدم بسيطة وبديهية تتيح لك حجز تذكرتك في دقائق
                  معدودة.
                  <br />- لا مزيد من الانتظار في الطوابير أو التعقيدات، كل ما
                  تحتاجه في مكان واحد.
                </p>
              </motion.li>

              <motion.li
                className="md:w-1/3 p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-dark flex items-center justify-center font-bold w-[35px] h-[35px] text-lg rounded-full bg-secondary-dark ml-2 flex-shrink-0">
                    2
                  </span>
                  <h4 className="inline-block font-bold text-xl text-secondary-light">
                    تغطية شاملة لجميع المحافظات السورية
                  </h4>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  - سواء كنت مسافرًا من دمشق، حلب، اللاذقية، أو أي محافظة أخرى،
                  لدينا تغطية كاملة لجميع المحطات والوجهات.
                </p>
              </motion.li>

              <motion.li
                className="md:w-1/3 p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-dark flex items-center justify-center font-bold w-[35px] h-[35px] text-lg rounded-full bg-secondary-dark ml-2 flex-shrink-0">
                    3
                  </span>
                  <h4 className="inline-block font-bold text-secondary-light text-xl">
                    أسعار تنافسية وعروض حصرية
                  </h4>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  - استمتع بأسعار مميزة وعروض خاصة تجعل سفرك أكثر اقتصادية.
                  <br />- نوفر خيارات دفع متنوعة وآمنة لراحتك.
                </p>
              </motion.li>

              <motion.li
                className="md:w-1/3 p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-baseline mb-2">
                  <span className="text-primary-dark flex items-center justify-center font-bold w-[35px] h-[35px] text-lg rounded-full bg-secondary-dark ml-2 flex-shrink-0">
                    4
                  </span>
                  <h4 className="inline-block font-bold text-secondary-light text-xl">
                    إدارة حجوزات مرنة
                  </h4>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  - قم بتعديل أو إلغاء حجوزاتك بكل سهولة في أي وقت.
                  <br />- نوفر لك تحكمًا كاملاً في رحلاتك دون أي تعقيدات.
                </p>
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="bg-secondary-lightest py-16">
          <div className="container mx-auto text-center px-8">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              أرقامنا تتحدث عنا
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              نفخر بتقديم أفضل خدمة لعملائنا، وهذه الأرقام خير دليل على نجاحنا
              وتميزنا.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={statItemVariants}
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-7xl text-primary-light mb-4"
                />
                <h3 className="text-5xl font-bold text-secondary-dark">
                  +50,000
                </h3>
                <p className="text-primary-dark mt-2 text-lg">شخص خدمناهم</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={statItemVariants}
                transition={{ delay: 0.2 }}
              >
                <FontAwesomeIcon
                  icon={faBus}
                  className="text-7xl text-primary-light mb-4"
                />
                <h3 className="text-5xl font-bold text-secondary-dark">+500</h3>
                <p className="text-primary-dark mt-2 text-lg">باص متاح</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={statItemVariants}
                transition={{ delay: 0.4 }}
              >
                <FontAwesomeIcon
                  icon={faRoute}
                  className="text-7xl text-primary-light mb-4"
                />
                <h3 className="text-5xl font-bold text-secondary-dark">
                  +10,000
                </h3>
                <p className="text-primary-dark mt-2 text-lg">رحلة ناجحة</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              كيف يعمل سفّرني؟
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              حجز تذكرتك بسيط وسريع. اتبع هذه الخطوات الثلاث السهلة لتبدأ رحلتك.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={statItemVariants}
              >
                <CircleNumber number="1" text="اختر وجهتك وتاريخ سفرك" />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={statItemVariants}
                transition={{ delay: 0.2 }}
              >
                <CircleNumber
                  number="2"
                  text="اختر الرحلة المناسبة واحجز مقعدك"
                />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={statItemVariants}
                transition={{ delay: 0.4 }}
              >
                <CircleNumber
                  number="3"
                  text="قم بالدفع واستلم تذكرتك الإلكترونية"
                />
              </motion.div>
            </div>
            <Link to="booking" className="inline-block mt-12">
              <Button
                size="lg"
                className="cursor-pointer bg-secondary-dark text-primary-dark font-bold hover:bg-secondary-light transition-colors duration-200"
              >
                ابدأ الحجز الآن
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-secondary-lightest py-16">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              آراء حقيقية من مسافرين سعداء جربوا خدماتنا.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 border-b-4 border-secondary-dark flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
              >
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="text-primary-light text-4xl mb-4"
                />
                <p className="text-gray-700 italic mb-4">
                  "أفضل منصة حجز جربتها على الإطلاق! سريعة وسهلة وخدمة العملاء
                  رائعة. شكراً لكم!"
                </p>
                <h4 className="font-bold text-primary-dark">- أحمد محمود</h4>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-md p-6 border-b-4 border-secondary-dark flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
                transition={{ delay: 0.2 }}
              >
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="text-primary-light text-4xl mb-4"
                />
                <p className="text-gray-700 italic mb-4">
                  "سهولة الحجز وإدارة الحجوزات هي ما يميز سفّرني. أنصح بها بشدة
                  لكل المسافرين."
                </p>
                <h4 className="font-bold text-primary-dark">- يارا علي</h4>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow-md p-6 border-b-4 border-secondary-dark flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={statItemVariants}
                transition={{ delay: 0.4 }}
              >
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="text-primary-light text-4xl mb-4"
                />
                <p className="text-gray-700 italic mb-4">
                  "الأسعار تنافسية للغاية والرحلات دقيقة في مواعيدها. تجربة
                  ممتازة من البداية للنهاية."
                </p>
                <h4 className="font-bold text-primary-dark">- محمد طاهر</h4>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
