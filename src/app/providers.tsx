// src/app/providers.tsx
"use client";

import { NotificationProvider } from "@/context/NotificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Tutaj w przyszłości możesz dodać więcej providerów
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}