import { ReactNode } from "react";
import { ResetPasswordDto } from "../../backend/src/auth/dto/reset-password.dto";

declare global {
  interface LayoutProps {
    children: ReactNode;
  }

  interface AuthFormContainerProps extends LayoutProps {
    className?: string;
  }

  interface AuthLogoSectionProps {
    title: string;
  }
  interface FormNavigationProps {
    mainActionLabel: string;
    secondaryAction: {
      label: string;
      href: string;
    };
    isLoading?: boolean;
  }

  interface ApiResponse {
    status: "success" | "error";
    statusCode: number;
    message: string;
    data: any | null;
  }

  interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }

  
}

export {};
