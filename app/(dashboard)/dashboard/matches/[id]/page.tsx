export default function MatchDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="break-words text-xl sm:text-2xl font-bold text-kv-text">Match Detail Page ({params.id})</h1>
    </div>
  );
}
