"use client";
import { useState } from "react";
import { UploadCloud, X, CheckCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useNotification } from "@/context/NotificationProvider";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

export default function ContactSection() {
  const [files, setFiles] = useState<{ name: string, url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const supabase = createClient();
  const { addNotification } = useNotification();

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };
  
  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === 'object' && 'secure_url' in results.info) {
      const info = results.info;
      setFiles(prev => [...prev, { name: (info as any).original_filename || 'załącznik', url: info.secure_url }]);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!privacyAccepted) {
      addNotification("Musisz zaakceptować politykę prywatności.", "error");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Krok 1: Zapisz dane w Supabase
    const { error: supabaseError } = await supabase.from('contact_submissions').insert({
        email,
        subject,
        message,
        attachment_urls: files.map(f => f.url)
    });

    if (supabaseError) {
      addNotification(`Błąd zapisu w bazie: ${supabaseError.message}`, 'error');
      setIsSubmitting(false);
      return;
    }

    // ---> POCZĄTEK ZMIANY: Krok 2 - Wyślij email przez nasze API
    try {
      const emailPayload = {
        email,
        subject,
        message,
        attachments: files,
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        throw new Error('Wysyłka maila nie powiodła się.');
      }
      
      // Wszystko się udało, pokaż popup sukcesu
      setShowSuccessPopup(true);
      setFiles([]);
      form.reset();
      setPrivacyAccepted(false);

    } catch (emailError) {
      addNotification(`Błąd wysyłki maila: ${(emailError as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
    // ---> KONIEC ZMIANY
  };

  return (
    <>
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-neutral-900 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full mx-4 shadow-2xl">
              <CheckCircle size={48} className="mx-auto text-accent mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold font-druk-wide text-white mb-2">Wiadomość wysłana!</h3>
              <p className="text-neutral-400 mb-6 text-sm sm:text-base">Dziękuję za kontakt. Skontaktuję się z Tobą najszybciej, jak to możliwe.</p>
              <button onClick={() => setShowSuccessPopup(false)} className="bg-accent text-black font-bold px-6 py-2 rounded-lg hover:bg-accent-muted transition-colors text-sm sm:text-base">Zamknij</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="kontakt" className="relative py-16 sm:py-24 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/img/bg_contact.png')" }}>
        <div className="absolute inset-0 bg-black/70" />
        {/* Animacja zawartości */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-druk-wide leading-tight">Masz pomysł?<br />Porozmawiajmy.</h2>
              <p className="mt-4 text-base sm:text-lg text-neutral-400">Wypełnij formularz lub napisz bezpośrednio na: <a href="mailto:kontakt@damedesign.pl" className="text-accent hover:underline">kontakt@damedesign.pl</a></p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">Twój email</label>
                <input type="email" name="email" id="email" required placeholder="Twój email" className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">Tytuł</label>
                <input type="text" name="subject" id="subject" required placeholder="Tytuł wiadomości" className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Wiadomość</label>
                <textarea name="message" id="message" required rows={4} placeholder="Twoja wiadomość..." className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent text-sm"></textarea>
              </div>
              <div>
                <CldUploadWidget 
                  uploadPreset="ml_default" 
                  onSuccess={handleUploadSuccess} 
                  onUploadAdded={() => setIsUploading(true)}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-lg p-4 text-center transition-colors bg-neutral-900/80 hover:bg-neutral-800/80 hover:border-accent">
                      <UploadCloud size={20} className="text-neutral-500 mb-2" />
                      <span className="text-neutral-400 text-sm">Załącz inspiracje</span>
                      <span className="text-neutral-500 text-xs mt-1">{isUploading ? "Przesyłanie..." : "Przeciągnij i upuść lub kliknij"}</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-400">Wybrane pliki:</p>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-neutral-800/80 p-2 rounded-md text-sm">
                        <span className="text-neutral-300 truncate max-w-[70%]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(file.name)} className="text-neutral-500 hover:text-white p-1">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="privacy" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="sr-only peer" />
                <label htmlFor="privacy" className="cursor-pointer flex items-center justify-center w-4 h-4 border-2 border-neutral-600 rounded-md peer-checked:bg-accent peer-checked:border-accent transition-colors mt-0.5 flex-shrink-0">
                  <Check size={12} className={`text-black transition-opacity ${privacyAccepted ? 'opacity-100' : 'opacity-0'}`} />
                </label>
                <label htmlFor="privacy" className="text-xs text-neutral-400 cursor-pointer">
                  Akceptuję <Link href="/polityka-prywatnosci" className="underline hover:text-accent">politykę prywatności</Link>.
                </label>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting || !privacyAccepted} className="bg-accent text-black font-bold px-6 py-2 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed text-sm">
                  {isSubmitting ? "Wysyłanie..." : "Wyślij"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>
    </>
  );
}