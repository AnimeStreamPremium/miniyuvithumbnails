import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SECRET_CODE = "Shivam2008";

export default function Admin() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const ensureAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        const msg = (error as any)?.message || "Auth error";
        if (msg.toLowerCase().includes("anonymous sign-ins are disabled")) {
          toast.error("Anonymous sign-in is disabled in Supabase. Enable it or ask me to add email/password login.");
        } else {
          toast.error("Auth error. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin_unlocked");
    if (saved === "true") {
      setUnlocked(true);
      ensureAuth();
    }
  }, []);
  const canonical = useMemo(() => window.location.origin + "/admin", []);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.message("Select images first.");
      return;
    }
    setUploading(true);
    await ensureAuth();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      toast.error("Unable to authenticate.");
      return;
    }
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const path = `${user.id}/${Date.now()}-${i}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('thumbnails').upload(path, file);
      if (uploadError) {
        toast.error(`Upload failed: ${file.name}`);
        continue;
      }
      const { data: pub } = supabase.storage.from('thumbnails').getPublicUrl(path);
      const title = file.name.replace(/\.[^/.]+$/, '');
      const { error: insertError } = await supabase.from('thumbnails').insert({
        user_id: user.id,
        title,
        image_url: pub.publicUrl,
        is_published: true,
      });
      if (insertError) {
        toast.error(`DB save failed: ${file.name}`);
        continue;
      }
      successCount++;
    }
    setUploading(false);
    setFiles(null);
    toast.success(`Uploaded ${successCount}/${files?.length ?? 0} file(s).`);
  };

  const tryUnlock = async () => {
    if (code.trim() === SECRET_CODE) {
      setUnlocked(true);
      localStorage.setItem("admin_unlocked", "true");
      await ensureAuth();
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
            <p className="text-muted-foreground mt-2">Select images and upload to your portfolio.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="fileInput"
                onChange={(e) => setFiles(e.target.files)}
              />
              <label htmlFor="fileInput">
                <Button asChild variant="elevated">
                  <span>Select Images</span>
                </Button>
              </label>
              <Button variant="default" disabled={!files || uploading} onClick={handleUpload}>
                {uploading ? "Uploading..." : `Upload${files ? ` (${files.length})` : ""}`}
              </Button>
              {files && <span className="text-sm text-muted-foreground">{files.length} file(s) selected</span>}
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => { supabase.auth.signOut(); localStorage.removeItem('admin_unlocked'); setUnlocked(false); toast.message('Locked admin'); }}>Lock Admin</Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
