// components/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get current session
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch profile from your users table
        const { data, error } = await supabase
          .from("users")
          .select("name, is_admin")
          .eq("id", user.id) // assumes your table 'users' has same id as auth
          .single();

        if (!error && data) {
          setUser((prev) => ({ ...prev, name: data.name }));
          setIsAdmin(data.is_admin);
        }
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-red-600">
        Netflex
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        {isAdmin && (
          <Link href="/dashboard" className="hover:underline">
            Admin
          </Link>
        )}

        {user && (
          <span className="text-sm text-gray-300">
            Hi, {user.name || user.email}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
