import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          Shivam Thumbnails
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#work" className="hover:text-foreground/80">Work</a>
          <a href="#pricing" className="hover:text-foreground/80">Pricing</a>
          <Link to="/admin" className="hover:text-foreground/80">Admin</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
