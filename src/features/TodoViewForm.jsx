import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    display: flex;
    justify-content: space-between;
    // margin: 1.6em;
`
const StyledSearch = styled.div`
    // margin-block: 1em;
    display: flex;
    flex-direction: column;
`

const StyledSearchInput = styled.div`
`

const StyledSort = styled.div`
    display: flex;
    flex-direction: column;
`

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
        <StyledForm onSubmit={preventRefresh}>
            <StyledSearch>
                <label htmlFor="search">Search todos</label>
                <StyledSearchInput>
                    <input type="text" id="search" value={localQueryString} onChange={(e) => setLocalQueryString(e.target.value)} />
                    <button type="button" onClick={() => setLocalQueryString("")}>Clear</button>
                </StyledSearchInput>
            </StyledSearch>
            <StyledSort>
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
            </StyledSort>
        </StyledForm>
    );
}

export default TodoViewForm;