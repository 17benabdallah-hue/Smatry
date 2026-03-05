'use client';

import { useState } from "react";

export default function AddReminder() {

  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text) return;

    alert("تم إضافة التذكير: " + text);

    setText("");
  };

  return (

    <div className="bg-white p-6 rounded-2xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        إضافة تذكير
      </h2>

      <input
        type="text"
        placeholder="اكتب تذكيرك هنا..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        حفظ التذكير
      </button>

    </div>
  );
}
