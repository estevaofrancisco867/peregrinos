import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// E-mails autorizados a assumir o papel de coordenação (admin).
const ALLOWED_ADMIN_EMAILS = ["estevaofrancisco867@gmail.com"];

export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String(context.claims["email"] ?? "").toLowerCase();

    const { data: alreadyAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (alreadyAdmin) return { isAdmin: true };

    if (!ALLOWED_ADMIN_EMAILS.includes(email)) return { isAdmin: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error && !error.message.includes("duplicate")) throw error;

    return { isAdmin: true };
  });
