"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useNotification } from "@/context/NotificationProvider";

export default function EditFaqPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pola formularza
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const { addNotification } = useNotification();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: faqData } = await supabase
        .from("faq_items")
        .select("*")
        .eq("id", id)
        .single();
      
      if (faqData) {
        setQuestion(faqData.question);
        setAnswer(faqData.answer);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, router, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("faq_items")
      .update({
        question: question,
        answer: answer,
      })
      .eq("id", id);

    setIsSubmitting(false);

    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Pytanie zostało pomyślnie zaktualizowane!", "success");
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>Wróć na stronę główną</span>
        </Link>

        <h1 className="text-4xl font-bold font-mona-sans mb-2">
          Edytuj pytanie (FAQ)
        </h1>
        <p className="text-neutral-400 mb-12">
          Zmień treść pytania lub odpowiedzi i zapisz zmiany.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-neutral-300 mb-2">Pytanie</label>
            <input type="text" id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white" />
          </div>
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-neutral-300 mb-2">Odpowiedź</label>
            <textarea id="answer" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white"></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600">
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
