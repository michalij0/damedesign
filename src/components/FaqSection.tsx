"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pencil, Trash2, PlusCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useNotification } from "@/context/NotificationProvider";
import Head from "next/head";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const AccordionItem = ({
  item,
  isOpen,
  onClick,
  user,
  onDeleteClick,
}: {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
  user: User | null;
  onDeleteClick: () => void;
}) => {
  return (
    <div className="border-b border-neutral-800 py-4 sm:py-6 group/item relative">
      {user && (
        <div className="absolute top-4 sm:top-6 right-10 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
          <Link href={`/admin/faq/edit/${item.id}`} className="p-1.5 sm:p-2 bg-neutral-800/80 rounded-full text-white hover:bg-accent hover:text-black transition-colors">
            <Pencil size={14} className="sm:size-16" />
          </Link>
          <button onClick={onDeleteClick} className="p-1.5 sm:p-2 bg-neutral-800/80 rounded-full text-white hover:bg-red-600 transition-colors">
            <Trash2 size={14} className="sm:size-16" />
          </button>
        </div>
      )}
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-base sm:text-lg font-medium text-white pr-12">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-neutral-500 w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-3 sm:pt-4 text-neutral-400 pr-8 text-sm sm:text-base">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [user, setUser] = useState<User | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<FaqItem | null>(null);

  const supabase = createClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    
        const { data } = await supabase.from("faq_items").select("*").order("created_at", { ascending: true });
        setFaqItems(data || []);
      } catch (error) {
        console.error("Błąd pobierania danych: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    const { error } = await supabase.from("faq_items").delete().eq("id", itemToDelete.id);
    
    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Pytanie zostało usunięte.", "success");
      setFaqItems(faqItems.filter(item => item.id !== itemToDelete.id));
    }
    setItemToDelete(null);
  };

  const generateFaqJsonLd = () => {
    if (faqItems.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  };

  if (loading) {
    return <section id="faq" className="py-16 sm:py-24 bg-black" />;
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqJsonLd()) }}
        />
      </Head>
      
      <section 
        id="faq" 
        className="relative py-16 sm:py-24 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/img/bg_testim.png')" }}
      >
        {/* Animacja zawartości */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl px-4 sm:px-6"
        >
          <div className="text-center mb-8 sm:mb-12 flex justify-center items-center gap-3 sm:gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-druk-wide">
              Często zadawane pytania
            </h2>
            {user && (
              <Link href="/admin/faq/new" className="group flex-shrink-0 inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-800 hover:bg-accent transition-colors">
                <PlusCircle size={16} className="sm:size-20 text-neutral-400 group-hover:text-black" />
              </Link>
            )}
          </div>
          <div className="max-w-3xl mx-auto">
            {faqItems.length > 0 ? (
              faqItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  user={user}
                  onDeleteClick={() => setItemToDelete(item)}
                />
              ))
            ) : (
              <div className="text-center py-12 sm:py-16 border border-dashed border-neutral-800 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-400">Brak pytań do wyświetlenia.</h3>
                {user && <p className="text-neutral-500 mt-2 text-sm sm:text-base">Kliknij "+", aby dodać pierwsze.</p>}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <DeleteConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        projectName={itemToDelete?.question || ""}
      />
    </>
  );
}