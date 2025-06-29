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
  console.log("SWR fetcher - Fetching:", url);

  // セッション情報を取得
  const sessionResponse = await fetch("/api/auth/session");
  const session = await sessionResponse.json();
  console.log("SWR fetcher - Session:", session);

  const response = await fetch(url, {
    credentials: "include", // セッションクッキーを含める
  });
  console.log("SWR fetcher - Response status:", response.status);
  console.log(
    "SWR fetcher - Response headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    let errorData = {};
    try {
      const responseText = await response.text();
      console.log("SWR fetcher - Response text:", responseText);
      errorData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error(
        "SWR fetcher - Failed to parse error response:",
        parseError
      );
      errorData = { message: "Failed to parse error response" };
    }
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${JSON.stringify(
        errorData
      )}`
    );
  }

  const data = await response.json();
  console.log("SWR fetcher - Data:", data);
  return data;
};

export default function MemoApp() {
  const { data: session, status } = useSession();
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // セッション情報のデバッグ
  useEffect(() => {
    console.log("MemoApp - Session status:", status);
    console.log("MemoApp - Session data:", session);
  }, [session, status]);

  // SWRでメモ一覧を取得（mutate関数を利用するため）
  const { data: memos, mutate } = useSWR<Memo[]>("/api/memos", fetcher);

  // メモが0件になった場合、selectedMemoをリセット
  useEffect(() => {
    if (memos && memos.length === 0) {
      setSelectedMemo(null);
      setIsEditing(false);
    }
  }, [memos]);

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
    // メモ一覧を更新
    mutate();
  };

  const handleNewMemoSave = (newMemo: Memo) => {
    setSelectedMemo(newMemo);
    setIsCreatingNew(false);
    setIsEditing(false);
    // メモ一覧を更新
    mutate();
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <Sidebar
          selectedMemoId={selectedMemo?.id || null}
          onMemoSelect={handleMemoSelect}
          onEditMemo={handleEditMemo}
          onNewNote={handleNewNote}
          mutate={mutate}
          memos={memos}
        />
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
      <ToasterProvider />
    </>
  );
}
