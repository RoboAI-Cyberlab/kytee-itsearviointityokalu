import { useRef, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

import DownloadBlock from "@/app/components/blocks/DownloadBlock";
import { useReportData } from "@/app/utils/useReportData";

interface Standing {
  id: string;
  title: string;
  practices: number;
  strong: number;
  weak: number;
  avgScore: number;
  ratio: number;
}

const ResetButton = ({
  sorting,
  setSorting,
}: {
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
}) => {
  const { t } = useTranslation('report');
  // Reset function
  const resetTable = () => setSorting([]);

  return (
    <button
      className={`flex w-fit items-center gap-2 text-left text-sm ${
        sorting.length > 0
          ? "cursor-pointer text-turkoosi-700 hover:underline"
          : "cursor-default text-muted-foreground"
      }`}
      onClick={resetTable}
      disabled={!sorting.length}
    >
      <RotateCcw className="h-4 w-4" />
      {t('reset_table')}
    </button>
  );
};

/**
 * MaturityLevelStandingsTableWidget is a component that displays the standings of the domains in the assessment.
 * It is used to display the standings of the domains in the report page.
 */
export default function MaturityLevelStandingsTableWidget() {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const chartRef = useRef<HTMLDivElement>(null!);

  const defaultSort: SortingState = [{ id: "ratio", desc: true }];
  const [sorting, setSorting] = useState<SortingState>(defaultSort);

  const standings = useMemo(
    () =>
      domains.map((domain) => {
        const strong = domain.practices.filter((p) => p.answer > 2).length;
        const weak = domain.practices.filter((p) => p.answer > 0 && p.answer <= 2).length;
        const avgScore = domain.total === 0 ? 0 : domain.practices.reduce((acc, p) => acc + p.answer, 0) / domain.total;

        return {
          id: domain.id,
          title: domain.title,
          practices: domain.total,
          strong,
          weak,
          avgScore,
          ratio: domain.total === 0 ? 0 : strong / domain.total,
        };
      }),
    [domains],
  );

  // Memoize columns to prevent recreating them on every render
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Standing>();

    return [
      columnHelper.accessor("id", {
        id: "position",
        header: "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
      }),
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('section')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("practices", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('practices')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("strong", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('strong')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("weak", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('weak')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("avgScore", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('average')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
        cell: (info) => info.getValue().toFixed(2),
      }),
      columnHelper.accessor("ratio", {
        header: ({ column }) => (
          <div
            className="flex cursor-pointer items-center justify-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('implementation_rate')}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
        ),
        cell: (info) => `${Math.round(info.getValue() * 100)} %`,
        sortDescFirst: true,
      }),
    ];
  }, []);

  // Memoize the table instance
  const table = useReactTable({
    data: standings,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    autoResetPageIndex: false,
  });

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('domain_standings_title')}</h2>
        <div className="flex items-center gap-2">
          <DownloadBlock
            chartRef={chartRef}
            filename="osioiden-sijoitukset.png"
          />
          <ResetButton sorting={sorting} setSorting={setSorting} />
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
                            header.id === "position" || header.id === "title"
                              ? "left"
                              : "center",
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-2 text-sm"
                        style={{
                          textAlign:
                            cell.column.id === "position" ||
                            cell.column.id === "title"
                              ? "left"
                              : "center",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
