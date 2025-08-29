import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { requireUser } from "../utils/requireUser";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    videoUrl: "",
    thumbnailUrl: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    requireUser(router);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let videoUrl = formData.videoUrl;
      let thumbnailUrl = formData.thumbnailUrl;

      // Upload video if file chosen
      if (videoFile) {
        const { data, error } = await supabase.storage
          .from("movies")
          .upload(`videos/${Date.now()}_${videoFile.name}`, videoFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) throw error;
        videoUrl = supabase.storage.from("movies").getPublicUrl(data.path)
          .data.publicUrl;
      }

      // Upload thumbnail if file chosen
      if (thumbnailFile) {
        const { data, error } = await supabase.storage
          .from("movies")
          .upload(
            `thumbnails/${Date.now()}_${thumbnailFile.name}`,
            thumbnailFile,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (error) throw error;
        thumbnailUrl = supabase.storage.from("movies").getPublicUrl(data.path)
          .data.publicUrl;
      }

      // Save metadata to DB
      const { error: insertError } = await supabase.from("movies").insert([
        {
          title: formData.title,
          description: formData.description,
          genre: formData.genre,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Movie uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        genre: "",
        videoUrl: "",
        thumbnailUrl: "",
      });
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload movie.");
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-[#1f1f1f] rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Upload a New Movie</h1>

        {message && <p className="mb-4 text-green-400">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#333] focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#333] focus:outline-none"
          />
          <input
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#333] focus:outline-none"
          />

          {/* Thumbnail options */}
          <div>
            <p className="mb-1 font-semibold">Thumbnail</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              className="w-full p-2 rounded bg-[#333] mb-2"
            />
            <input
              name="thumbnailUrl"
              placeholder="Or paste thumbnail URL"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#333]"
            />
          </div>

          {/* Video options */}
          <div>
            <p className="mb-1 font-semibold">Video</p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full p-2 rounded bg-[#333] mb-2"
            />
            <input
              name="videoUrl"
              placeholder="Or paste video URL"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#333]"
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold w-full"
          >
            Upload Movie
          </button>
        </form>
      </div>
    </div>
  );
}
