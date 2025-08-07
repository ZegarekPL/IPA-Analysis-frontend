import { Badge } from '@/components/ui/badge';
import React from 'react';
import Link from 'next/link';

export default async function ReleaseBadge() {
	const res = await fetch('https://api.github.com/repos/ZegarekPL/IPA-Analysis-frontend/releases/latest', {
		cache: 'force-cache',
	});
	const data = await res.json();

	return (
		<Link href={`https://github.com/ZegarekPL/IPA-Analysis-frontend/releases/tag/${data.tag_name}`} target="_blank">
			<Badge className="underline bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
				Just released {data.tag_name}
			</Badge>
		</Link>
	);
}
