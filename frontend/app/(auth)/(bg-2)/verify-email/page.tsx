"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import { Button } from "@/components/ui/button";
import VerificationAlert from "@/components/auth/VerificationAlert";
import { useVerifyEmailMutation } from "@/state/api";

const REDIRECT_PATH = "/login";
const INITIAL_COUNTDOWN = 3;

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [isTokenMissing, setIsTokenMissing] = useState(false);

  const handleRedirect = useCallback(() => {
    router.push(REDIRECT_PATH);
  }, [router]);

  useEffect(() => {
    if (!token) {
      setIsTokenMissing(true);
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmail({ token }).unwrap();
      } catch (error) {
        console.error("Email verification failed:", error);
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (countdown === 0) {
      handleRedirect();
    }
  }, [countdown, handleRedirect]);

  const handleResendVerification = useCallback(
    () => router.push("/resend-verification"),
    [router],
  );

  return (
    <AuthFormContainer className="bg-primary-100 md:max-w-xl lg:max-w-xl">
      <h1 className="w-full text-center font-[Sansita] text-2xl font-extrabold uppercase text-primary-500">
        Email Verification
      </h1>

      <div className="mt-8 flex w-full flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md">
          {isLoading && <VerificationAlert type="loading" />}
          {isSuccess && (
            <VerificationAlert type="success" countdown={countdown} />
          )}
          {isError && <VerificationAlert type="error" />}
          {isTokenMissing && <VerificationAlert type="missing-token" />}

          {(isError || isTokenMissing) && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="secondary"
                className="px-8 py-2"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthFormContainer>
  );
};

export default VerifyEmailPage;
