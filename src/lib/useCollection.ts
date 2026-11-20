"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** Loads a JSON Server collection with loading + error state. */
export function useCollection<T>(name: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError("");
    try { setData(await api.list<T>(name)); }
    catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  }, [name]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void reload(); }, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);
  return { data, setData, loading, error, reload };
}
