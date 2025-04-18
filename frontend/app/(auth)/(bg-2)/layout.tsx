import React from "react";

const AuthLayout = ({ children }: LayoutProps) => (
  <main className="relative h-screen w-full overflow-hidden bg-[#e2eced]">
    <div className="absolute inset-0 hidden sm:block">
      <img
        src="/bg-2.svg"
        alt="background"
        className="h-full w-full object-cover"
        style={{ objectPosition: "center bottom" }}
      />
    </div>
    <div className="container relative mx-auto px-4 md:left-[10%] md:top-40">
      {children}
    </div>
  </main>
);

export default AuthLayout;
