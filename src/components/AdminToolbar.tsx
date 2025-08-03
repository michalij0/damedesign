"use client";

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useNotification } from '@/context/NotificationProvider';
import { ShieldCheck, ShieldOff } from 'lucide-react';

export default function AdminToolbar({ initialStatus }: { initialStatus: boolean }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const { addNotification } = useNotification();

  const handleToggle = async () => {
    const newStatus = !isMaintenanceMode;
    
    const { error } = await supabase
      .from('site_settings')
      .update({ is_maintenance_mode: newStatus })
      .eq('singleton_check', true);

    if (error) {
      addNotification(`Błąd: ${error.message}`, 'error');
    } else {
      setIsMaintenanceMode(newStatus);
      addNotification(
        `Tryb "Work In Progress" został ${newStatus ? 'WŁĄCZONY' : 'WYŁĄCZONY'}.`,
        'info'
      );
      // Odśwież stronę, aby zobaczyć zmiany
      startTransition(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-4 p-3 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg">
      <div className="flex items-center gap-2">
        {isMaintenanceMode ? (
          <ShieldCheck size={20} className="text-green-500" />
        ) : (
          <ShieldOff size={20} className="text-red-500" />
        )}
        <p className="text-sm text-white">
          {isMaintenanceMode ? "Tryb WIP: Aktywny" : "Strona: Publiczna"}
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-neutral-800 ${
          isMaintenanceMode ? 'bg-accent' : 'bg-neutral-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
