import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '#/components/ui/pagination';

const buildPageWindow = (current: number, total: number): (number | '...')[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    const addPage = (n: number) => {
        if (!pages.includes(n)) pages.push(n);
    };
    addPage(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) addPage(i);
    if (current < total - 2) pages.push('...');
    addPage(total);
    return pages;
};

export const Paginator = ({
    currentPage,
    totalPages,
    onPage,
}: {
    currentPage: number;
    totalPages: number;
    onPage: (page: number) => void;
}) => {
    if (totalPages <= 1) return null;

    return (
        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPage(Math.max(1, currentPage - 1));
                        }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                    />
                </PaginationItem>
                {buildPageWindow(currentPage, totalPages).map((item, i) =>
                    item === '...' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <PaginationLink
                                href="#"
                                isActive={item === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPage(item as number);
                                }}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPage(Math.min(totalPages, currentPage + 1));
                        }}
                        aria-disabled={currentPage === totalPages}
                        className={
                            currentPage === totalPages
                                ? 'pointer-events-none opacity-50'
                                : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
