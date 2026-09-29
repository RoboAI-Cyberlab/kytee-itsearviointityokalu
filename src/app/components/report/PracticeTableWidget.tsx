import { useState, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState, Column } from "@tanstack/react-table";

type ReportT = ReturnType<typeof useTranslation<"report">>["t"];

import { getAnswerOptions } from "@/store/utils";
import { useReportData } from "@/app/utils/useReportData";

import DownloadBlock from "@/app/components/blocks/DownloadBlock";

const domainSlugs: string[] = [
  "critical",
  "asset",
  "threat",
  "risk",
  "access",
  "situation",
  "response",
  "third-parties",
  "workforce",
  "architecture",
  "program",
];

/**
 * Practice link component
 * @param practiceId - The practice id
 * @returns The practice link
 */
const PracticeLink = ({ practiceId }: { practiceId: string }) => {
  const domain = practiceId.split("-").slice(0, -1).join("-"); // remove last part of practiceId and join the rest

  return (
    <Link
      to="/$domainId"
      params={{ domainId: domain }}
      hash={practiceId}
      preload="intent"
    >
      <span className="whitespace-nowrap text-sm text-turkoosi-700 hover:underline">
        {practiceId}
      </span>
    </Link>
  );
};
/**
 * Get the icon for the answer
 * @param answer - The answer value
 * @returns The icon for the answer
 */
const getAnswerIcon = (answer: number) => {
  const answerOptions = getAnswerOptions();
  const option = answerOptions.find((opt) => opt.value === answer);
  if (!option) return null;

  const Icon = option.icon;
  return (
    <Icon
      className={`mx-auto h-5 w-5 ${option.color} ${option.fillColor}`}
      aria-hidden="true"
    />
  );
};

// Define the type for our practice data
type Practice = {
  key: string;
  title: string;
  answer: number;
  flagged: boolean;
  note: string;
};

const ResetButton = ({
  sorting,
  flaggedFilter,
  domainFilter,
  globalFilter,
  setSorting,
  setFlaggedFilter,
  setDomainFilter,
  setGlobalFilter,
  t,
}: {
  sorting: SortingState;
  flaggedFilter: boolean | undefined;
  domainFilter: string | undefined;
  globalFilter: string;
  setSorting: (sorting: SortingState) => void;
  setFlaggedFilter: (filter: boolean | undefined) => void;
  setDomainFilter: (filter: string | undefined) => void;
  setGlobalFilter: (filter: string) => void;
  t: ReportT;
}) => {
  // Reset function
  const resetTable = () => {
    setSorting([]);
    setFlaggedFilter(undefined);
    setDomainFilter(undefined);
    setGlobalFilter("");
  };

  // Check if table state is modified
  const isTableModified =
    sorting.length > 0 ||
    flaggedFilter !== undefined ||
    domainFilter !== undefined ||
    globalFilter !== "";

  return (
    <button
      className={`flex w-fit items-center gap-2 text-left text-sm ${
        isTableModified
          ? "cursor-pointer text-turkoosi-700 hover:underline"
          : "cursor-default text-muted-foreground"
      }`}
      onClick={resetTable}
      disabled={!isTableModified}
    >
      <RotateCcw className="h-4 w-4" />
      {t('reset_table')}
    </button>
  );
};

// Helper function to check if a column has any values
const hasColumnValues = (data: Practice[], columnId: keyof Practice) => {
  return data.some((row) => {
    const value = row[columnId];
    return (
      value !== undefined && value !== null && value !== "" && value !== false
    );
  });
};

/**
 * Practice table widget lists all practices with their answer and note
 * @returns The practice table widget
 */
