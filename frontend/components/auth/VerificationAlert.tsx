import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface VerificationAlertProps {
  type: "loading" | "success" | "error" | "missing-token" | "oauth-success";
  countdown?: number;
}

const VerificationAlert = ({ type, countdown }: VerificationAlertProps) => {
  const alertConfig = {
    loading: {
      icon: AlertCircle,
      title: "Verifying your email",
      description: "Please wait while we verify your email address...",
      colorClasses: {
        container: "border-blue-200 bg-blue-50",
        icon: "text-blue-500",
        title: "text-blue-700",
        description: "text-blue-600",
      },
    },
    success: {
      icon: CheckCircle,
      title: "Email Verified Successfully",
      description: `Your email has been verified. Redirecting in ${countdown} ${countdown === 1 ? "second" : "seconds"}...`,
      colorClasses: {
        container: "border-green-200 bg-green-50",
        icon: "text-green-500",
        title: "text-green-700",
        description: "text-green-600",
      },
    },
    "oauth-success": {
      icon: CheckCircle,
      title: "Signed In Successfully",
      description: "You have been signed in successfully.",
      colorClasses: {
        container: "border-green-200 bg-green-50",
        icon: "text-green-500",
        title: "text-green-700",
        description: "text-green-600",
      },
    },
    error: {
      icon: AlertCircle,
      title: "Verification Failed",
      description: "Invalid or expired verification token.",
      colorClasses: {
        container: "border-red-200 bg-red-50",
        icon: "text-red-500",
        title: "text-red-700",
        description: "text-red-600",
      },
    },
    "missing-token": {
      icon: AlertCircle,
      title: "Missing Verification Token",
      description: "Please check your email for the verification link.",
      colorClasses: {
        container: "border-red-200 bg-red-50",
        icon: "text-red-500",
        title: "text-red-700",
        description: "text-red-600",
      },
    },
  };

  const { icon: Icon, title, description, colorClasses } = alertConfig[type];

  return (
    <Alert
      className={`${colorClasses.container} shadow-sm transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${colorClasses.icon}`} />
        <div>
          <AlertTitle className={`mb-1 font-medium ${colorClasses.title}`}>
            {title}
          </AlertTitle>
          <AlertDescription className={colorClasses.description}>
            {description}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default VerificationAlert;
