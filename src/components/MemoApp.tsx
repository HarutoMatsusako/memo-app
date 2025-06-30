"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Sidebar from "./Sidebar";
import MemoEditor from "./MemoEditor";
import NewMemoForm from "./NewMemoForm";
import AuthButton from "./AuthButton";
import ToasterProvider from "./ToasterProvider";

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    let errorData = {};
    try {
      const responseText = await response.text();
      errorData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      errorData = { message: "Failed to parse error response" };
    }
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${JSON.stringify(
        errorData
      )}`
    );
  }

  const data = await response.json();
  return data;
};

export default function MemoApp() {
  const { data: session, status } = useSession();
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: memos, mutate } = useSWR<Memo[]>("/api/memos", fetcher);

  useEffect(() => {
    if (memos && memos.length === 0) {
      setSelectedMemo(null);
      setIsEditing(false);
    }
  }, [memos]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-base md:text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            Welcome to Memo App
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Please sign in to continue
          </p>
          <AuthButton />
        </div>
      </div>
    );
  }

  const handleMemoSelect = (memo: Memo) => {
    setSelectedMemo(memo);
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleEditMemo = (memo: Memo) => {
    setSelectedMemo(memo);
    setIsCreatingNew(false);
    setIsEditing(true);
  };

  const handleNewNote = () => {
    setSelectedMemo(null);
    setIsCreatingNew(true);
    setIsEditing(false);
  };

  const handleSaveMemo = (updatedMemo: Memo) => {
    setSelectedMemo(updatedMemo);
    setIsCreatingNew(false);
    setIsEditing(false);
    mutate();
  };

  const handleNewMemoSave = (newMemo: Memo) => {
    setSelectedMemo(newMemo);
    setIsCreatingNew(false);
    setIsEditing(false);
    mutate();
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-white">
        <div className="w-full md:w-64 md:flex-shrink-0">
          <Sidebar
            selectedMemoId={selectedMemo?.id || null}
            onMemoSelect={handleMemoSelect}
            onEditMemo={handleEditMemo}
            onNewNote={handleNewNote}
            mutate={mutate}
            memos={memos}
          />
        </div>
        <div className="flex-1 w-full">
          {isCreatingNew ? (
            <NewMemoForm onSave={handleNewMemoSave} onCancel={handleCancel} />
          ) : (
            <MemoEditor
              selectedMemo={selectedMemo}
              onSave={handleSaveMemo}
              onCancel={handleCancel}
              memos={memos}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
      <ToasterProvider />
    </>
  );
}
