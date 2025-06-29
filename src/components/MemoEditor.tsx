"use client";

import { useState, useEffect } from "react";

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

interface MemoEditorProps {
  selectedMemo: Memo | null;
  onSave: (memo: Memo) => void;
  onCancel: () => void;
}

export default function MemoEditor({
  selectedMemo,
  onSave,
  onCancel,
}: MemoEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      setContent(selectedMemo.content);
      setIsEditing(false);
    } else {
      setTitle("");
      setContent("");
      setIsEditing(false);
    }
  }, [selectedMemo]);

  const handleSave = async () => {
    if (!selectedMemo) return;

    try {
      const response = await fetch(`/api/memos/${selectedMemo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const updatedMemo = await response.json();
        onSave(updatedMemo);
        setIsEditing(false);
      } else {
        console.error("Failed to save memo");
      }
    } catch (error) {
      console.error("Error saving memo:", error);
    }
  };

  const handleCancel = () => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      setContent(selectedMemo.content);
    }
    setIsEditing(false);
    onCancel();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!selectedMemo) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to your notes
          </h2>
          <p className="text-gray-500">
            Select a note from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 p-6">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold text-gray-900 w-full border-none outline-none bg-transparent"
            placeholder="Untitled"
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">
            {title || "Untitled"}
          </h1>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 p-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full border-none outline-none resize-none text-gray-700 leading-relaxed"
            placeholder="Start writing your note..."
          />
        ) : (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content ? (
              content.split("\n").map((line, index) => (
                <div key={index} className="mb-2">
                  {line.startsWith("・") ? (
                    <div className="flex items-start">
                      <span className="mr-2 text-gray-400">•</span>
                      <span>{line.substring(1)}</span>
                    </div>
                  ) : (
                    <div>{line}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">
                No content yet. Click edit to start writing.
              </div>
            )}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
