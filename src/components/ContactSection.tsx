"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { UploadCloud, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Tutaj w przyszłości będzie logika wysyłania formularza do Supabase
    setShowSuccessPopup(true);
    setFiles([]); // Wyczyść pliki po wysłaniu
    e.currentTarget.reset(); // Zresetuj pola formularza
  };

  return (
    <AnimatedSection>
      <AnimatePresence>
        {showSuccessPopup && (
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
              <CheckCircle size={48} className="mx-auto text-accent mb-4" />
              <h3 className="text-2xl font-bold font-mona-sans text-white mb-2">
                Wiadomość wysłana!
              </h3>
              <p className="text-neutral-400 mb-6">
                Dziękuję za kontakt. Skontaktuję się z Tobą najszybciej, jak to
                możliwe.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-accent text-black font-bold px-6 py-2 rounded-lg hover:bg-accent-muted transition-colors"
              >
                Zamknij
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="kontakt"
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg_contact.png')",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold font-mona-sans leading-tight">
                Masz pomysł?
                <br />
                Porozmawiajmy.
              </h2>
              <p className="mt-4 text-lg text-neutral-400">
                Wypełnij formularz lub napisz bezpośrednio na{" "}
                <a
                  href="mailto:kontakt@damedesign.pl"
                  className="text-accent hover:underline"
                >
                  kontakt@damedesign.pl
                </a>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  Twój email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Twój email"
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">
                  Tytuł
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  placeholder="Tytuł wiadomości"
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Wiadomość
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  placeholder="Twoja wiadomość..."
                  className="w-full bg-neutral-800/80 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="attachment"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "bg-neutral-800/80 border-accent"
                      : "bg-neutral-900/80 hover:bg-neutral-800/80"
                  }`}
                >
                  <UploadCloud size={32} className="text-neutral-500 mb-2" />
                  <span className="text-neutral-400">
                    Przeciągnij i upuść pliki tutaj
                  </span>
                  <span className="text-neutral-500 text-sm mt-1">
                    lub kliknij, aby wybrać
                  </span>
                </label>
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-400">Wybrane pliki:</p>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-neutral-800/80 p-2 rounded-md text-sm"
                      >
                        <span className="text-neutral-300 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="text-neutral-500 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors"
                >
                  Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
