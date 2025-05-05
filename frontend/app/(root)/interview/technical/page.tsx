"use client"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CustomFormField } from "@/components/CustomFormFieldInterview"
import { Button } from "@/components/ui/button"
import { Clock, BarChart2, Globe, Briefcase, GraduationCap, FileText, Building, Laptop } from "lucide-react"


// Form validation schema
const formSchema = z.object({
  language: z.string().min(1, "Language is required"),
  duration: z.string().min(1, "Duration is required"),
  difficultyLevel: z.string().min(1, "Difficulty level is required"),
  programmingLanguage: z.string().min(1, "Programming language is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
})


type FormValues = z.infer<typeof formSchema>

// Options for select fields
const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "japanese", label: "Japanese" },
  { value: "arabic", label: "Arabic" },
]

const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "unspecified", label: "No specification" },
]

const jobTitleOptions = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full Stack Developer" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "mobile", label: "Mobile Developer" },
  { value: "data", label: "Data Scientist" },
  { value: "ai", label: "AI/ML Engineer" },
  { value: "qa", label: "QA Engineer" },
]

const difficultyOptions = [
  { value: "A", label: "A (Easy)" },
  { value: "B", label: "B (Medium)" },
  { value: "C", label: "C (Hard)" },
  { value: "D", label: "D (Expert)" },
  { value: "unspecified", label: "Unspecified" },
]

const educationLevelOptions = [
  { value: "self-taught", label: "Self-taught" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "engineer", label: "Engineering Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
]
const experienceLevelOptions = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "staff", label: "Staff" },
]

const programmingLanguageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "unspecified", label: "Unspecified" },
]
export default function InterviewConfigPage() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "",
      duration: "",
      difficultyLevel: "",
      programmingLanguage: "",
      educationLevel: "",
      jobTitle: "",
      experienceLevel: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data)
  }

  return (
    <main className="min-h-screen md:h-screen bg-interview-gradient relative overflow-hidden flex items-center justify-center">

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="glass-panel max-w-6xl mx-auto rounded-3xl overflow-hidden backdrop-blur-lg bg-navy-blue-transparent border border-white/10">
          <div className="p-10">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Interview Configuration */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">INTERVIEW CONFIGURATION</h2>


                <div className="flex items-center gap-2 mb-4">
                  <div className="text-white">
                    <Globe size={20} />
                  </div>
                  <CustomFormField
                    name="language"
                    label="Language during the interview"
                    type="select"
                    options={languageOptions}
                    className="w-full"
                    labelClassName="text-white"
                    inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                  />
                </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <Clock size={20} />
                    </div>
                    <CustomFormField
                      name="duration"
                      label="Interview Duration:"
                      type="select"
                      options={durationOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <BarChart2 size={20} />
                    </div>
                    <CustomFormField
                      name="difficultyLevel"
                      label="Difficulty Level:"
                      type="select"
                      options={difficultyOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <Laptop size={20} />
                    </div>
                    <CustomFormField
                      name="Programming Language"
                      label="Programming Language:"
                      type="select"
                      options={programmingLanguageOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>


                </div>

                {/* Right column - Resume and Job Details */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">YOUR INFORMATION </h2>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <GraduationCap size={20} />
                    </div>
                    <CustomFormField
                      name="Education Level"
                      label="Education Level:"
                      type="select"
                      options={educationLevelOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>
              
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <Briefcase size={20} />
                    </div>
                    <CustomFormField
                      name="jobTitle"
                      label="Job Title:"
                      type="select"
                      options={jobTitleOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>

                  

                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white">
                      <Building size={20} />
                    </div>
                    <CustomFormField
                      name="Experience Level"
                      label="Experience Level:"
                      type="select"
                      options={experienceLevelOptions}
                      placeholder=""
                      className="w-full"
                      labelClassName="text-white"
                      inputClassName="bg-[rgba(23,45,82,0.6)] text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 px-6 rounded-full bg-[#3de0a1] hover:bg-[#2bc989] text-black font-medium transition-all duration-300 hover:shadow-[0_4px_15px_rgba(61,224,161,0.4)]"
                  >
                    Start
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </main>
  )
}
