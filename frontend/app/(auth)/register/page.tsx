"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import AuthLogoSection from "@/components/auth/AuthLogoSection";
import FormNavigation from "@/components/auth/FormNavigation";
import DividerWithText from "@/components/auth/DividerWithText";
import SocialAuthButton from "@/components/auth/SocialAuthButton";
import { useRegisterUserMutation } from "@/state/api";
import {
  UserRegistrationFormData,
  userRegistrationSchema,
} from "@/lib/schemas";

const RegisterPage = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const methods = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<UserRegistrationFormData> = useCallback(
    async (data: UserRegistrationFormData) => {
      try {
        const { username, email, password } = data;
        const response = await registerUser({
          username,
          email,
          password,
        }).unwrap();
        console.log("Registration response:", response);
      } catch (error) {
        console.error("Failed to register:", error);
      }
    },
    [registerUser],
  );

  return (
    <AuthFormContainer>
      <div className="flex flex-col justify-evenly gap-8 md:flex-row md:gap-16">
        <AuthLogoSection title="Create your free account now!" />

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="w-full space-y-4 lg:w-80"
          >
            <CustomFormField
              name="username"
              label="Username"
              type="text"
              placeholder="eg. johndoe"
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="example@gmail.com"
            />
            <CustomFormField
              name="password"
              label="Password"
              type="password"
              placeholder="********"
            />
            <CustomFormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="********"
            />

            <FormNavigation
              mainActionLabel="Sign up"
              secondaryAction={{
                label: "Already have an account?",
                href: "/login",
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

export default RegisterPage;
