
const ACTIONS = {
    FETCH_TODO : 'fetchTodos', 
    LOAD_TODOS : 'loadTodos',
    SET_LOAD_ERROR : 'setLoadError',
    START_REQUEST: 'startRequest',
    ADD_TODO : 'addTodo',
    END_REQUEST: 'endRequest',
    UPDATE_TODO: 'updateTodo',
    COMPLETE_TODO: 'completeTodo',
    REVERT_TODO: 'revertTodo',
    CLEAR_ERROR: 'clearError'
}

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: ''
};

export { initialState, ACTIONS };