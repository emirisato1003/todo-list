import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    return (
        todoList.length === 0 ? <p>Add Task to My Todo✏️</p> :
            <ul>
                {filteredTodoList.map((todo) => {
                    return (
                        <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} />
                    );
                })}
            </ul>
    );
}

export default TodoList;