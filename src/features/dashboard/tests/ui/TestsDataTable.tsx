'use client';

import * as React from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LayoutGrid, MoreVertical, Search, X } from 'lucide-react';
import Link from 'next/link';

import { TestsTableRow } from '../db/api';
import EditTestsForm from './Form/EditTestsForm';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { slugify } from '@/utils/slugify';
import { useTranslations } from 'next-intl';

interface TestsDataTableProps {
	data: TestsTableRow[];
	page: number;
	setPage: (p: number) => void;
	rowsPerPage: number;
	setRowsPerPage: (r: number) => void;
	total: number;
	search: string;
	setSearch: (s: string) => void;
}

export function TestsDataTable({
	data,
	page,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	total,
	search,
	setSearch,
}: TestsDataTableProps) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [inputValue, setInputValue] = React.useState(search || '');
	const t = useTranslations();
	
	const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

	const columns: ColumnDef<TestsTableRow>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label={t('Table.select_all')}
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label={t('Table.select_row')}
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'name',
			header: () => t('TestsDataTable.name'),
			cell: ({ row }) => {
				const testName = row.original.name;
				const testId = row.original.id;

				const slug = slugify(testName);
				return (
					<Link href={`/dashboard/tests/${slug}-${testId}`} className="text-primary hover:underline font-medium">
						<div className="truncate max-w-[20rem]" title={testName}>
							{testName}
						</div>
					</Link>
				);
			},
			enableHiding: false,
		},
		{
			accessorKey: 'description',
			header: () => t('TestsDataTable.description'),
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-[10rem]" title={row.original.description}>
						{row.original.description}
					</div>
				);
			},
		},
		{
			accessorKey: 'template',
			header: () => t('TestsDataTable.template'),
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-48" title={row.original.template.name}>
						{row.original.template.name}
					</div>
				);
			},
		},
		{
			accessorKey: 'created By',
			header: () => t('TestsDataTable.created_by'),
			cell: ({ row }) => {
				return row.original.createdBy;
			},
		},
		{
			accessorKey: 'startsAt',
			header: () => t('TestsDataTable.starts_at'),
			cell: ({ row }) => {
				return row.original.startsAt;
			},
		},
		{
			accessorKey: 'endsAt',
			header: () => t('TestsDataTable.ends_at'),
			cell: ({ row }) => {
				return row.original.endsAt;
			},
		},
		{
		accessorKey: 'IsActive',
		header: () => t('TestsDataTable.is_active'),
		cell: ({ row }) => {
			return row.original.active ? (
				<Check className="h-4 w-4 text-green-600" />
			) : (
				<X className="h-4 w-4 text-red-600" />
			);
		},
		},
		{
			accessorKey: 'createdAt',
			header: () => t('TestsDataTable.created_at'),
			cell: ({ row }) => {
				return row.original.createdAt;
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
							<MoreVertical />
							<span className="sr-only">{t('Table.open_menu')}</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-32">
						<DropdownMenuItem asChild>
							<EditTestsForm
								test={{
									id: row.original.id,
									name: row.original.name,
									description: row.original.description,
									startsAt: row.original.startsAt,
									endsAt: row.original.endsAt,
									active: row.original.active,
								}}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination: {
				pageIndex: page - 1,
				pageSize: rowsPerPage,
			},
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<div className="flex items-center gap-2">
					<Input
						type="text"
						placeholder={`${t("Table.search")}...`}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setSearch(inputValue);
								setPage(1);
							}
						}}
						className="flex-1"
					/>
					<Button
						size="sm"
						onClick={() => {
							setSearch(inputValue);
							setPage(1);
						}}
					>
						<Search className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<LayoutGrid />
								<span className="hidden lg:inline">{t("Table.customize_columns")}</span>
								<span className="lg:hidden">{t("Table.columns")}</span>
								<ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="flex flex-col gap-4 px-4 lg:px-6 pt-4">
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										{t("Table.no_results")}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between px-4">
					<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
						{table.getFilteredSelectedRowModel().rows.length} {t("Table.of")} {total} {t("Table.rows_selected")}
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								{t("Table.rows_per_page")}
							</Label>
							<Select
								value={rowsPerPage.toString()}
								onValueChange={(value) => {
									setRowsPerPage(Number(value));
									setPage(1);
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue placeholder={rowsPerPage.toString()} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((n) => (
										<SelectItem key={n} value={n.toString()}>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex w-fit items-center justify-center text-sm font-medium">
							{t("Table.page")} {page} {t("Table.of")} {Math.ceil(total / rowsPerPage)}
						</div>

						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPage(1)}
								disabled={page === 1}
							>
								<span className="sr-only">{t("Table.go_to_first_page")}</span>
								<ChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
							>
								<span className="sr-only">{t("Table.go_to_previous_page")}</span>
								<ChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => setPage(page + 1)}
								disabled={page === Math.ceil(total / rowsPerPage)}
							>
								<span className="sr-only">{t("Table.go_to_next_page")}</span>
								<ChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => setPage(Math.ceil(total / rowsPerPage))}
								disabled={page === Math.ceil(total / rowsPerPage)}
							>
								<span className="sr-only">{t("Table.go_to_last_page")}</span>
								<ChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

