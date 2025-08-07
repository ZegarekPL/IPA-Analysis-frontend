import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CirclePlay } from 'lucide-react';
import React from 'react';
import ReleaseBadge from '@/app/[locale]/ReleaseBadge';

const HeroPage = () => {
	const t = useTranslations('HomePage');
	return (
		<div className="w-full flex items-center justify-center px-6">
			<div className="text-center max-w-2xl">
				<ReleaseBadge />
				<h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl md:leading-[1.2] font-bold">{t('title')}</h1>
				<p className="mt-6 text-[17px] md:text-lg">{t('title_desc')}</p>
				<div className="mt-12 flex items-center justify-center gap-4">
					<Button size="lg" className="rounded-full text-base" asChild>
						<Link href="/login">
							{t('left_button')}
							<ArrowUpRight className="!h-5 !w-5" />
						</Link>
					</Button>
					<Button variant="outline" size="lg" className="rounded-full text-base shadow-none" asChild>
						<Link href="#">
							<CirclePlay className="!h-5 !w-5" />
							{t('right_button')}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HeroPage;
