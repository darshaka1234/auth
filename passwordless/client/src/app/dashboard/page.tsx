"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, clearAuth, User } from "@/utils/auth";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      router.push("/");
      return;
    }
    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-gray-600">
              You are now logged in as {user.email}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
