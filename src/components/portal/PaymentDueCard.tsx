import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase as typed } from "@/integrations/supabase/client";
import RazorpayButton from "@/components/portal/RazorpayButton";

const supabase: any = typed;

/** Shows payments the admin (or the Week-3 automation) has requested, with the Razorpay button, on the profile page. */
const PaymentDueCard = ({ kind }: { kind: "intern" | "employee" }) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("payments").select("id,title,amount,status").eq("user_id", user.id).in("status", ["requested", "rejected"]).order("created_at", { ascending: false })
      .then(({ data }: any) => setRows(data || []));
  }, [user]);
  if (!rows.length) return null;
  return (
    <Card className="border-orange-400">
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Wallet className="w-4 h-4 text-orange-500" /> Payment due</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        {rows.map((r) => <p key={r.id}><b>{r.title}</b>: ₹{r.amount}</p>)}
        <RazorpayButton />
        <p className="text-xs text-muted-foreground">After paying, open the Payments page and enter your transaction number so we can verify it.</p>
        <Button asChild size="sm" variant="outline"><Link to={`/${kind}/payments`}>Open payments page</Link></Button>
      </CardContent>
    </Card>
  );
};
export default PaymentDueCard;
