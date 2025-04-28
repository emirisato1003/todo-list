import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    return (
        <>
            {todoList.length === 0 ?
                isLoading ? <p>Todo list is loading...</p> : <p>Add Task to My Todo✏️</p>
                : <ul>
                    {filteredTodoList.map((todo) => {
                        return (
                            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
                        );
                    })}
                </ul>}
        </>
    );
}

export default TodoList;