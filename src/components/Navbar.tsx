'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import LocaleSelector from '@/components/LocaleSelector';
import { ModeToggle } from '@/components/ModeToggle';

export default function Navbar() {
	const t = useTranslations('Navbar');
	const [isOpen, setIsOpen] = useState(false);

	function toggleMenu() {
		setIsOpen((prev) => {
			const newState = !prev;
			if (newState) {
				document.body.classList.add('overflow-hidden');
			} else {
				document.body.classList.remove('overflow-hidden');
			}
			return newState;
		});
	}

	return (
		<header className="w-full h-16 bg-background px-4 sm:px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 z-50 fixed top-0 left-0 right-0">
			<Link href={`/`}>
				<Image src="/next.svg" alt="Logo" width={100} height={24} className="dark:invert" />
			</Link>

			<nav className="hidden sm:flex gap-6 text-sm font-medium items-center">
				<Link href={`/dashboard`} className="hover:underline underline-offset-4">
					{t('home')}
				</Link>
				<Link href={`/login`} className="hover:underline underline-offset-4">
					{t('login')}
				</Link>
				<LocaleSelector />
				<ModeToggle />
			</nav>

			{/* Mobile toggle */}
			<button
				onClick={toggleMenu}
				className="sm:hidden w-8 h-8 flex items-center justify-center"
				aria-label="Toggle menu"
			>
				<svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{isOpen ? (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					) : (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					)}
				</svg>
			</button>

			{/* Mobile menu */}
			{isOpen && (
				<div className="fixed top-[4rem] left-0 w-full bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 sm:hidden flex flex-col items-center py-4 gap-4 z-40 overflow-auto">
					<Link href={`/dashboard`} onClick={() => setIsOpen(false)}>
						{t('home')}
					</Link>
					<Link href={`/login`} onClick={() => setIsOpen(false)}>
						{t('login')}
					</Link>
					<LocaleSelector></LocaleSelector>
					<ModeToggle />
				</div>
			)}
		</header>
	);
}
