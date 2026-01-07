'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
	return (
		<div className="w-full h-full flex items-center justify-center px-6">
			<div className="text-center max-w-2xl">
				<h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl md:leading-[1.2] font-bold text-red-400">404</h1>
				<p className="mt-6 text-[17px] md:text-lg">Strona nie istnieje</p>
				<div className="mt-12 flex items-center justify-center gap-4">
					<Button size="lg" className="rounded-full text-base" asChild>
						<Link href="/">
							Powrót do strony głównej
							<ArrowUpRight className="!h-5 !w-5" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
