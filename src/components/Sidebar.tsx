"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { useState, useEffect, useRef } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SidebarProps {
  selectedMemoId: number | null;
  onMemoSelect: (memo: Memo) => void;
  onNewNote: () => void;
}

export default function Sidebar({
  selectedMemoId,
  onMemoSelect,
  onNewNote,
}: SidebarProps) {
  const { data: session } = useSession();
  const {
    data: memos,
    error,
    isLoading,
    mutate,
  } = useSWR<Memo[]>("/api/memos", fetcher);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // クリックアウト機能
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".memo-menu-container")) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  if (isLoading) return <div className="w-64 bg-gray-50 p-4">Loading...</div>;
  if (error)
    return <div className="w-64 bg-gray-50 p-4">Failed to load memos</div>;

  const handleEdit = (memo: Memo) => {
    onMemoSelect(memo);
    setOpenMenuId(null);
  };

  const handleDelete = async (memoId: number) => {
    // 確認ダイアログ
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`/api/memos/${memoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // メモ一覧を再取得
        mutate();
        setOpenMenuId(null);
      } else {
        console.error("Failed to delete memo");
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  const toggleMenu = (memoId: number) => {
    setOpenMenuId(openMenuId === memoId ? null : memoId);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* ユーザー情報 */}
      <div className="p-4 border-b border-gray-200">
        {session ? (
          <>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {session.user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Sign in with Google
          </button>
        )}
      </div>

      {/* メモ一覧 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Notes</h2>
          <div className="space-y-1">
            {memos && memos.length > 0 ? (
              memos.map((memo) => (
                <div
                  key={memo.id}
                  className="relative group memo-menu-container"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onMemoSelect(memo)}
                      className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedMemoId === memo.id
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="truncate">{memo.title || "Untitled"}</div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(memo.id);
                      }}
                      className="p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* ドロップダウンメニュー */}
                  {openMenuId === memo.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(memo);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(memo.id);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 px-3 py-2">
                No notes yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Note ボタン */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onNewNote}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + New note
        </button>
      </div>
    </div>
  );
}
