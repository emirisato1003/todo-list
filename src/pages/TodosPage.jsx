import { createContext } from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodoViewForm from '../features/TodoViewForm';

// --- Context ---
const SortContext = createContext();

export default function TodosPage({ handleAddTodo, todoState, onCompleteTodo, updateTodo, sortState, sortDispatch }) {
    return (
        <>
            <TodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving} />
            <TodoList
                todoList={todoState.todoList}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={updateTodo}
                isLoading={todoState.isLoading} />
            <hr />
            <SortContext.Provider value={{ sortState, sortDispatch }}>
                <TodoViewForm />
            </SortContext.Provider>
        </>
    );
}

export { SortContext };

