import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="max-w-screen min-h-screen overflow-hidden bg-[#e2eced] bg-cover bg-center bg-no-repeat px-4 sm:bg-[url('/auth-bg.png')]">
      {children}
    </div>
  );
};

export default AuthLayout;
