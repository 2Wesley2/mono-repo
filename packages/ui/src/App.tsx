import React from "react";
import "./globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Bem-vindo ao CRM Code!
      </h1>
      {children}
    </div>
  );
};

export default RootLayout;
