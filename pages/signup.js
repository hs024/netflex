// pages/signup.js
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, name } = formData;

    // Step 1: Create Supabase user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // Step 2: Save additional user info (name) in your users table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        email,
        name,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    alert("Sign up successful! Please check your email to verify.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f1f1f] p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Your name"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-[#333] text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-[#333] text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-[#333] text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-semibold"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
