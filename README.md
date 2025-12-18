# rinfinite-scroll ✅

Small, focused hooks for building infinite-scroll experiences in React. Exports three utilities:

- **useInfiniteScroll** — a ready-made hook that wires pagination + intersection observation for typical infinite-load scenarios
- **usePagination** — pagination state + helpers
- **useObserve** — a tiny IntersectionObserver hook that exposes a `ref` and calls a callback when the element is observed

---

## Installation 🔧

```bash
npm install rinfinite-scroll
# or
yarn add rinfinite-scroll
```

## Quick example (recommended) 💡

Use `useInfiniteScroll` to load pages when a sentinel element enters the viewport.

```tsx
import React from "react";
import { useInfiniteScroll } from "rinfinite-scroll";

type Item = { id: number; title: string };

function Example() {
  const { ref, dataList, isLoading } = useInfiniteScroll<Item, HTMLDivElement>({
    initialData: [],
    initialPage: 1,
    pageCount: 5,
    onReachEnd: async (page) => {
      const res = await fetch(`/api/items?page=${page}`);
      return await res.json(); // should return Item[]
    },
  });

  return (
    <div>
      {dataList.map((i) => (
        <div key={i.id}>{i.title}</div>
      ))}

      {isLoading && <div>Loading…</div>}

      {/* sentinel element observed by the hook */}
      <div ref={ref} />
    </div>
  );
}
```

---

## API: Hooks & Props 🔍

All hooks are exported from the root:

```ts
import { useInfiniteScroll, usePagination, useObserve } from "rinfinite-scroll";
```

### 1) useInfiniteScroll<T, K extends HTMLElement = HTMLElement> ✨

A convenience hook that composes `usePagination` + `useObserve`.

Signature

```ts
interface Props<T> {
  initialData?: T[];
  initialPage?: number;
  pageCount?: number; // total number of pages (used to stop requesting more)
  onReachEnd: (page: number) => Promise<T[]>; // called with the new page to load
  disabled?: boolean; // disables observing (useful while loading)
}

// second generic `K` types the sentinel element (e.g. HTMLDivElement)
function useInfiniteScroll<T, K extends HTMLElement = HTMLElement>(
  props: Props<T>
): {
  ref: React.RefObject<K | null>;
  dataList: T[];
  isLoading: boolean;
};
```

Props table

| Prop          |                             Type | Required | Default | Description                                                                                       |
| ------------- | -------------------------------: | :------: | :-----: | ------------------------------------------------------------------------------------------------- |
| `initialData` |                            `T[]` |    No    |  `[]`   | Items already loaded (assigned to page 1)                                                         |
| `initialPage` |                         `number` |    No    |   `1`   | Starting page number                                                                              |
| `pageCount`   |                         `number` |    No    |   `1`   | Total pages available (prevents additional requests past this value)                              |
| `onReachEnd`  | `(page: number) => Promise<T[]>` | **Yes**  |    —    | Called when sentinel is reached. Should fetch and return an array of items for the requested page |
| `disabled`    |                        `boolean` |    No    | `false` | When `true`, observing is disabled (no calls to `onReachEnd`)                                     |

Notes

- `useInfiniteScroll` returns a `ref` which you should attach to the sentinel element (typically an empty `div`) placed after the list.
- `isLoading` is `true` while the hook awaits `onReachEnd`.

---

### 2) usePagination<T> 🔁

A general-purpose pagination state manager.

Signature

```ts
interface PaginationProps<T> {
  initialData?: T[];
  pageCount?: number;
  initialPage?: number;
}

function usePagination<T>(props: PaginationProps<T>) {
  return {
    dataList: T[]; // flattened list for easy consumption
    data: { [page: number]: T[] }; // raw page keyed data
    page: number;
    setPage: (p: number) => void;
    handleNextPage: (cb: (nextPage: number) => Promise<T[]>) => Promise<void>;
    isLoading: boolean;
    setLoading: (b: boolean) => void;
  }
}
```

Props table

| Prop          |     Type | Required | Default | Description           |
| ------------- | -------: | :------: | :-----: | --------------------- |
| `initialData` |    `T[]` |    No    |  `[]`   | Data to seed page 1   |
| `pageCount`   | `number` |    No    |   `1`   | Maximum pages allowed |
| `initialPage` | `number` |    No    |   `1`   | Starting page         |

Important behaviors

- `handleNextPage` will compute `nextPage = page + 1`, check it against `pageCount`, set `isLoading`, call the provided callback, and append returned items to internal page store.
- `dataList` is a flattened array computed from the stored pages, convenient for rendering.

Example (manual pagination)

```tsx
import { usePagination } from "rinfinite-scroll";

const PAGE_COUNT = 10;

function ManualPagination() {
  const { dataList, handleNextPage, page, isLoading } = usePagination<{
    id: number;
    title: string;
  }>({
    initialData: [],
    pageCount: PAGE_COUNT,
  });

  return (
    <div>
      {dataList.map((d) => (
        <div key={d.id}>{d.title}</div>
      ))}

      <button
        disabled={isLoading || page >= PAGE_COUNT}
        onClick={() =>
          handleNextPage(async (next) =>
            (await fetch(`/api?page=${next}`)).json()
          )
        }
      >
        Load more
      </button>
    </div>
  );
}
```

---

### 3) useObserve<T extends HTMLElement> 🕵️

A minimal IntersectionObserver hook.

Signature

```ts
interface ObserveProps {
  onReach: () => void; // called when the observed element becomes visible
  disabled?: boolean; // optional
}

function useObserve<T extends HTMLElement>(
  props: ObserveProps
): { ref: React.RefObject<T | null> };
```

Props table

| Prop       |         Type | Required | Default | Description                                            |
| ---------- | -----------: | :------: | :-----: | ------------------------------------------------------ |
| `onReach`  | `() => void` | **Yes**  |    —    | Callback when the observed element enters the viewport |
| `disabled` |    `boolean` |    No    | `false` | When `true`, the observer is ignored                   |

Notes

- Returns a `ref` object; attach it to the element you want observed.

---

## Tips & Gotchas ⚠️

> If your API returns empty arrays when no more data exists, make sure to also set `pageCount` (or stop calling the hook's loader) so the hook doesn't continue to request pages.

- Keep `disabled` synced with loading state if you want to avoid double requests. (useInfiniteScroll does automatically)
- The hooks are intentionally small and unopinionated — combine them to fit your UI patterns.

---
