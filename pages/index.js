// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    fetchMovies();
    fetchWatchlist();

    // Hide splash after 2.5s
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMovies(data);
  };

  const fetchWatchlist = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("watchlist")
      .select("movie_id")
      .eq("user_id", user.id);

    if (!error && data) setWatchlistIds(data.map((item) => item.movie_id));
  };

  const moviesByGenre = movies.reduce((acc, movie) => {
    if (!acc[movie.genre]) acc[movie.genre] = [];
    acc[movie.genre].push(movie);
    return acc;
  }, {});

  return (
    <div className="bg-[#141414] min-h-screen text-white relative overflow-hidden">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 3, filter: "brightness(2)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <img
              src="/banner/c2.jpg"
              alt="splash"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* Main Banner */}
      <div className="w-full overflow-hidden">
        <div className="flex">
          {["banner/b1.jpeg", "banner/c2.jpg", "banner/b3.jpeg"].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`banner-${i}`}
              className="w-full"
              style={{ height: "310px", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <section className="p-6">
        <h1 className="text-3xl font-bold mb-4">Recently Added</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {movies.slice(0, 4).map((movie) => (
            <Link href={`/watch/${movie.id}`} key={movie.id}>
              <div className="relative bg-[#1f1f1f] rounded overflow-hidden shadow hover:scale-105 transition-transform duration-200 cursor-pointer">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2">
                  <h2 className="font-semibold">{movie.title}</h2>
                </div>
                {watchlistIds.includes(movie.id) && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                    My List
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Movies by genre */}
        {Object.keys(moviesByGenre).map((genre) => (
          <div key={genre} className="mb-10">
            <h2 className="text-2xl font-bold mb-3">{genre}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {moviesByGenre[genre].map((movie) => (
                <Link href={`/watch/${movie.id}`} key={movie.id}>
                  <div className="relative bg-[#1f1f1f] rounded overflow-hidden shadow hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <img
                      src={movie.thumbnail_url}
                      alt={movie.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <h2 className="font-semibold">{movie.title}</h2>
                    </div>
                    {watchlistIds.includes(movie.id) && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                        My List
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
