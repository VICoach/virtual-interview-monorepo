import React from "react";
import { motion } from "framer-motion";

const AuthFormContainer = ({ children }: LayoutProps) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className="mt-8 rounded-2xl bg-[#97F8E442] p-8 md:mx-auto md:max-w-xl lg:max-w-3xl"
  >
    {children}
  </motion.div>
);

export default AuthFormContainer;
