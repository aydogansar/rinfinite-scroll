
Infinite scroll with react

## Import

You can import just InfiniteScroll component and create your own states or you can also import useInfiniteScroll hook.

```js
import InfiniteScroll, { useInfiniteScroll } from "rinfinite-scroll"
```

## Usage

```js

<InfiniteScroll
    page={page}
    setPage={setPage}
    pageCount={15}
    height={350}
    tolerance={150}
    loadMore={loadMore}
    setData={setData}
>
{data.map(item => <span>{item}<span>)}
</InfiniteScroll>

```

### InfiniteScroll component props

| prop | type | description |
| ------ | ------ | ------ |
page | number *| current page state |
setPage | function* | set state function for page |
pageCount | number* | total page count |
tolerance | number | component's scroll bottom tolerance |
height | number* | component's height |
loadMore | function* |  (page: number, search?: string) => {} load new page's data when page change |
styles | object | component's custom style object |
className | string | classname |
setData | function* | set state function for data |


If you want to use hook

It takes a single argument as object

```js
  const { data, setData, page, setPage, search, setSearch, loadMore } = useInfiniteScroll({
    loadMore: async (currentPage) => {
      const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=10&title_like=${search}`
    )
      return res.json()
    }
  })
```

### useInfiniteScroll hook props

| prop | type | description |
| ------ | ------ | ------ |
initialPage | number | initial page |
initialData | array | initial data |
initialSearch | string | initial search |
loadMore | function* | load more data current page when page change or search state change |

```js
import InfiniteScroll, { useInfiniteScroll } from "rinfinite-scroll"

const ExampleComponent = () => {
    const { data, setData, page, setPage, search, setSearch, loadMore } = useInfiniteScroll({
    loadMore: async (currentPage) => {
      const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=10&title_like=${search}`
    )
      return res.json()
    }
  })

  return(
    <div 
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InfiniteScroll
        page={page}
        setPage={setPage}
        pageCount={15}
        height={350}
        tolerance={150}
        loadMore={loadMore}
        setData={setData}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data.length === 0 && <span>Sonuç bulunamadı</span>}
          {data.map((item) => (
            <span
              key={item.id}
              style={{ background: "#ddd", padding: "15px", margin: "10px" }}
            >
              {item.title}
            </span>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

```




