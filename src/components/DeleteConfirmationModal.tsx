"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}: DeleteConfirmationModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.getElementById("portal-root"));
  }, []);

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-neutral-900 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl"
          >
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-2xl font-bold font-mona-sans text-white mb-2">
              Czy na pewno?
            </h3>
            <p className="text-neutral-400 mb-6">
              Chcesz trwale usunąć projekt:{" "}
              <strong className="text-white">{projectName}</strong>? Tej operacji
              nie można cofnąć.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="bg-neutral-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={onConfirm}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Usuń
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
}
