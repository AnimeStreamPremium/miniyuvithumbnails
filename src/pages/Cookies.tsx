import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

export default function Cookies() {
  const canonical = useMemo(() => window.location.origin + "/cookies", []);
  return (
    <main>
      <Helmet>
        <title>Cookies Policy | Shivam Thumbnail</title>
        <meta name="description" content="Cookies policy for Shivam's thumbnail design site." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Cookies Policy</h1>
        <article className="prose prose-invert max-w-none mt-6">
          <p>This site uses minimal cookies necessary for functionality. We do not use tracking or advertising cookies.</p>
          <ul>
            <li>Essential cookies for theme and session preferences.</li>
            <li>You can clear cookies in your browser settings at any time.</li>
          </ul>
          <p>Questions? Email <a href="mailto:animestreampremium@gmail.com">animestreampremium@gmail.com</a>.</p>
        </article>
      </section>
    </main>
  );
}
