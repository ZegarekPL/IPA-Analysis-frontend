import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ['pl', 'en'],

	// Used when no locale matches
	defaultLocale: 'pl',
});

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
