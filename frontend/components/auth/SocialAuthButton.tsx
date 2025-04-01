import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SocialAuthButton = () => (
  <Button className="w-full" type="button">
    <Image
      src="/google-icon.svg"
      alt="Google"
      width={20}
      height={20}
      className="mr-2"
      aria-hidden
    />
    Continue with Google
  </Button>
);

export default SocialAuthButton;
