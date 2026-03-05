// app/pages/AddReminder.tsx
'use client';

import React, { useState } from 'react';
import { analyzeReminder, type ReminderAnalysis } from '@/lib/analysis';
import { useLanguage } from '@/lib/LanguageContext';

export default function AddReminder() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<ReminderAnalysis | null>(null);
  const { language } = useLanguage();

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const result = analyzeReminder(text, language);
    setAnalysis(result);
  };

  const handleSave = () => {
    if (!analysis) return;
    // حفظ التذكير في IndexedDB أو أي تخزين محلي آخر
    console.log('Saving reminder:', analysis);
    alert('تم حفظ التذكير!');
    setText('');
    setAnalysis(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">إضافة تذكير جديد</h1>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="اكتب تذكيرك هنا..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="bg-primary text-on-primary px-4 py-2 rounded mb-4"
      >
        تحليل التذكير
      </button>

      {analysis && (
        <div className="border p-3 rounded bg-surface-variant mb-4">
          <p>نوع الحدث: {analysis.eventType}</p>
          <p>وقت الحدث: {analysis.eventTime.toLocaleTimeString()}</p>
          <p>وقت التذكير التحذيري: {analysis.warningTime.toLocaleTimeString()}</p>
          <p>وقت التذكير النهائي: {analysis.finalTime.toLocaleTimeString()}</p>
          <p>الرسالة الذكية: {analysis.message}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-secondary text-on-secondary px-4 py-2 rounded"
      >
        حفظ التذكير
      </button>
    </div>
  );
}
