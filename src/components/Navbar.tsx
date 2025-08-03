'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { routing } from '@/i18n/routing';

export default function Navbar() {
	const t = useTranslations('Navbar');
	const pathname = usePathname();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const currentLocale = pathname.split('/')[1] || routing.defaultLocale;

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocale = e.target.value;
		const segments = pathname.split('/');
		segments[1] = newLocale;
		const newPath = segments.join('/');

		startTransition(() => {
			router.push(newPath);
		});
	};

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
		<header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 z-50 fixed top-0 left-0 right-0">
			<Link href={`/${currentLocale}`}>
				<Image src="/next.svg" alt="Logo" width={100} height={24} className="dark:invert" />
			</Link>

			<nav className="hidden sm:flex gap-6 text-sm font-medium items-center">
				<Link href={`/${currentLocale}`} className="hover:underline underline-offset-4">
					{t('home')}
				</Link>
				<Link href={`/${currentLocale}/login`} className="hover:underline underline-offset-4">
					{t('login')}
				</Link>
				<select
					value={currentLocale}
					onChange={handleLanguageChange}
					className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-transparent focus:outline-none"
				>
					{routing.locales.map((locale) => (
						<option key={locale} value={locale}>
							{locale.toUpperCase()}
						</option>
					))}
				</select>
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
					<Link href={`/${currentLocale}`} onClick={() => setIsOpen(false)}>
						{t('home')}
					</Link>
					<Link href={`/${currentLocale}/login`} onClick={() => setIsOpen(false)}>
						{t('login')}
					</Link>
					<select
						value={currentLocale}
						onChange={handleLanguageChange}
						className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-transparent"
					>
						{routing.locales.map((locale) => (
							<option key={locale} value={locale}>
								{locale.toUpperCase()}
							</option>
						))}
					</select>
				</div>
			)}
		</header>
	);
}
