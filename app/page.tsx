"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <main style={{ padding: 20 }}>
      <h1>Smarty</h1>

      <p>اكتب تذكيرك:</p>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="مثال: اشرب الدواء الساعة 16:00"
        style={{
          padding: 10,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      />

      <br />
      <br />

      <button
        style={{
          padding: 10,
          background: "#6750A4",
          color: "white",
          borderRadius: 8,
        }}
      >
        حفظ التذكير
      </button>
    </main>
  );
}
