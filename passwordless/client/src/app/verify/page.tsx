"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuth } from "@/utils/auth";

export default function Verify() {
  const [message, setMessage] = useState("Verifying...");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Invalid verification link");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok) {
          setAuth(data.token, data.user);
          router.push("/dashboard");
        } else {
          setMessage("Invalid or expired link");
          setIsLoading(false);
        }
      } catch {
        setMessage("Error verifying link");
        setIsLoading(false);
      }
    };
    verifyToken();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Verifying</h1>
        <p
          className={`text-center text-sm ${
            message.includes("Error") || message.includes("Invalid")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
        {!isLoading && message.includes("Invalid") && (
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Back to Login
          </button>
        )}
      </div>
    </main>
  );
}
