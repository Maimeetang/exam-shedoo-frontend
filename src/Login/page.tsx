"use client";

import { useQuery } from "@tanstack/react-query";

export default function Login() {
  // Fetch EntraID URL from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ["entraUrl"],
    queryFn: async () => {
      const res = await fetch("/api/auth/entraidurl");
      if (!res.ok) throw new Error("Failed to fetch Entra ID URL");
      return res.json() as Promise<{ url: string }>;
    },
  });

  const handleLogin = () => {
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[url(/background/login.png)] bg-cover bg-center">
      <div className="grid grid-cols-2 rounded-xl shadow-lg h-[90vh] w-7xl overflow-hidden">
        <div className="flex flex-col items-center justify-between bg-white">
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="mt-10 text-center">
              <h1 className="mb-2 heading-black">Welcome</h1>
              <p className="paragraph-black">
                sign in or create account to get started
              </p>
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoading || !data?.url}
              className="mt-10 cursor-pointer"
            >
              <img
                className="w-72 opacity-90 hover:opacity-100"
                src="/buttons/cmu-login.png"
                alt="CMU Login"
              />
            </button>
            {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
            {error && (
              <p className="mt-2 text-red-500">Error loading login URL</p>
            )}
          </div>
          <p className="justify-self-end my-10 paragraph-black">
            © 2025 Full Stack Group 10. All Rights Reserved.
          </p>
        </div>

        <div className="flex bg-[url(/background/login2.jpeg)] bg-cover bg-center">
          <div className="mt-5 ml-5">
            <h1 className="mb-2 heading-white font-bold">Schedoo</h1>
            <p className="w-2/3 paragraph-white">
              A scheduling application designed to give you a complete overview
              of your exams and organize your class timetable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

