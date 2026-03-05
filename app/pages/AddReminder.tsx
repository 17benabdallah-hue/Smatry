'use client';

import React, { useState } from 'react';
import { analyzeReminder, type ReminderAnalysis } from '@/lib/reminder-utils';
import { LanguageContext } from '@/lib/LanguageContext';

export default function AddReminder() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<ReminderAnalysis | null>(null);

  const { language } = React.useContext(LanguageContext);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const result = analyzeReminder(text, language);
    setAnalysis(result);
  };

  const handleSave = () => {
    if (!analysis) return;
    // هنا يمكنك حفظ التذكير في IndexedDB أو أي تخزين محلي
    console.log('Reminder saved:', { text, ...analysis });
    alert('تم حفظ التذكير بنجاح ✅');
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

      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAnalyze}
        >
          تحليل
        </button>

        {analysis && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            حفظ التذكير
          </button>
        )}
      </div>

      {analysis && (
        <div className="bg-gray-100 p-3 rounded border">
          <p>
            <strong>نوع الحدث:</strong> {analysis.eventType}
          </p>
          <p>
            <strong>وقت الحدث:</strong> {analysis.eventTime.toLocaleTimeString('ar-DZ')}
          </p>
          <p>
            <strong>التذكير التحذيري:</strong> {analysis.warningTime.toLocaleTimeString('ar-DZ')}
          </p>
          <p>
            <strong>التذكير النهائي:</strong> {analysis.finalTime.toLocaleTimeString('ar-DZ')}
          </p>
          <p>
            <strong>الرسالة الذكية:</strong> {analysis.message}
          </p>
          <p>
            <strong>مستوى الثقة:</strong> {analysis.confidence}%
          </p>
        </div>
      )}
    </div>
  );
}
