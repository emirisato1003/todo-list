
const ACTIONS = {
    SET_SORT_DIRECTION: 'setSortDirection',
    SET_SORT_FILED: 'setSortField',
    SET_QUERY_STRING: 'setQueryString'
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.SET_SORT_DIRECTION:
            return {
                ...state,
                sortDirection: action.value
            };
        case ACTIONS.SET_SORT_FILED:
            return {
                ...state,
                sortField: action.value
            };
        case ACTIONS.SET_QUERY_STRING:
            return {
                ...state,
                queryString: action.localQueryString
            };
        default:
            return state;
    }
}

const initialState = {
    sortDirection: 'desc',
    sortField: 'createdTime',
    queryString: ''
};

export { ACTIONS, reducer, initialState };