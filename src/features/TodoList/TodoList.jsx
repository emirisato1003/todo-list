import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    // console.log(todoList);
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    // console.log(todoList);
    // console.log(filteredTodoList);
    return (
        <>
            {todoList.filter(todo => todo.isCompleted === false).length === 0 ?
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

//todoList.filter(todo => todo.isCompleted === false).length === 0