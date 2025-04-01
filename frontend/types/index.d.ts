import { ReactNode } from "react";

declare global {
  interface LayoutProps {
    children: ReactNode;
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
}

export {};
