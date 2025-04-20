"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

interface InterviewCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

export default function InterviewCard({ icon, title, description, link }: InterviewCardProps) {
  return (
    <div className="interview-card relative bg-[rgba(23,45,82,0.6)] rounded-2xl border border-white/10 p-8 pt-16 flex flex-col items-center transition-all duration-300 hover:bg-[rgba(34,67,123,0.8)] hover:translate-y-[-5px] hover:shadow-[0_10px_30px_rgba(0,242,254,0.1)]">
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
        {icon}
      </div>
      
      <h3 className="text-white text-xl font-bold text-center mb-3 mt-1">
        {title}
      </h3>
      
      <p className="text-sm text-center text-white/90 leading-relaxed mb-6">
        {description}
      </p>
      
      <Link href={link} className="w-full mt-auto">
        <button className="w-full py-3 px-6 rounded-full bg-[rgba(20,38,70,0.6)] text-white font-medium transition-all duration-300 hover:bg-[rgba(25,48,90,0.8)] hover:shadow-[0_4px_15px_rgba(79,172,254,0.4)]">
          Start Interview
        </button>
      </Link>
    </div>
  );
}