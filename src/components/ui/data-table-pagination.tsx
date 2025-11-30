import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginationParams } from "@/hooks/use-pagination-params";

interface DataTablePaginationProps {
  isLoading?: boolean;
  hasNextPage: boolean;
}

const disabledStyles = "pointer-events-none opacity-50";
const enabledStyles = "cursor-pointer";

export function DataTablePagination({
  isLoading = false,
  hasNextPage,
}: DataTablePaginationProps) {
  const { page, pageSize, goToPage, changePageSize, hasPreviousPage } =
    usePaginationParams();
  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const siblingsCount = 2;

    pages.push(1);

    if (page > siblingsCount + 2) {
      pages.push("ellipsis");
    }

    const startPage = Math.max(2, page - siblingsCount);
    const endPage = page + siblingsCount;

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (hasNextPage) {
      pages.push("ellipsis");
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => changePageSize(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 w-20">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100, 200].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(page - 1)}
              className={
                !hasPreviousPage || isLoading ? disabledStyles : enabledStyles
              }
            />
          </PaginationItem>

          {pageNumbers.map((currentPage, index) =>
            currentPage === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}-${page}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={currentPage}>
                <PaginationLink
                  onClick={() => goToPage(currentPage)}
                  isActive={currentPage === page}
                  className={isLoading ? disabledStyles : enabledStyles}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => goToPage(page + 1)}
              className={
                !hasNextPage || isLoading ? disabledStyles : enabledStyles
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
