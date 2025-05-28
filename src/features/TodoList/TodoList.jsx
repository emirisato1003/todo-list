import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";
import illustration from "../../assets/images/task-concept-illustration/Checklist-bro.png"

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

    return (
        <div className={styles.todoList}>
            {todoList.filter(todo => todo.isCompleted === false).length === 0 ?
                isLoading ? <p>Todo list is loading...</p> : 
                <div className={styles.isCompleted}>
                    <img src={illustration} />
                    <p>Add Task to My Todo✏️</p>
                </div>
                : <ul>
                    {filteredTodoList.map((todo) => {
                        return (
                            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
                        );
                    })}
                </ul>}
        </div>
    );
}

export default TodoList;