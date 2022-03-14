import React, { useEffect, useRef, useCallback, ReactNode, Dispatch, SetStateAction } from "react";

interface InfiniteScrollProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageCount: number;
  tolerance?: number;
  height: number;
  children: ReactNode;
  loadMore: (page: number, search?: string) => {};
  styles: object;
  className: string;
  setData: Dispatch<SetStateAction<Array<object>>>;
}

function InfiniteScroll({
  page,
  setPage,
  pageCount,
  tolerance = 25,
  height,
  children,
  loadMore,
  styles,
  className,
  setData,
  ...props
}: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  const loadMoreCallback = useCallback(async (nextPage) => {
    if (page < nextPage) {
      const res: any = await loadMore(nextPage)

      setPage(nextPage)

      setData((p) => [...p, ...res]);
    }
  }, [page])

  useEffect(() => {
    const el = ref.current
    let lock = false;

    if (page === 1) {
      el?.scrollTo({ top: 0 });
    }

    const handleScroll = (e: Event) => {
      const element = e.target as HTMLDivElement

      if (
        element.clientHeight + element.scrollTop >
        element.scrollHeight - tolerance &&
        page < pageCount &&
        !lock
      ) {
        loadMoreCallback(page + 1)
        lock = true;
      }
    };

    el?.addEventListener("scroll", handleScroll);

    return () => el?.removeEventListener("scroll", handleScroll);
  }, [ref, page, pageCount, loadMoreCallback]);

  const stylesProp = {
    overflow: "auto",
    height: "100%",
    maxHeight: `${height}px`,
    ...styles
  }

  return (
    <div
      ref={ref}
      style={stylesProp}
      {...props}
    >
      {children}
    </div>
  );
};

export default InfiniteScroll;
