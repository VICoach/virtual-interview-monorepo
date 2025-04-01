import React from "react";
import Image from "next/image";

const AuthLogoSection = ({ title }: AuthLogoSectionProps) => (
  <div className="flex w-full flex-col items-center md:max-w-60">
    <Image
      src="/logo.png"
      alt="Logo"
      width={180}
      height={180}
      className="mb-5"
      priority
    />
    <h1 className="w-full text-center font-[Sansita] text-3xl font-extrabold uppercase text-primary-500 md:text-2xl xl:text-3xl">
      {title}
    </h1>
  </div>
);

export default AuthLogoSection;