export default function PracticeTableWidget() {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | undefined>(undefined);
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);
  const [globalFilter, setGlobalFilter] = useState("");

  const chartRef = useRef<HTMLDivElement>(null!);

  const domainShortTitles = useMemo(
    () => Object.fromEntries(domains.map((d) => [d.id, d.short])),
    [domains],
  );

  const practices = useMemo(
    () =>
      domains.flatMap((domain) =>
        domain.practices.map((practice) => ({
          key: `${domain.id}-${practice.id}`,
          title: practice.title,
          answer: practice.answer,
          flagged: practice.flagged,
          note: practice.note,
        })),
      ),
    [domains],
  );

  // Memoize columns to prevent recreating them on every render
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Practice>();

    const SortIcon = ({ column }: { column: Column<Practice> }) => {
      if (column.getIsSorted() === "asc") {
        return <ArrowUp className="ml-2 h-4 w-4" />;
      }
      if (column.getIsSorted() === "desc") {
        return <ArrowDown className="ml-2 h-4 w-4" />;
      }
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    };

    const columns = [
      columnHelper.accessor("key", {
        header: ({ column }) => (
          <div className="flex items-center justify-start gap-2">
            <div className="flex items-center gap-2">
              <div
                className="flex cursor-pointer items-center justify-center"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                {t('identifier')}
                <SortIcon column={column} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`h-8 w-8 rounded-sm p-0 hover:bg-gray-50 hover:text-accent-foreground focus:outline-none ${
                      domainFilter !== undefined ? "text-turkoosi-700" : ""
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setDomainFilter(undefined)}
                    className={domainFilter === undefined ? "bg-gray-50" : ""}
                  >
                    {t('all')}
                    {domainFilter === undefined && (
                      <Check className="ml-auto" />
                    )}
                  </DropdownMenuItem>
                  {domainSlugs.map((domain) => (
                    <DropdownMenuItem
                      key={domain}
                      onClick={() => setDomainFilter(domain)}
                      className={domainFilter === domain ? "bg-gray-50" : ""}
                    >
                      {domainShortTitles[domain] ?? domain}
                      {domainFilter === domain && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ),
        cell: (info) => <PracticeLink practiceId={info.getValue()} />,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          return (row.getValue(columnId) as string).startsWith(filterValue);
        },
      }),
      columnHelper.accessor("answer", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('answer')}
            <SortIcon column={column} />
          </div>
        ),
        cell: (info) => (
          <span className="text-center text-sm">{info.getValue() || ""}</span>
        ),
      }),
      columnHelper.accessor("answer", {
        id: "status",
        header: t('status'),
        cell: (info) => (
          <div className="text-center">{getAnswerIcon(info.getValue())}</div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("flagged", {
        header: ({ column: _column }) => (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">{t('development_area')}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`ml-2 h-8 w-8 rounded-sm p-0 hover:bg-gray-50 hover:text-accent-foreground focus:outline-none ${
                    flaggedFilter !== undefined ? "text-turkoosi-700" : ""
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setFlaggedFilter(undefined)}
                  className={flaggedFilter === undefined ? "bg-gray-50" : ""}
                >
                  {t('all')}
                  {flaggedFilter === undefined && <Check className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFlaggedFilter(true)}
                  className={flaggedFilter === true ? "bg-gray-50" : ""}
                >
                  {t('development_areas')}
                  {flaggedFilter === true && <Check className="ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        cell: (info) => (
          <div className="text-center">
            {info.getValue() && (
              <Check className="mx-auto h-5 w-5 text-turkoosi" />
            )}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("title", {
        header: t('practice'),
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
        enableSorting: false,
      }),
      columnHelper.accessor("note", {
        header: t('note'),
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
        enableSorting: false,
      }),
    ];

    // Filter out columns that have no values
    return columns.filter((column) => {
      const columnId = column.id || column.accessorKey;
      if (!columnId) return true; // Keep columns without id/accessorKey
      return hasColumnValues(practices, columnId as keyof Practice);
    });
  }, [flaggedFilter, domainFilter, practices, t]);

  // Memoize the table instance
  const table = useReactTable({
    data: practices,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters: [
        ...(domainFilter !== undefined
          ? [{ id: "key", value: domainFilter }]
          : []),
        ...(flaggedFilter !== undefined
          ? [{ id: "flagged", value: flaggedFilter }]
          : []),
      ],
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: false,
    autoResetPageIndex: false,
  });

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('practices_summary')}</h2>
        <div className="flex flex-wrap items-center gap-2 gap-y-4">
          <DownloadBlock chartRef={chartRef} filename="kaytannot.png" />
          <ResetButton
            sorting={sorting}
            flaggedFilter={flaggedFilter}
            domainFilter={domainFilter}
            globalFilter={globalFilter}
            setSorting={setSorting}
            setFlaggedFilter={setFlaggedFilter}
            setDomainFilter={setDomainFilter}
            setGlobalFilter={setGlobalFilter}
            t={t}
          />
          <div className="flex-1"></div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search_practices')}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-8 py-1 pl-8 text-sm"
            />
          </div>
        </div>
      </div>

      <Card className="w-full max-w-[calc(100dvw-1rem)] overflow-x-auto border-none shadow-sm print:shadow-none">
        <CardContent>
          <div ref={chartRef}>
            <Table className="print:text-xs">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="p-2 font-semibold text-gray-800"
                        style={{
                          textAlign:
                            header.id === "answer" ||
                            header.id === "status" ||
                            header.id === "flagged"
                              ? "center"
                              : "left",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="p-2"
                          style={{
                            textAlign:
                              cell.column.id === "answer" ||
                              cell.column.id === "status" ||
                              cell.column.id === "flagged"
                                ? "center"
                                : "left",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t('no_practices')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
