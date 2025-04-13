"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Replace icon components with image components - positioned to straddle card edge
const MockInterviewIcon = () => (
  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 flex justify-center items-center  rounded-full">
    <Image 
      src="/mock-interview.png" 
      alt="Mock Interview" 
      width={40} 
      height={40}
      className="object-contain"
    />
  </div>
);

const QAIcon = () => (
  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 flex justify-center items-center  rounded-full">
    <Image 
      src="/qbq-interview.png" 
      alt="Q&A Practice" 
      width={50} 
      height={50}
      className="object-contain"
    />
  </div>
);

const TechnicalIcon = () => (
  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 flex justify-center items-center  rounded-full">
    <Image 
      src="/technical-inetrview.png" 
      alt="Technical Interview" 
      width={50} 
      height={50}
      className="object-contain" 
    />
  </div>
);




const InterviewCategories = [
  { 
    icon: <MockInterviewIcon />, 
    title: "Mock Interview", 
    desc: "Simulate real interviews with role-specific questions, timed conditions, and detailed performance feedback.",
    link: "/interview/mock-interview"
  },
  { 
    icon: <QAIcon />, 
    title: "Q&A Practice", 
    desc: "Focus on single questions with instant feedback. Practice various types, get tips, and refine responses." ,
    link: "/interview/qbq-interview"
  },
  { 
    icon: <TechnicalIcon />, 
    title: "Technical Interview", 
    desc: "Coding challenges with real-time feedback and dynamic constraints to boost problem-solving skills." ,
    link: "/interview/technical-interview"

  },
];

export default function InterviewPage() {
  return (
    <main className="gradient-bg min-h-screen relative overflow-hidden">
      

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="glass-container max-w-6xl mx-auto">
          <div className="p-8">
            <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-6">
              Start An Interview
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
              {['CHOOSE A MODE', 'FOLLOW THE STEPS', 'PRACTICE','GET YOUR DREAM JOB'].map((text, index) => (
                <React.Fragment key={text}>
                  <div className="flex items-center gap-2">
                    <div className="step-indicator"></div>
                      
                    <p className="text-sm text-gray-500">{text}</p>
                  </div>
                  {index < 3 && <div className="step-connector"></div>}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {InterviewCategories.map((card, index) => (
                <div key={index} className="card-option group p-8 pt-16 flex flex-col items-center relative">
                  {card.icon}
                  <h3 className="text-white text-xl font-bold text-center mb-3 mt-1">{card.title}</h3>
                  <p className="text-sm text-center text-white leading-relaxed">
                    {card.desc}
                  </p>
                  <Link href={card.link} className="w-full">
                    <button className="start-btn mt-6 w-full py-3 group-hover:bg-opacity-100 group-hover:translate-y-0.5">
                      Get Started
                    </button>
                  </Link>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}