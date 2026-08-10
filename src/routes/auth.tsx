import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Donor Login — BloodConnect Maijdee & Noakhali" },
      {
        name: "description",
        content:
          "Donors sign in with their phone number to manage their listing and answer blood contact requests from patients.",
      },
      { property: "og:title", content: "Donor Login — BloodConnect" },
      {
        property: "og:description",
        content: "Sign in with your phone number to answer blood contact requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+")) return `+${digits}`;
  if (digits.startsWith("880")) return `+${digits}`;
  if (digits.startsWith("0")) return `+880${digits.slice(1)}`;
  return `+${digits}`;
}

function AuthPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/donor-dashboard", replace: true });
    });
  }, [navigate]);

  const sendCode = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizePhone(phone) });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStep("code");
    toast.success("Verification code sent to your phone");
  };

  const verify = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: code.trim(),
      type: "sms",
    });
    if (!error) {
      await supabase.rpc("claim_donor_listings");
    }
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/donor-dashboard", replace: true });
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <LogIn className="h-5 w-5" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Donor login</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with the phone number you registered with, so you can accept or decline blood
          requests from patients.
        </p>

        <div className="mt-6 space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="button"
                disabled={loading || phone.replace(/\D/g, "").length < 8}
                onClick={sendCode}
                className="btn btn-primary w-full px-4 py-2.5"
              >
                <Smartphone className="h-4 w-4" />
                {loading ? "Sending…" : "Send verification code"}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="code">6-digit code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <button
                type="button"
                disabled={loading || code.trim().length < 4}
                onClick={verify}
                className="btn btn-primary w-full px-4 py-2.5"
              >
                {loading ? "Verifying…" : "Verify & sign in"}
              </button>
              <button
                type="button"
                className="w-full text-xs text-muted-foreground underline"
                onClick={() => setStep("phone")}
              >
                Use a different number
              </button>
            </>
          )}

          <div className="flex gap-3 rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Only donors need an account. Patients can search and send requests without signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
