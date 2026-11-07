export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1 className="break-words text-xl sm:text-2xl font-bold text-kv-text">Match Detail Page ({(await params).id})</h1>
    </div>
  );
}
