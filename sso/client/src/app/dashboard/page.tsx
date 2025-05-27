"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-4xl w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            {user.photos?.[0]?.value && (
              <img
                src={user.photos[0].value}
                alt={user.displayName}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.displayName}!
              </h1>
              <p className="text-gray-600">{user.emails?.[0]?.value}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Account Status
                </h3>
                <p className="text-blue-700">Active</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Last Login
                </h3>
                <p className="text-green-700">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
