"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { UserLoginFormData, userLoginSchema } from "@/lib/schemas";
import { useLoginUserMutation } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthLogoSection from "@/components/auth/AuthLogoSection";
import FormNavigation from "@/components/auth/FormNavigation";
import DividerWithText from "@/components/auth/DividerWithText";
import SocialAuthButton from "@/components/auth/SocialAuthButton";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const methods = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<UserLoginFormData> = useCallback(
    async (data: UserLoginFormData) => {
      try {
        const { access_token } = await loginUser(data).unwrap();
        localStorage.setItem("token", access_token);
        router.push("/");
      } catch (error) {
        console.error("Failed to log in:", error);
      }
    },
    [loginUser, router],
  );

  return (
    <AuthFormContainer>
      <div className="flex flex-col justify-evenly gap-8 md:flex-row md:gap-16">
        <AuthLogoSection title="Welcome back! We have missed you" />

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="w-full space-y-4 lg:w-80"
          >
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@gmail.com"
              className="border-none"
            />
            <CustomFormField
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              className="border-none"
            />
            <Link href="/forgot-password">
              <p className="ml-2 mt-2 font-[Sansita] text-xs italic text-primary-600 hover:text-primary-500 hover:underline">
                Forgot password?
              </p>
            </Link>
            <FormNavigation
              mainActionLabel="Login"
              secondaryAction={{
                label: "Don't have an account?",
                href: "/register",
              }}
              isLoading={isLoading}
            />

            <DividerWithText text="Or" />

            <SocialAuthButton />
          </form>
        </Form>
      </div>
    </AuthFormContainer>
  );
};

export default LoginPage;
