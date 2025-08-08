import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

export default function Privacy() {
  const canonical = useMemo(() => window.location.origin + "/privacy", []);
  return (
    <main>
      <Helmet>
        <title>Privacy Policy | Shivam Thumbnail</title>
        <meta name="description" content="Privacy policy for Shivam's thumbnail design portfolio website." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <article className="prose prose-invert max-w-none mt-6">
          <p>We collect only the information required to deliver your thumbnails and communicate with you.</p>
          <ul>
            <li>No sale of personal data.</li>
            <li>Data retained only as long as necessary for service delivery.</li>
            <li>Contact us to request data removal or export.</li>
          </ul>
          <p>Contact: <a href="mailto:animestreampremium@gmail.com">animestreampremium@gmail.com</a></p>
        </article>
      </section>
    </main>
  );
}
