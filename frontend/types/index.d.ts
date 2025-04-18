import { ReactNode } from "react";

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
}

export {};
