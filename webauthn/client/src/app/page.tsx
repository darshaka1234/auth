"use client";

import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <div className="border-b-2 border-gray-200">
            <nav className="-mb-px flex space-x-12">
              <button
                onClick={() => setActiveTab("register")}
                className={`${
                  activeTab === "register"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors duration-200`}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab("login")}
                className={`${
                  activeTab === "login"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors duration-200`}
              >
                Login
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "register" ? <RegisterForm /> : <LoginForm />}
      </div>
    </main>
  );
}
