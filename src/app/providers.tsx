// src/app/providers.tsx
"use client";

import { NotificationProvider } from "@/context/NotificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}