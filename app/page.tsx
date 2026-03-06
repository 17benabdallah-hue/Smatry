'use client';

import { useState, useEffect } from "react";
import AddReminder from "./pages/AddReminder";
import { ReminderStorage } from "./ReminderStorage";
import { useLanguage } from "../lib/LanguageContext";

export default function Home() {
  const [showAdd, setShowAdd] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    setReminders(ReminderStorage.getAll());
  }, [showAdd]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6">
      {/* عنوان التطبيق */}
      <h1 className="text-3xl font-bold mb-6">
        {t.app_name}
      </h1>

      <p className="mb-8 text-center text-gray-500">
        {t.smart_suggestions}
      </p>

      {/* زر إضافة تذكير */}
      <button
        onClick={() => setShowAdd(true)}
        className="bg-purple-600 text-white px-6 py-3 rounded-xl"
      >
        {t.new_reminder}
      </button>

      {/* نافذة إضافة التذكير */}
      {showAdd && (
        <div className="mt-8 w-full max-w-md">
          <AddReminder />
          <button
            onClick={() => setShowAdd(false)}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
          >
            {t.cancel}
          </button>
        </div>
      )}

      {/* قائمة التذكيرات */}
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{t.active_reminders}</h2>
        {reminders.length === 0 ? (
          <p className="text-gray-500">{t.no_active_reminders}</p>
        ) : (
          <ul className="space-y-2">
            {reminders.map((r) => (
              <li key={r.id} className="p-3 bg-white rounded-lg shadow">
                {r.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
