import TodoListItem from "./TodoListItem";
import illustration from "../../assets/images/task-concept-illustration/Checklist-bro.png";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { MdNavigateNext } from "react-icons/md";

import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    // useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const itemsPerPage = 15;
    const currentPage = parseInt(searchParams.get('page') || '1');
    const navigate = useNavigate()
    const indexOfFirstTodo = itemsPerPage * (currentPage - 1);
    const indexOfLastTodo = currentPage * itemsPerPage;
    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

    useEffect(() => {
        if(currentPage < 1 || !Number.isInteger(currentPage) ||currentPage > totalPages){
            navigate("/")
        }
    }, [currentPage, totalPages, navigate])

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setSearchParams({ page: currentPage - 1 });
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSearchParams({ page: currentPage + 1 });
        }
    };
    return (
        <div className={styles.todoList}>
            {todoList.filter(todo => todo.isCompleted === false).length === 0 ?
                isLoading ? <p>Todo list is loading...</p> :
                    <div className={styles.isCompleted}>
                        <img src={illustration} />
                        <p>Add Task to My Todo✏️</p>
                    </div>
                : <ul>
                    {currentTodos.map((todo) => {
                        return (
                            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
                        );
                    })}
                </ul>}
            <div className={styles.paginationControls}>
                <button onClick={() => handlePreviousPage()} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handleNextPage()} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default TodoList;