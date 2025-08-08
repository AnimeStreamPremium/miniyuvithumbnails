import { PropsWithChildren } from "react";

export default function Footer({}: PropsWithChildren) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto py-8 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <p className="font-semibold">Shivam — Thumbnail Designer</p>
          <p className="text-sm text-muted-foreground mt-1">
            Contact: <a className="underline hover:no-underline" href="mailto:animestreampremium@gmail.com">animestreampremium@gmail.com</a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">© {year} All rights reserved.</p>
        </div>
        <nav className="justify-self-start md:justify-self-end">
          <ul className="flex flex-wrap gap-4 text-sm">
            <li><a className="hover:underline" href="/terms">Terms & Services</a></li>
            <li><a className="hover:underline" href="/privacy">Privacy Policy</a></li>
            <li><a className="hover:underline" href="/cookies">Cookies</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
