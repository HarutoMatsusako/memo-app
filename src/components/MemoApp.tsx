"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import MemoEditor from "./MemoEditor";
import NewMemoForm from "./NewMemoForm";
import AuthButton from "./AuthButton"; 

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function MemoApp() {
  const { data: session, status } = useSession();
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Memo App</h1>
          <p className="text-gray-600 mb-4">Please sign in to continue</p>
          <AuthButton />  {/* ← Sign in ボタンを表示 */}
        </div>
      </div>
    );
  }

  const handleMemoSelect = (memo: Memo) => {
    setSelectedMemo(memo);
    setIsCreatingNew(false);
  };

  const handleNewNote = () => {
    setSelectedMemo(null);
    setIsCreatingNew(true);
  };

  const handleSaveMemo = (updatedMemo: Memo) => {
    setSelectedMemo(updatedMemo);
    setIsCreatingNew(false);
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        selectedMemoId={selectedMemo?.id || null}
        onMemoSelect={handleMemoSelect}
        onNewNote={handleNewNote}
      />
      {isCreatingNew ? (
        <NewMemoForm onSave={handleSaveMemo} onCancel={handleCancel} />
      ) : (
        <MemoEditor
          selectedMemo={selectedMemo}
          onSave={handleSaveMemo}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
