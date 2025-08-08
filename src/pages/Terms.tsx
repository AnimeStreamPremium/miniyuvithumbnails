import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

export default function Terms() {
  const canonical = useMemo(() => window.location.origin + "/terms", []);
  return (
    <main>
      <Helmet>
        <title>Terms & Services | Shivam Thumbnail</title>
        <meta name="description" content="Terms and services for Shivam's thumbnail design portfolio." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Terms & Services</h1>
        <article className="prose prose-invert max-w-none mt-6">
          <p>By ordering a thumbnail, you agree to the following terms:</p>
          <ul>
            <li>Non-exclusive license for use on your channels and social posts.</li>
            <li>No resale or redistribution without written permission.</li>
            <li>Revisions policy and delivery timelines agreed before start.</li>
          </ul>
          <p>Questions? Email <a href="mailto:animestreampremium@gmail.com">animestreampremium@gmail.com</a>.</p>
        </article>
      </section>
    </main>
  );
}
