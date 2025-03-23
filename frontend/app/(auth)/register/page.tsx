"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import {
  UserRegistrationFormData,
  userRegistrationSchema,
} from "@/lib/schemas";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRegisterUserMutation } from "@/state/api";

const RegisterPage = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const methods = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "test",
      email: "test@gmail.com",
      password: "Aa123456@",
      confirmPassword: "Aa123456@",
    },
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log("Registration response:", response);
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <div className="min-w-80 p-4">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mt-5 flex flex-col justify-between">
            <div className="space-y-4">
              <CustomFormField
                name="username"
                label="Username"
                type="text"
                placeholder="eg. johndoe"
                className="border-none"
              />
            </div>
            <div className="mt-4 space-y-4">
              <CustomFormField
                name="email"
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                className="border-none"
              />
            </div>
            <div className="mt-4 space-y-4">
              <CustomFormField
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                className="border-none"
              />
            </div>
            <div className="my-4 space-y-4">
              <CustomFormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="********"
                className="border-none"
              />
            </div>
            <Button variant="outline" type="submit">
              Sign up
            </Button>
            <p className="mt-2 text-center text-xs">
              <span>Already have an account? </span>
              <Link href="/login">
                <span className="text-primary-600 hover:text-primary-500 hover:underline">
                  Sign in instead
                </span>
              </Link>
            </p>

            <div className="text-customgreys-dirtyGrey flex items-center justify-center space-x-2 py-4 text-sm">
              <div className="bg-primary-500 h-px w-full" />
              <span>OR</span>
              <div className="bg-primary-500 h-px w-full" />
            </div>
            <Button className="w-full" type="button">
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Continue with Google
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
