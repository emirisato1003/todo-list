
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

export function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.FETCH_TODO:
            return {
                ...state,
                isLoading: true,
            };
        case ACTIONS.LOAD_TODOS:
            return {
                ...state,
                todoList: action.records.map(record => {
                    const todo = {
                        id: record.id,
                        ...record.fields
                    };
                    if (!todo.isCompleted) {
                        todo.isCompleted = false;
                    }
                    return todo;
                }),
                isLoading: false
            };
        case ACTIONS.SET_LOAD_ERROR:
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false
            };
        case ACTIONS.START_REQUEST:
            return {
                ...state,
                isSaving: true,
            };
        case ACTIONS.ADD_TODO:
            const savedTodo = {
                id: action.records[0].id,
                ...action.records[0].fields
            };
            if (!action.records[0].fields.isCompleted) {
                savedTodo.isCompleted = false;
            }
            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false
            };
        case ACTIONS.END_REQUEST:
            return {
                ...state,
                isLoading: false,
                isSaving: false
            };
        case ACTIONS.UPDATE_TODO:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.editedTodo.id ? action.editedTodo : todo
                ),
                isSaving: false
            };
        case ACTIONS.COMPLETE_TODO:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.editedTodo.id ? action.editedTodo : todo
                ),
                isSaving: false
            };
        case ACTIONS.REVERT_TODO:
            return {
                ...state,
                todoList: state.todoList.map(todo =>
                    todo.id === action.originalTodo.id ? action.originalTodo : todo
                )
            };
        case ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                errorMessage: ''
            };
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