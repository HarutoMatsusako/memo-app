"use client";

import { useState } from "react";

interface NewMemoFormProps {
  onSave: (memo: { title: string; content: string }) => void;
  onCancel: () => void;
}

export default function NewMemoForm({ onSave, onCancel }: NewMemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() && !content.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (response.ok) {
        const newMemo = await response.json();
        onSave(newMemo);
        setTitle("");
        setContent("");
      } else {
        console.error("Failed to create memo");
      }
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold text-gray-900 w-full border-none outline-none bg-transparent"
          placeholder="Untitled"
        />
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full border-none outline-none resize-none text-gray-700 leading-relaxed"
          placeholder="Start writing your note..."
        />
      </div>

      {/* アクションボタン */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
