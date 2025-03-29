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
    <div className="max-w-screen relative min-h-screen">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 flex flex-col items-center justify-center gap-0 rounded-2xl bg-[#97F8E442] p-8 md:absolute md:left-[32%] md:top-[10%] md:flex-row md:gap-10 lg:left-[35%] xl:left-[40%] xl:gap-20"
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
            width={200}
            height={200}
            className="mb-5"
          />
          <h1 className="w-full text-center font-[Sansita] text-3xl font-extrabold uppercase text-primary-500 md:text-2xl xl:text-3xl">
            Welcome back! We have missed you
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
