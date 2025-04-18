import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AuthFormContainer = ({
  children,
  className = "bg-primary-100 md:max-w-xl lg:max-w-3xl",
}: AuthFormContainerProps) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className={cn(className, "mt-8 rounded-2xl p-8 md:mx-auto")}
  >
    {children}
  </motion.div>
);

export default AuthFormContainer;
