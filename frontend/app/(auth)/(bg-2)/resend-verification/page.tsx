"use client";

import AuthFormContainer from "@/components/auth/AuthFormContainer";
import { CustomFormField } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ResendVerificationEmailFormData,
  resendVerificationEmailSchema,
} from "@/lib/schemas";
import { useSendVerificationEmailMutation } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ResendVerificationPage = () => {
  const [sendEmail, { isLoading }] = useSendVerificationEmailMutation();

  const methods = useForm<ResendVerificationEmailFormData>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ResendVerificationEmailFormData> = useCallback(
    async (data: ResendVerificationEmailFormData) => {
      try {
        const response = await sendEmail(data).unwrap();
        console.log("Email sent response:", response);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    },
    [sendEmail],
  );

  return (
    <AuthFormContainer className="flex flex-col items-center justify-center bg-primary-100 md:max-w-xl lg:max-w-xl">
      <h1 className="font-[Sansita] text-2xl font-extrabold uppercase text-primary-500">
        Resend Email Verification
      </h1>

      <div className="mt-6 w-full max-w-md">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="mx-auto flex w-full flex-col space-y-4 lg:w-80"
          >
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@gmail.com"
            />

            <Button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? "Sending..." : "Send Verification Email"}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Verification Email"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthFormContainer>
  );
};

export default ResendVerificationPage;
