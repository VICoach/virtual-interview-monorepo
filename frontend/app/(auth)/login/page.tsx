"use client";
import { CustomFormField } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserLoginFormData, userLoginSchema } from "@/lib/schemas";
import { useLoginUserMutation } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const methods = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: UserLoginFormData) => {
    try {
      const response = await loginUser(data).unwrap();
      console.log("Login response:", response);
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };

  return (
    <div className="max-w-screen relative flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-20 left-0 flex h-screen w-full items-center justify-center gap-4 sm:left-20 sm:gap-12 md:left-24 md:gap-16 lg:left-32 lg:gap-10 xl:left-44 xl:gap-16"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex w-24 flex-col items-center sm:w-32 lg:w-52 xl:w-60"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={180}
            className="mb-5 md:mb-10"
          />
          <h1 className="w-24 font-[Sansita] text-xs font-extrabold uppercase text-primary-500 sm:w-40 sm:text-lg lg:w-52 lg:text-2xl xl:w-60 xl:text-3xl">
            Welcome back! We have missed you
          </h1>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full max-w-52 md:max-w-60 lg:max-w-72 xl:max-w-80"
        >
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="mt-5 flex flex-col justify-between">
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
                <Link href="/forgot-password">
                  <p className="ml-2 mt-2 font-[Sansita] text-xs italic text-primary-600 hover:text-primary-500 hover:underline">
                    Forgot password?
                  </p>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <Link href="/register">
                    <span className="ml-2 text-center font-[Sansita] text-sm italic text-primary-300 hover:text-primary-400 hover:underline">
                      Don't have an account?
                    </span>
                  </Link>
                  <Button className="w-2/5" variant="outline" type="submit">
                    Login
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

export default LoginPage;
