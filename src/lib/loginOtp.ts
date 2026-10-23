import { supabase } from "@/integrations/supabase/client";

type Result = { ok: true } | { ok: false; message: string };

const friendly = (message: string, status?: number): string => {
  const m = message.toLowerCase();
  if (status === 429 || m.includes("rate limit") || m.includes("security purposes") || m.includes("too many"))
    return "Too many codes requested. Please wait a minute and try again.";
  if (m.includes("invalid login credentials")) return "Invalid email or password. Please try again.";
  return message;
};

/**
 * Step 1 of a two-step login: check the password, then email a 6-digit code.
 * The password session is closed straight away - the user only gets in after entering the code.
 */
export async function requestLoginCode(email: string, password: string): Promise<Result> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: friendly(error.message, error.status) };
  await supabase.auth.signOut({ scope: "local" });
  return sendLoginCode(email);
}

export async function sendLoginCode(email: string): Promise<Result> {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  if (error) return { ok: false, message: friendly(error.message, error.status) };
  return { ok: true };
}

/** Step 2: the code from the email. On success the user is signed in. */
export async function verifyLoginCode(email: string, code: string) {
  const first = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (!first.error && first.data.user) return first;
  // Some projects issue the code as a magic-link token: try that type before giving up.
  const second = await supabase.auth.verifyOtp({ email, token: code, type: "magiclink" });
  return !second.error && second.data.user ? second : first;
}
