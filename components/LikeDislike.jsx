import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function LikeDislike({ movieId }) {
  const [counts, setCounts] = useState({ like: 0, dislike: 0 });
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    fetchReactions();
  }, []);

  async function fetchReactions() {
    const { data, error } = await supabase
      .from("reactions")
      .select("id, type, user_id")
      .eq("movie_id", movieId);

    if (error) {
      console.error("Error fetching reactions:", error.message);
      return;
    }

    const like = data.filter((r) => r.type === "like").length;
    const dislike = data.filter((r) => r.type === "dislike").length;
    setCounts({ like, dislike });

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const existing = data.find((r) => r.user_id === userId);
    setUserType(existing?.type || null);
  }

  async function handle(type) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return alert("Log in to react.");

    const userId = userData.user.id;
    const { data: existing } = await supabase
      .from("reactions")
      .select("*")
      .eq("movie_id", movieId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.type === type) {
      // remove reaction
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else if (existing) {
      // update reaction
      await supabase.from("reactions").update({ type }).eq("id", existing.id);
    } else {
      // insert reaction
      await supabase
        .from("reactions")
        .insert([{ movie_id: movieId, user_id: userId, type }]);
    }

    fetchReactions();
  }

  return (
    <div className="flex items-center gap-6 my-4">
      {/* Like Button */}
      <button
        onClick={() => handle("like")}
        className={`flex items-center gap-2 transition ${
          userType === "like"
            ? "text-blue-500"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <ThumbsUp
          size={26}
          className={userType === "like" ? "fill-blue-500" : ""}
        />
        <span>{counts.like}</span>
      </button>

      {/* Dislike Button */}
      <button
        onClick={() => handle("dislike")}
        className={`flex items-center gap-2 transition ${
          userType === "dislike"
            ? "text-blue-500"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <ThumbsDown
          size={26}
          className={userType === "dislike" ? "fill-blue-500" : ""}
        />
        <span>{counts.dislike}</span>
      </button>
    </div>
  );
}
