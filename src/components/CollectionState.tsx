export default function CollectionState({ loading, error, empty }: { loading: boolean; error: string; empty: string }) {
  if (loading) return <p className="mu" role="status">Loading content…</p>;
  if (error) return <p className="err" role="alert">{error}</p>;
  return <p className="mu">{empty}</p>;
}
