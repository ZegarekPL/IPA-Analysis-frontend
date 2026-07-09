'use client';

import {
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type IpaPoint = {
	label: string;
	importance: number | null;
	performance: number | null;
};

type IpaChartProps = {
	points: IpaPoint[] | null;
};

export function IpaChart({ points }: IpaChartProps) {
	const hasData =
		points &&
		points.length > 0 &&
		points.every(
			(p) =>
				p.importance !== null && p.importance !== undefined && p.performance !== null && p.performance !== undefined,
		);

	if (!hasData) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Importance–Performance Analysis (IPA)</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">Brak danych do wyświetlenia wykresu</p>
				</CardContent>
			</Card>
		);
	}

	const getPointColor = (point: IpaPoint) => {
		if (point.importance! >= 3 && point.performance! >= 3) return { color: 'bg-green-400', fallback: '#34D399' };
		if (point.importance! >= 3 && point.performance! < 3) return { color: 'bg-red-400', fallback: '#F87171' };
		if (point.importance! < 3 && point.performance! >= 3) return { color: 'bg-yellow-400', fallback: '#FBBF24' };
		return { color: 'bg-gray-400', fallback: '#9CA3AF' };
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Importance–Performance Analysis (IPA)</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="mx-auto w-full max-w-[700px] aspect-square">
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
							<CartesianGrid strokeDasharray="3 3" />

							<XAxis
								type="number"
								dataKey="performance"
								name="Performance"
								domain={[1, 5]}
								ticks={[1, 2, 3, 4, 5]}
								label={{
									value: 'Performance',
									position: 'insideBottom',
									offset: -10,
								}}
							/>

							<YAxis
								type="number"
								dataKey="importance"
								name="Importance"
								domain={[1, 5]}
								ticks={[1, 2, 3, 4, 5]}
								label={{
									value: 'Importance',
									angle: -90,
									position: 'insideLeft',
									offset: 0,
								}}
							/>

							<ReferenceLine x={3} stroke="#00000020" strokeDasharray="6 6" />
							<ReferenceLine y={3} stroke="#00000020" strokeDasharray="6 6" />

							<Tooltip
								cursor={{ strokeDasharray: '3 3' }}
								formatter={(value, name) => [
									Number(value).toFixed(2),
									name === 'importance' ? 'Importance' : 'Performance',
								]}
								labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ''}
							/>

							<Scatter
								name="Średnia"
								data={points as IpaPoint[]}
								shape={(props: any) => {
									const { cx, cy, payload } = props;
									const { color, fallback } = getPointColor(payload);

									return (
										<>
											<circle
												cx={cx}
												cy={cy}
												r={8}
												fill={fallback}
												className={color}
												stroke="#00000050"
												strokeWidth={1}
											/>

											<text
												x={cx}
												y={cy - 12}
												textAnchor="middle"
												fill="currentColor"
												className="text-sm font-bold text-foreground dark:text-white"
											>
												{payload.label}
											</text>
										</>
									);
								}}
							/>
						</ScatterChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
