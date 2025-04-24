"use client";

import AuthFormContainer from "@/components/auth/AuthFormContainer";
import { CustomFormField } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ResetPasswordFormData, resetPasswordSchema } from "@/lib/schemas";
import { useResetPasswordMutation } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token. Please try again.");
      router.push("/login");
    }
  }, [token, router]);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        await resetPassword({
          token: token || "",
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }).unwrap();
        router.push("/login");
      } catch (error) {
        console.error("Failed to reset password:", error);
      }
    },
    [resetPassword, token, router],
  );

  return (
    <AuthFormContainer className="flex flex-col items-center justify-center bg-primary-100 md:max-w-xl lg:max-w-xl">
      <h1 className="font-[Sansita] text-2xl font-extrabold uppercase text-primary-500">
        Reset Password
      </h1>

      <div className="mt-6 w-full max-w-md">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="mx-auto flex w-full flex-col space-y-4 lg:w-80"
          >
            <CustomFormField
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="********"
            />

            <CustomFormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="********"
            />

            <Button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? "Resetting..." : "Reset Password"}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthFormContainer>
  );
};

export default ResetPasswordPage;
