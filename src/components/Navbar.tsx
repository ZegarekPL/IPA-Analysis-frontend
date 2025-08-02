"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full h-[4vh] p-6 sm:p-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Image
                        src="/next.svg"
                        alt="Next.js Logo"
                        width={100}
                        height={24}
                        className="dark:invert"
                    />
                </Link>
            </div>

            <nav className="hidden sm:flex gap-6 text-sm font-medium">
                <Link href="/" className="hover:underline underline-offset-4">
                    Home
                </Link>
                <Link href="/login" className="hover:underline underline-offset-4">
                    Login
                </Link>
            </nav>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6 text-gray-900 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {isOpen ? (
                        // X icon
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        // Hamburger icon
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Menu rozwijane na małych ekranach */}
            {isOpen && (
                <nav className="sm:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-4 z-50">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="hover:underline underline-offset-4"
                    >
                        Home
                    </Link>
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="hover:underline underline-offset-4"
                    >
                        Login
                    </Link>
                </nav>
            )}
        </header>
    );
}
