import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner.webp";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const canonical = useMemo(() => window.location.origin + "/", []);
  const [thumbnails, setThumbnails] = useState<Array<{ id: string; title: string | null; image_url: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("thumbnails")
        .select("id,title,image_url")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (!error && data) setThumbnails(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main>
      <Helmet>
        <title>Shivam | Thumbnail Maker Portfolio</title>
        <meta name="description" content="Professional YouTube thumbnail designer for gaming and tutorials. Clean black/white/gray visuals with fast delivery." />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Shivam | YouTube Thumbnail Designer" />
        <meta property="og:description" content="High-impact gaming and tutorial thumbnails. See work, pricing and contact." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Shivam",
          jobTitle: "YouTube Thumbnail Designer",
          url: canonical,
          sameAs: []
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Thumbnails that grab attention and get clicks
            </h1>
            <p className="mt-4 text-muted-foreground">
              I design high-contrast thumbnails for gaming, tutorials and more — crafted for clarity, emotion and CTR.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#work">
                <Button variant="hero" size="xl">See My Work</Button>
              </a>
              <a href="#pricing">
                <Button variant="outline" size="xl">View Pricing</Button>
              </a>
            </div>
          </div>
          <div className="relative">
            <img src={heroImage} alt="Grayscale hero showing thumbnail design motifs" className="w-full rounded-lg border shadow-md" />
          </div>
        </div>
      </section>

      {/* Work/Gallery */}
      <section id="work" className="border-t">
        <div className="container mx-auto py-14">
          <h2 className="text-2xl font-semibold">Selected Work</h2>
          <p className="text-muted-foreground mt-2">Gaming and tutorial styles in a clean grayscale aesthetic.</p>
          {loading ? (
            <p className="text-muted-foreground">Loading your latest thumbnails…</p>
          ) : thumbnails.length === 0 ? (
            <p className="text-muted-foreground">No thumbnails yet. Upload from the Admin panel.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thumbnails.map((t) => (
                <img
                  key={t.id}
                  src={t.image_url}
                  loading="lazy"
                  alt={`${t.title ?? 'Thumbnail'} by Shivam - YouTube thumbnail designer`}
                  className="w-full rounded-lg border shadow-sm"
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t">
        <div className="container mx-auto py-14">
          <h2 className="text-2xl font-semibold">Pricing</h2>
          <p className="text-muted-foreground mt-2">Simple plans based on your needs.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Single</h3>
              <p className="text-3xl font-bold mt-2">₹100</p>
              <ul className="mt-4 text-sm text-muted-foreground list-disc list-inside">
                <li>1 custom thumbnail</li>
                <li>Delivery in 24-48 hours</li>
                <li>Minor revisions</li>
              </ul>
              <div className="mt-6">
                <Button className="w-full" variant="elevated">Get Started</Button>
              </div>
            </article>
            <article className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Starter</h3>
              <p className="text-3xl font-bold mt-2">₹250</p>
              <ul className="mt-4 text-sm text-muted-foreground list-disc list-inside">
                <li>3 thumbnails</li>
                <li>Priority turn-around</li>
                <li>Revisions included</li>
              </ul>
              <div className="mt-6">
                <Button className="w-full" variant="default">Choose Plan</Button>
              </div>
            </article>
            <article className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="text-3xl font-bold mt-2">₹400</p>
              <ul className="mt-4 text-sm text-muted-foreground list-disc list-inside">
                <li>5 thumbnails</li>
                <li>Fastest delivery</li>
                <li>Multiple concepts</li>
              </ul>
              <div className="mt-6">
                <Button className="w-full" variant="secondary">Go Pro</Button>
              </div>
            </article>
          </div>
          <div className="mt-10 text-center">
            <Link to="/admin">
              <Button variant="outline">Admin: Upload New Work</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
