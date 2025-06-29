"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

interface NewMemoFormProps {
  onSave: (memo: Memo) => void;
  onCancel: () => void;
}

export default function NewMemoForm({ onSave, onCancel }: NewMemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() && !content.trim()) {
      toast.error("タイトルまたは内容を入力してください");
      return;
    }

    try {
      console.log("Sending request to /api/memos with data:", {
        title: title.trim(),
        content: content.trim(),
      });

      const response = await fetch("/api/memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const newMemo = await response.json();
        console.log("Created memo:", newMemo);
        onSave(newMemo);
        setTitle("");
        setContent("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to create memo. Status:",
          response.status,
          "Error:",
          errorData
        );
        toast.error("メモの作成に失敗しました");
      }
    } catch (error) {
      console.error("Error creating memo:", error);
      toast.error("メモの作成に失敗しました");
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
          placeholder="メモタイトル"
        />
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full border-none outline-none resize-none text-gray-700 leading-relaxed"
          placeholder="ここにメモを入力してください"
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
