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
      const response = await fetch("/api/memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (response.ok) {
        const newMemo = await response.json();
        onSave(newMemo);
        setTitle("");
        setContent("");
      } else {
        toast.error("メモの作成に失敗しました");
      }
    } catch (error) {
      toast.error("メモの作成に失敗しました");
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col min-h-0">
      <div className="border-b border-gray-200 p-4 md:p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl md:text-3xl font-bold text-gray-900 w-full border-none outline-none bg-transparent"
          placeholder="メモタイトル"
        />
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full border-none outline-none resize-none text-gray-700 leading-relaxed text-sm md:text-base"
          placeholder="ここにメモを入力してください"
        />
      </div>

      <div className="border-t border-gray-200 p-4 md:p-6">
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
          >
            保存
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 md:px-4 md:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
