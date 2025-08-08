import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SECRET_CODE = "Shivam2008";

export default function Admin() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_unlocked");
    if (saved === "true") setUnlocked(true);
  }, []);

  const canonical = useMemo(() => window.location.origin + "/admin", []);

  const tryUnlock = () => {
    if (code.trim() === SECRET_CODE) {
      setUnlocked(true);
      localStorage.setItem("admin_unlocked", "true");
      toast.success("Admin unlocked");
    } else {
      toast.error("Incorrect code");
    }
  };

  return (
    <main className="container mx-auto py-10">
      <Helmet>
        <title>Admin | Upload Thumbnails</title>
        <meta name="description" content="Secure admin area to upload portfolio thumbnails." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      {!unlocked ? (
        <section className="mx-auto max-w-md rounded-lg border p-6">
          <h1 className="text-xl font-semibold">Enter Admin Code</h1>
          <p className="text-muted-foreground mt-2">Access restricted. Please enter the secret passcode.</p>
          <div className="mt-4 flex gap-2">
            <Input
              type="password"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              aria-label="Admin code"
            />
            <Button onClick={tryUnlock}>Unlock</Button>
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <div className="rounded-lg border p-6">
            <h1 className="text-2xl font-semibold">Upload Thumbnails</h1>
            <p className="text-muted-foreground mt-2">
              Supabase integration is required to store and display your uploads. Connect Supabase using the green button in the top-right and I'll set up the tables and storage next.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="fileInput"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  toast.info(`${files.length} file(s) selected. Once Supabase is connected, these will upload here.`);
                }}
              />
              <label htmlFor="fileInput">
                <Button asChild variant="elevated">
                  <span>Select Images</span>
                </Button>
              </label>
              <Button variant="outline" onClick={() => toast.message("After Supabase connection, this will upload to storage and save to DB.")}>Upload</Button>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">How to enable uploads</h2>
            <ol className="mt-3 list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Click the green Supabase button (top-right) and connect your project.</li>
              <li>Reply here and I will create the database tables and storage buckets for thumbnails.</li>
              <li>After that, the upload button will work and your gallery will auto-update.</li>
            </ol>
          </div>
        </section>
      )}
    </main>
  );
}
