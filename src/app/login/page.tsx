"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useNotification } from "@/context/NotificationProvider";
import type { User } from "@supabase/supabase-js";
import AdminToolbar from "@/components/AdminToolbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: settings } = await supabase.from("site_settings").select("is_maintenance_mode").single();
        setIsMaintenanceMode(settings?.is_maintenance_mode || false);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.");
    } else {
      if (data.user?.email) {
        const message = `Zalogowano pomyślnie jako: ${data.user.email}`;
        const type = "success";
        router.push(`/?notification_message=${encodeURIComponent(message)}&notification_type=${type}`);
      } else {
        router.push("/");
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    const message = `Wylogowano pomyślnie.`;
    const type = "info";
    router.push(`/?notification_message=${encodeURIComponent(message)}&notification_type=${type}`);
  };

  if (loading) {
    return <main className="flex min-h-screen flex-col items-center justify-center bg-black" />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="w-full max-w-sm p-8 space-y-6 bg-neutral-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <Image
            src="/img/logo.svg"
            alt="DameDesign Logo"
            width={140}
            height={40}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Panel Administratora</h1>
        </div>

        {user ? (
          <div className="space-y-6 text-center">
            <div className="text-neutral-300 space-y-2">
              <p>
                Obecnie zalogowany jako:{" "}
                <strong className="text-white">{user.email}</strong>
              </p>
              <p>
                Poziom uprawnień:{" "}
                <strong className="text-accent">Administrator</strong>
              </p>
            </div>
            {/* Panel "Work In Progress" */}
            <div className="p-4 bg-neutral-800 rounded-lg">
              <AdminToolbar initialStatus={isMaintenanceMode} />
            </div>
            <button
              onClick={handleSignOut}
              className="w-full justify-center rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition-colors hover:bg-red-700"
            >
              Wyloguj się
            </button>
          </div>
        ) : (
          <>
            <p className="text-neutral-400 text-center">
              Zaloguj się, aby zarządzać treścią.
            </p>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Email"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Hasło</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Hasło"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full justify-center rounded-lg bg-accent px-4 py-3 font-bold text-black transition-colors hover:bg-accent-muted"
                >
                  Zaloguj się
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
