"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add login logic here
        console.log("Logging in:", { email, password });
    };

    return (
        <main className="flex flex-1 flex-col items-center justify-center text-center sm:px-12 py-20 gap-6 bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 p-6 sm:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Don’t have an account?{" "}
                        <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                            Sign up
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" />
                            Remember me
                        </label>
                        <Link href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </main>
    );
}
