"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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
  memos?: Memo[];
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function MemoEditor({
  selectedMemo,
  onSave,
  onCancel,
  memos,
  isEditing: externalIsEditing,
  onEdit,
}: MemoEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [internalIsEditing, setInternalIsEditing] = useState(false);

  // 外部のisEditingを優先、なければ内部状態を使用
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  useEffect(() => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      setContent(selectedMemo.content);
      setInternalIsEditing(false);
    } else {
      setTitle("");
      setContent("");
      setInternalIsEditing(false);
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
        setInternalIsEditing(false);
      } else {
        toast.error("メモの更新に失敗しました");
      }
    } catch (error) {
      toast.error("メモの更新に失敗しました");
    }
  };

  const handleCancel = () => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      setContent(selectedMemo.content);
    }
    setInternalIsEditing(false);
    onCancel();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalIsEditing(true);
    }
  };

  if (!memos || memos.length === 0) {
    return (
      <div className="flex-1 bg-white min-h-0 flex items-start md:items-center md:pt-32 justify-start md:justify-center">
        <div className="text-left md:text-center p-4 w-full md:max-w-md">
          <div className="text-gray-400">
            <svg
              className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              メモを作成してください
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              新しいメモを作成して、アイデアを整理しましょう
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedMemo) {
    return (
      <div className="flex-1 bg-white min-h-0 flex items-start md:items-center md:pt-32 justify-start md:justify-center">
        <div className="text-left md:text-center p-4 w-full md:max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            メモ一覧へようこそ
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            サイドバーからメモを選択するか、新しいメモを作成してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col min-h-0">
      <div className="border-b border-gray-200 p-4 md:p-6">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl md:text-3xl font-bold text-gray-900 w-full border-none outline-none bg-transparent"
            placeholder="メモタイトル"
          />
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title || "Untitled"}
          </h1>
        )}
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full border-none outline-none resize-none text-gray-700 leading-relaxed text-sm md:text-base"
            placeholder="ここにメモを入力してください"
          />
        ) : (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
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
                まだ内容がありません。編集ボタンをクリックして書き始めてください。
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 md:p-6">
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-2 md:px-4 md:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
            >
              編集
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
