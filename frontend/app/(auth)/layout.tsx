import React from "react";

const AuthLayout = ({ children }: LayoutProps) => (
  <main className="min-h-screen overflow-hidden bg-[#e2eced] sm:bg-[url('/auth-bg.png')] sm:bg-cover sm:bg-center sm:bg-no-repeat">
    <div className="container relative mx-auto px-4 md:left-[15%] md:top-10">
      {children}
    </div>
  </main>
);

export default AuthLayout;
