import { useCallback, useEffect, useMemo, useState } from "react";

export interface PaginationProps<T> {
  initialData?: T[];
  pageCount?: number;
  initialPage?: number;
}

function usePagination<T>({
  initialData,
  pageCount = 1,
  initialPage = 1,
}: PaginationProps<T>) {
  const [data, setData] = useState<{ [page: number]: T[] }>(
    initialData ? { 1: initialData } : {}
  );
  const [page, setPage] = useState(initialPage);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && !data[1]) {
      setData({
        1: initialData,
      });
    }
  }, [initialData, data]);

  const handleNextPage = useCallback(
    async (callback: (nextPage: number) => Promise<T[]>) => {
      const nextPage = page + 1;

      if (pageCount < nextPage) {
        return;
      }

      setLoading(true);

      const result = await callback(nextPage);

      if (result) {
        setData((p) => ({
          ...p,
          [nextPage]: result,
        }));
      }

      setPage(nextPage);
      setLoading(false);
    },
    [page, data, pageCount]
  );

  const dataList = useMemo(() => {
    return Object.values(data).reduce((acc, curr) => {
      if (Array.isArray(curr) && Array.isArray(acc)) {
        return [...acc, ...curr];
      }

      return [];
    }, []);
  }, [data]);

  return {
    dataList,
    data,
    page,
    setPage,
    handleNextPage,
    isLoading,
    setLoading,
  };
}

export default usePagination;
