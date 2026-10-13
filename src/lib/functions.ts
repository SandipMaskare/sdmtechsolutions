import { supabase } from "@/integrations/supabase/client";

/** Calls an edge function and returns a readable error message instead of a generic one. */
export async function callFunction<T = any>(name: string, body: unknown): Promise<{ data: T | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke(name, { body: body as any });
  if (error) {
    let msg = error.message;
    try {
      const res = (error as any).context as Response | undefined;
      if (res && typeof res.json === "function") {
        const j = await res.json();
        if (j?.error) msg = j.detail ? `${j.error} (${j.detail})` : j.error;
      }
    } catch { /* keep default message */ }
    return { data: null, error: msg };
  }
  if (data && (data as any).error) return { data: null, error: String((data as any).error) };
  return { data: data as T, error: null };
}
