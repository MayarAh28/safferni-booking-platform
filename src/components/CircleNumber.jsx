import React from "react";

const CircleNumber = ({ number, text }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full text-primary-dark font-bold text-2xl border-4 border-primary-dark flex items-center justify-center bg-white">
        {number}
      </div>
      <p className="font-bold text-primary-dark w-full mt-2">
        {text}
      </p>
    </div>
  );
};

export default CircleNumber;