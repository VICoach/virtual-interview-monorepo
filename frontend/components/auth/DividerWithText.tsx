import React from "react";

const DividerWithText = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center space-x-2 py-4 text-sm">
    <div className="h-px w-full bg-primary-400" />
    <span className="font-[Sansita] text-sm text-primary-400">{text}</span>
    <div className="h-px w-full bg-primary-400" />
  </div>
);

export default DividerWithText;
