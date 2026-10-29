import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface T { id: string; name: string; role: string | null; company: string | null; content: string; rating: number | null }

/** Shows only genuine testimonials that the admin has entered. Nothing is shown when there are none. */
const Testimonials = () => {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    supabase.from("testimonials").select("id,name,role,company,content,rating").eq("is_active", true).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => setItems((data as T[]) || []));
  }, []);
  if (items.length === 0) return null;
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4 font-display">What people say about working with us</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((t) => (
            <figure key={t.id} className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 -left-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center"><Quote className="w-5 h-5 text-primary-foreground" /></div>
              {!!t.rating && <div className="flex gap-1 mb-4 mt-2">{Array.from({ length: Math.min(5, t.rating) }).map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}</div>}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">"{t.content}"</blockquote>
              <figcaption className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center"><span className="text-primary font-bold text-lg">{t.name.charAt(0)}</span></div>
                <div><div className="font-semibold text-foreground">{t.name}</div><div className="text-sm text-muted-foreground">{[t.role, t.company].filter(Boolean).join(", ")}</div></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
