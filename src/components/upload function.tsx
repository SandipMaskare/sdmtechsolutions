const { user } = useAuth();
const [uploading, setUploading] = useState(false);

const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
    setUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${user?.id}/avatar.${fileExt}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Save URL in profiles table
    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user?.id);

    alert("Avatar updated!");
  } catch (error: any) {
    alert(error.message);
  } finally {
    setUploading(false);
  }
};
