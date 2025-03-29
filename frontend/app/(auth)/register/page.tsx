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
import { motion } from "framer-motion";

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

  const onSubmit = async (data: UserRegistrationFormData) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log("Registration response:", response);
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return (
    <div className="max-w-screen relative min-h-screen">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 flex flex-col items-start justify-center gap-0 rounded-2xl bg-[#97F8E442] p-8 md:absolute md:left-[32%] md:top-[10%] md:flex-row md:gap-10 lg:left-[35%] xl:left-[40%] xl:gap-20"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col items-center md:max-w-60"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={180}
            className="mb-5"
          />
          <h1 className="w-full text-center font-[Sansita] text-3xl font-extrabold uppercase text-primary-500 md:text-2xl xl:text-3xl">
            Create your free account now!
          </h1>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full lg:w-64 xl:w-72"
        >
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-col justify-between">
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
                <div className="mt-4 flex items-center justify-between">
                  <Link href="/login">
                    <span className="ml-2 text-center font-[Sansita] text-sm italic text-primary-300 hover:text-primary-400 hover:underline">
                      Already have an account?
                    </span>
                  </Link>
                  <Button className="w-2/5" variant="outline" type="submit">
                    Sign up
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2 py-4 text-sm">
                  <div className="h-px w-full bg-primary-400" />
                  <span className="font-[Sansita] text-sm text-primary-400">
                    Or
                  </span>
                  <div className="h-px w-full bg-primary-400" />
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
