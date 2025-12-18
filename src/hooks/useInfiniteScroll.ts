import useObserve from "./useObserve";
import usePagination, { PaginationProps } from "./usePagination";

interface Props<T> extends PaginationProps<T> {
  onReachEnd: (page: number) => Promise<T[]>;
  disabled?: boolean;
}

function useInfiniteScroll<T, K extends HTMLElement>({
  initialData,
  initialPage,
  pageCount,
  onReachEnd,
  disabled,
}: Props<T>) {
  const { handleNextPage, dataList, isLoading } = usePagination<T>({
    initialData,
    initialPage,
    pageCount,
  });

  const { ref } = useObserve<K>({
    onReach: () => {
      handleNextPage(async (newPage) => {
        return await onReachEnd(newPage);
      });
    },
    disabled: disabled || isLoading,
  });

  return {
    ref,
    dataList,
    isLoading,
  };
}
export default useInfiniteScroll;
