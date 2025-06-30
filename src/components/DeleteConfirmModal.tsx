"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "削除の確認",
  message = "本当に削除しますか？",
}: DeleteConfirmModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // スクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
        {/* ヘッダー - モバイル: パディング調整 */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ - モバイル: パディング調整 */}
        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            {message}
          </p>

          {/* ボタン - モバイル: ボタンサイズ調整 */}
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-3 py-2 md:px-4 md:py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
