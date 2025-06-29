'use client';

import useSWR from 'swr';

type Memo = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MemoList() {
  const { data, error, isLoading } = useSWR<Memo[]>('/api/memos', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load memos</div>;

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map(memo => (
          <div key={memo.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{memo.title}</h2>
            <p>{memo.content}</p>
          </div>
        ))
      ) : (
        <div>No memos found. Create your first memo!</div>
      )}
    </div>
  );
}
