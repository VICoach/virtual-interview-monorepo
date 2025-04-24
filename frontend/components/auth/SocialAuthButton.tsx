import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const SocialAuthButton = () => (
  <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}>
    <Button className="w-full" type="button">
      <Image
        src="/google-icon.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-2"
        aria-hidden="true"
      />
      Continue with Google
    </Button>
  </Link>
);

export default SocialAuthButton;
