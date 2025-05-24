
const ACTIONS = {
    FETCH_TODO: 'fetchTodos',
    LOAD_TODOS: 'loadTodos',
    SET_LOAD_ERROR: 'setLoadError',
    START_REQUEST: 'startRequest',
    ADD_TODO: 'addTodo',
    END_REQUEST: 'endRequest',
    UPDATE_TODO: 'updateTodo',
    COMPLETE_TODO: 'completeTodo',
    REVERT_TODO: 'revertTodo',
    CLEAR_ERROR: 'clearError'
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.FETCH_TODO:
            return { ...state, };
        case ACTIONS.LOAD_TODOS:
            return { ...state };
        case ACTIONS.SET_LOAD_ERROR:
            return { ...state };
        case ACTIONS.START_REQUEST:
            return { ...state };
        case ACTIONS.ADD_TODO:
            return { ...state };
        case ACTIONS.END_REQUEST:
            return { ...state };
        case ACTIONS.UPDATE_TODO:
            return { ...state };
        case ACTIONS.COMPLETE_TODO:
            return { ...state };
        case ACTIONS.REVERT_TODO:
            return { ...state };
        case ACTIONS.CLEAR_ERROR:
            return { ...state };
        default:
            return state;
    }
}

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: ''
};

export { initialState, ACTIONS };