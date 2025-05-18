import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    display: flex;
    justify-content: space-between;
    margin-top: .5em;
`;
const StyledSearch = styled.div`
    label{
    font-size: .85rem;
    }
`;

const StyledSearchInput = styled.div`
    input{
    color: oklch(96.7% 0.003 264.542);
    border-radius: 20px;
    border: 1px solid oklch(96.7% 0.003 264.542);
    }

    button{
    background:oklch(96.7% 0.003 264.542);
    color: var(--dark-text-color);
    border-radius: 20px;
    }

    button:hover{
    background:#b3e6ff;
    }
`;

const StyledSort = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledSortForm = styled.div`
    margin-block: .4em;
    label{
    font-size: .85rem;
    }
    select{
    border-radius: 6px;
    }
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
                <StyledSortForm>
                    <label htmlFor="sortBy">Sort By</label>
                    <select onChange={(e) => setSortField(e.target.value)} value={sortField} id="sortBy">
                        <option value="title">Title</option>
                        <option value="createdTime">Time added</option>
                    </select>
                </StyledSortForm>
                <StyledSortForm>
                    <label htmlFor="direction">Direction</label>
                    <select onChange={(e) => setSortDirection(e.target.value)} value={sortDirection} id="direction">
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </StyledSortForm>
            </StyledSort>
        </StyledForm>
    );
}

export default TodoViewForm;