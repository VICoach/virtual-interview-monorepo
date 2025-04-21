"use client";

import React from 'react';
import InterviewCard from '@/components/InterviewCard';
import InterviewIcon from '@/components/InterviewIcon';
import { INTERVIEW_OPTIONS, INTERVIEW_STEPS } from '@/constants/interview';

export default function InterviewPage() {
  return (
    <main className="min-h-screen md:h-screen bg-interview-gradient relative overflow-hidden flex items-center justify-center">
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="glass-panel max-w-6xl mx-auto rounded-3xl overflow-hidden backdrop-blur-lg bg-navy-blue-transparent border border-white/10">
          <div className="p-10">
            
            <h1 className="text-white text-4xl sm:text-5xl font-bold text-center mb-8">
              START AN INTERVIEW
            </h1>
            
            
            <div className="flex flex-wrap justify-center items-center gap-2 mb-16">
              {INTERVIEW_STEPS.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/30"></div>
                    <span className="text-gray-400 text-sm font-medium">{step}</span>
                  </div>
                  {index < INTERVIEW_STEPS.length - 1 && (
                    <div className="w-8 h-px bg-gray-700"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
              {INTERVIEW_OPTIONS.map((option) => (
                <InterviewCard
                  key={option.id}
                  icon={
                    <InterviewIcon 
                      iconPath={option.iconPath}
                      alt={option.title}
                    />
                  }
                  title={option.title}
                  description={option.description}
                  link={option.link}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}