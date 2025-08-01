"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "info";

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

const icons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const addNotification = (
    message: string,
    type: NotificationType = "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000); // Znika po 4 sekundach
  };
  
  useEffect(() => {
    const message = searchParams.get("notification_message");
    const type = searchParams.get("notification_type") as NotificationType;

    if (message && type) {
      addNotification(message, type);
      // Czyści URL, aby powiadomienie nie pojawiało się po odświeżeniu
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);


  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mt-6 mx-4"
            >
              <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg flex items-center gap-4">
                <div className="flex-shrink-0">{icons[notification.type]}</div>
                <p className="flex-grow text-white text-sm">
                  {notification.message}
                </p>
                <button
                  onClick={() => setNotification(null)}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
