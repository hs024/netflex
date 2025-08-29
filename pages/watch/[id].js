import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import LikeDislike from "@/components/LikeDislike";
import WatchlistButton from "@/components/WatchlistButton";

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (id) {
      fetchMovie();
      fetchComments();
    }
  }, [id]);

  const fetchMovie = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();
    if (error) console.error(error.message);
    else setMovie(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("comment, created_at")
      .eq("movie_id", id)
      .order("created_at", { ascending: false });

    setComments(data || []);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return alert("Please login to comment.");

    const { error } = await supabase.from("comments").insert([
      {
        movie_id: id,
        user_id: user.id,
        comment,
      },
    ]);

    if (!error) {
      setComment("");
      fetchComments();
    }
  };

  // Helper: detect and render video sources
  const renderVideo = (url) => {
    // YouTube (regular + shorts)
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    const ytShortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);

    if (ytMatch || ytShortsMatch) {
      const videoId = ytMatch ? ytMatch[1] : ytShortsMatch[1];
      const isVertical = !!ytShortsMatch;
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className={`mx-auto mb-6 rounded-lg shadow-lg ${
            isVertical ? "w-[360px] h-[640px]" : "w-full max-w-5xl h-[480px]"
          }`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Facebook (regular + reels)
    const fbMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/);
    const isFbReel = url.includes("/reel/");
    if (fbMatch || isFbReel) {
      return (
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            url
          )}&show_text=false`}
          className={`mx-auto mb-6 rounded-lg shadow-lg ${
            isFbReel ? "w-[360px] h-[640px]" : "w-full max-w-5xl h-[480px]"
          }`}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      );
    }

    // Instagram reels
    if (url.includes("instagram.com/reel/")) {
      return (
        <iframe
          src={`https://www.instagram.com/reel/${url.split("/reel/")[1]}embed`}
          className="w-[360px] h-[640px] mx-auto mb-6 rounded-lg shadow-lg"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // TikTok
    if (url.includes("tiktok.com/")) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/${url.split("/video/")[1]}`}
          className="w-[360px] h-[640px] mx-auto mb-6 rounded-lg shadow-lg"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Default: local video
    return (
      <video
        src={url}
        controls
        className="w-full max-w-5xl h-[480px] object-cover rounded-lg shadow-lg mx-auto mb-6"
      />
    );
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        {movie ? (
          <div className="space-y-8">
            {/* Video Player */}
            {renderVideo(movie.video_url)}

            {/* Title + description like Netflix */}
            <div className="text-left space-y-3">
              <h1 className="text-5xl font-extrabold tracking-wide uppercase">
                {movie.title}
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <LikeDislike movieId={id} />
              <WatchlistButton movieId={id} />
            </div>

            {/* Comments */}
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow space-y-6">
              <form onSubmit={handleComment} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Leave a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-grow p-3 rounded bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="submit"
                  className="bg-red-600 px-5 py-2 rounded font-semibold hover:bg-red-700 transition"
                >
                  Post
                </button>
              </form>

              <div>
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <ul className="space-y-3">
                  {comments.map((c, i) => (
                    <li
                      key={i}
                      className="bg-[#2a2a2a] p-4 rounded-lg shadow-sm"
                    >
                      <p>{c.comment}</p>
                      <small className="text-gray-500 text-xs">
                        {new Date(c.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading movie...</p>
        )}
      </div>
    </div>
  );
}
