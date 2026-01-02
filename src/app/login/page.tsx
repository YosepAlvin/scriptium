"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-20 bg-[#FDFCFB]">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-10">
            <h1 className="font-playfair text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-[10px] uppercase tracking-widest p-4 text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-[#666666]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#1A1A1A] font-bold border-b border-[#1A1A1A] pb-0.5">
              Register
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
