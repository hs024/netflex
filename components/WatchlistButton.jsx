import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function WatchlistButton({ movieId }) {
  const [inList, setInList] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkList();
  }, []);

  async function checkList() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data } = await supabase
      .from("watchlist")
      .select("*")
      .eq("movie_id", movieId)
      .eq("user_id", userId)
      .single();

    setInList(!!data);
  }

  async function toggleWatchlist() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return alert("Log in to use watchlist.");

    const userId = userData.user.id;
    if (inList) {
      await supabase
        .from("watchlist")
        .delete()
        .eq("movie_id", movieId)
        .eq("user_id", userId);
      setInList(false);
    } else {
      await supabase
        .from("watchlist")
        .insert([{ movie_id: movieId, user_id: userId }]);
      setInList(true);
    }
  }

  return (
    <button onClick={toggleWatchlist} className="px-4 py-2 bg-red-600 rounded">
      {inList ? "Remove from My List" : "Add to My List"}
    </button>
  );
}
