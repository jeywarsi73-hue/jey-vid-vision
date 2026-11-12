// Supabase Edge Function: verify-admin-pin
// Serves secure server-side PIN verification for JEY VID VISION Owner Login

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pin, user_id } = await req.json();

    if (!pin || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: pin, user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the admin profile
    const { data: profile, error } = await supabase
      .from("admin_profiles")
      .select("pin_hash, role")
      .eq("user_id", user_id)
      .single();

    if (error || !profile) {
      return new Response(
        JSON.stringify({ error: "Admin profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hash the incoming PIN using SHA-256
    const msgUint8 = new TextEncoder().encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const pinHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (!profile.pin_hash) {
      // If PIN not yet configured, automatically initialize it
      await supabase
        .from("admin_profiles")
        .update({ pin_hash: pinHash })
        .eq("user_id", user_id);

      return new Response(
        JSON.stringify({ success: true, message: "PIN initialized and verified successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isValid = profile.pin_hash === pinHash;

    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: "Incorrect security PIN" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "PIN verified" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
