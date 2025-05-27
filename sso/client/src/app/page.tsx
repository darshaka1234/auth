"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          SSO Authentication Demo
        </h1>

        {user ? (
          <div className="text-center">
            <div className="mb-4">
              {user.photos?.[0]?.value && (
                <img
                  src={user.photos[0].value}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
              )}
              <h2 className="text-2xl font-semibold">{user.displayName}</h2>
              <p className="text-gray-600">{user.emails?.[0]?.value}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Please log in to continue</p>
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login with Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
