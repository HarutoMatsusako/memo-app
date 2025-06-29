import AuthButton from "@/components/AuthButton";
import MemoList from '@/components/MemoList';

export default function Home() {
  return (
    <main className="p-8">
      <AuthButton />
      <h1 className="text-2xl font-bold mb-4">メモ一覧</h1>
      <MemoList />
    </main>
  );
}
