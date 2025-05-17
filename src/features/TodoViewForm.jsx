import { useEffect, useState } from "react";

function TodoViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    const [localQueryString, setLocalQueryString] = useState(queryString);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setQueryString(localQueryString);
        }, 500);
        return () => {
            clearTimeout(debounce);
        };
    }, [localQueryString, setLocalQueryString]);

    const preventRefresh = (e) => {
        e.preventDefault();
    };
    // console.log(queryString);
    return (
        <form onSubmit={preventRefresh}>
            <div>
                <label htmlFor="search">Search todos</label>
                <input type="text" id="search" value={localQueryString} onChange={(e) => setLocalQueryString(e.target.value)} />
                <button type="button" onClick={() => setLocalQueryString("")}>Clear</button>
            </div>
            <label htmlFor="sortBy">Sort By</label>
            <select onChange={(e) => setSortField(e.target.value)} value={sortField} id="sortBy">
                <option value="title">Title</option>
                <option value="createdTime">Time added</option>
            </select>
            <label htmlFor="direction">Direction</label>
            <select onChange={(e) => setSortDirection(e.target.value)} value={sortDirection} id="direction">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </form>
    );
}

export default TodoViewForm;