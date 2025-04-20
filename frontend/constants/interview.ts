
// Interview types
export const INTERVIEW_TYPES = {
    MOCKUP: 'mockup',
    QUESTION_BY_QUESTION: 'question-by-question',
    TECHNICAL: 'technical',
  };
  
  // Interview options configuration
  export const INTERVIEW_OPTIONS = [
    {
      id: INTERVIEW_TYPES.MOCKUP,
      title: "MOCKUP INTERVIEW",
      description: "SIMULATE A REAL INTERVIEW WITH ROLE-SPECIFIC QUESTIONS, TIMED CONDITIONS, AND DETAILED PERFORMANCE FEEDBACK.",
      link: "/interview/mockup",
      iconPath: "/mock-interview.png",
    },
    {
      id: INTERVIEW_TYPES.QUESTION_BY_QUESTION,
      title: "QUESTION-BY-QUESTION INTERVIEW",
      description: "FOCUS ON SINGLE QUESTIONS WITH INSTANT FEEDBACK. PRACTICE VARIOUS QUESTION TYPES, GET TIPS, AND REFINE RESPONSES FOR TARGETED SKILL IMPROVEMENT.",
      link: "/interview/question-by-question",
      iconPath: "/qbq-interview.png",
    },
    {
      id: INTERVIEW_TYPES.TECHNICAL,
      title: "TECHNICAL INTERVIEW",
      description: "DESIGNED FOR TECHNICAL ROLES, THIS MODE FEATURES CODING CHALLENGES, REAL-TIME FEEDBACK, AND DYNAMIC CONSTRAINTS TO BOOST PROBLEM-SOLVING.",
      link: "/interview/technical",
      iconPath: "/technical-inetrview.png",
    },
  ];
  
  // Interview progress steps
  export const INTERVIEW_STEPS = [
    "CHOOSE A MODE", 
    "FOLLOW THE STEPS", 
    "PRACTICE", 
    "GET YOUR DREAM JOB"
  ];
  

  export const UI_CONSTANTS = {
    ICON_SIZE: {
      width: 40,
      height: 40
    },
    CONTAINER_SIZE: {
      width: 20,
      height: 20
    },
    BREAKPOINTS: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280
    },
    ANIMATION: {
      duration: 300,
      floatDuration: 15
    }
  };
  
  // Routes
  export const ROUTES = {
    HOME: "/",
    INTERVIEW: "/interview",
    MOCKUP_INTERVIEW: "/interview/mockup",
    QBQ_INTERVIEW: "/interview/question-by-question",
    TECHNICAL_INTERVIEW: "/interview/technical",
  };