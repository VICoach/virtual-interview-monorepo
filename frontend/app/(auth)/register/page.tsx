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

const RegisterPage = () => {
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
      console.log("Form data:", data);
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="font-dm-sans mt-5 flex flex-col justify-between gap-10 md:flex-row">
            <div className="basis-1/3">
              <div className="space-y-4">
                <CustomFormField
                  name="username"
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  className="border-none"
                />
              </div>
              <div className="mt-4 space-y-4">
                <CustomFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
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
              <div className="text-customgreys-dirtyGrey flex items-center justify-center space-x-2 py-4 text-sm">
                <div className="bg-primary-500 h-px w-full" />
                <span>OR</span>
                <div className="bg-primary-500 h-px w-full" />
              </div>
              <Link href="/login">
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
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
