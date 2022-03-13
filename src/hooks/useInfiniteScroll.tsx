import { useState, useEffect, useCallback } from "react";

interface InfiniteScrollProps {
    initialData?: Array<object>;
    initialPage?: number;
    initialSearch?: string;
    loadMore: (page: number, search?: string) => void;
}

function useInfiniteScroll({ initialData = [], initialPage = 1, initialSearch = "", loadMore = () => { } }: InfiniteScrollProps) {
    const [data, setData] = useState(initialData)
    const [page, setPage] = useState(initialPage)
    const [search, setSearch] = useState(initialSearch)

    const onSearch = useCallback(async () => {
        const res: any = await loadMore(1, search)
        const json = await res.json();

        setPage(1)

        setData(json)
    }, [search])


    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return {
        data,
        setData,
        page,
        setPage,
        search,
        setSearch,
        loadMore
    }
}
export default useInfiniteScroll