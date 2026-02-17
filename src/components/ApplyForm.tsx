import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ApplyForm() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload resume (PDF only)");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload to Storage
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2️⃣ Insert into Database
      const { error: insertError } = await supabase
        .from("job_applications")
        .insert([
          {
            name: formName,
            email: formEmail,
            resume_url: fileName
          }
        ]);

      if (insertError) throw insertError;

      alert("Application submitted successfully!");

      // Reset form
      setFormName("");
      setFormEmail("");
      setFile(null);

    } catch (error: any) {
      console.error(error.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="email"
        placeholder="Your Email"
        value={formEmail}
        onChange={(e) => setFormEmail(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
        className="border p-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "Submitting..." : "Apply Now"}
      </button>
    </form>
  );
}
