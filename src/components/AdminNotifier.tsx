"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bell, Check, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { useNotification } from "@/context/NotificationProvider";
import Link from "next/link";
import Image from "next/image";

interface Submission {
  id: number;
  created_at: string;
  email: string;
  subject: string;
  message: string;
  attachment_urls: string[];
  is_read: boolean;
}

export default function AdminNotifier() {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const supabase = createClient();
  const { addNotification } = useNotification();

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  const fetchSubmissions = useCallback(async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setSubmissions(data || []);
  }, [supabase]);

  useEffect(() => {
    const getUserAndSubmissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchSubmissions();
      }
    };
    getUserAndSubmissions();

    const channel = supabase
      .channel("contact_submissions_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_submissions" },
        (payload) => {
          fetchSubmissions();
          if (payload.eventType === 'INSERT') {
            new Audio('/sounds/ding.mp3').play();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchSubmissions]);

  const markAsRead = async (id: number) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
  };
  
  const handleDelete = async (id: number) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    addNotification("Wiadomość usunięta.", "success");
    if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
    }
  };

  if (!user) return null;

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 left-6 z-40 w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-accent hover:text-black transition-colors">
        <Bell size={24} />
        {unreadCount > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
            {unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-900 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col">
              <header className="p-4 border-b border-neutral-800 flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold text-white">Odebrane wiadomości</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white"><X size={20} /></button>
              </header>
              <div className="p-4 overflow-y-auto">
                {submissions.length > 0 ? (
                  <ul className="space-y-2">
                    {submissions.map(sub => (
                      <li key={sub.id} onClick={() => { setSelectedSubmission(sub); if (!sub.is_read) markAsRead(sub.id); }} className={`p-3 rounded-lg cursor-pointer transition-colors ${sub.is_read ? 'bg-neutral-800/50 hover:bg-neutral-800' : 'bg-accent/20 hover:bg-accent/30'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white">{sub.subject}</p>
                                <p className="text-sm text-neutral-400">{sub.email} - {new Date(sub.created_at).toLocaleString('pl-PL')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!sub.is_read && <button onClick={(e) => { e.stopPropagation(); markAsRead(sub.id); }} className="p-2 text-neutral-400 hover:text-white"><Check size={16} /></button>}
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-neutral-500 text-center py-8">Brak wiadomości.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedSubmission && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-neutral-900 rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col">
                <header className="p-4 border-b border-neutral-800 flex justify-between items-center flex-shrink-0">
                  <div>
                      <h3 className="text-lg font-bold text-white">{selectedSubmission.subject}</h3>
                      <p className="text-sm text-neutral-400">{selectedSubmission.email}</p>
                  </div>
                  <button onClick={() => setSelectedSubmission(null)} className="text-neutral-400 hover:text-white"><X size={20} /></button>
                </header>
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* ---> POCZĄTEK POPRAWKI <--- */}
                  <p className="text-white whitespace-pre-wrap break-words">{selectedSubmission.message}</p>
                  {/* ---> KONIEC POPRAWKI <--- */}

                  {selectedSubmission.attachment_urls && selectedSubmission.attachment_urls.length > 0 && (
                      <div>
                          <h4 className="font-bold text-neutral-300 mb-2">Załączniki:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {selectedSubmission.attachment_urls.map((url, i) => (
                                  <Link key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square bg-neutral-800 rounded-lg overflow-hidden">
                                      <Image src={url} alt={`Załącznik ${i+1}`} width={200} height={200} className="w-full h-full object-cover" />
                                  </Link>
                              ))}
                          </div>
                      </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}