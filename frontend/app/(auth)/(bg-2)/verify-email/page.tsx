"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

import AuthFormContainer from "@/components/auth/AuthFormContainer";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/state/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyEmail({ token }).unwrap();

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.log("Verification failed:", error);
      }
    };

    verifyToken();
  }, [token, verifyEmail, router]);

  const handleResendVerification = () => {
    router.push("/resend-verification");
  };

  return (
    <AuthFormContainer className="bg-primary-100 md:max-w-xl lg:max-w-xl">
      <h1 className="w-full text-center font-[Sansita] text-2xl font-extrabold uppercase text-primary-500">
        Email Verification
      </h1>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-4">
        <div className="w-full max-w-md">
          {isLoading && (
            <Alert className="border-blue-200 bg-blue-50 shadow-sm transition-all duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <div>
                  <AlertTitle className="mb-1 font-medium text-blue-700">
                    Verifying your email
                  </AlertTitle>
                  <AlertDescription className="text-blue-600">
                    Please wait while we verify your email address...
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          {isSuccess && (
            <Alert className="border-green-200 bg-green-50 shadow-sm transition-all duration-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <AlertTitle className="mb-1 font-medium text-green-700">
                    Email Verified Successfully
                  </AlertTitle>
                  <AlertDescription className="text-green-600">
                    Your email has been verified. You will be redirected to the
                    login page in{" "}
                    <span className="font-medium">{countdown}</span>{" "}
                    {countdown === 1 ? "second" : "seconds"}...
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          {isError && (
            <Alert className="border-red-200 bg-red-50 shadow-sm transition-all duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <AlertTitle className="mb-1 font-medium text-red-700">
                    Verification Failed
                  </AlertTitle>
                  <AlertDescription className="text-red-600">
                    We couldn't verify your email with the provided token. The
                    token may be invalid or expired.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          {isError && (
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
