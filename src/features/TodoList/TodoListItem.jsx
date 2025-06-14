import { useEffect, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styles from "./TodoListItem.module.css";

import { TbCancel } from "react-icons/tb";
import { LuPencilLine } from "react-icons/lu";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);
    // console.log(workingTitle);
    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo]);
    // console.log(todo);
    function handleCancel(event) {
        event.preventDefault();
        setIsEditing(prev => !prev);
        setWorkingTitle(todo.title);
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
        // console.log(event.target.value);
    }

    function handleUpdate(event) {
        if (!isEditing) return; // exit if not editing
        event.preventDefault();
        onUpdateTodo({ ...todo, title: workingTitle });
        setIsEditing(false);
    }
    return (
        <li className={styles.todoListItem}>
            <form>
                {isEditing ?
                    <div className={styles.editingForm}>
                        <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
                        <button onClick={handleCancel} className={styles.cancel}>Cancel<TbCancel className={styles.icon}/></button>
                        <button onClick={handleUpdate} className={styles.update}>Update<LuPencilLine className={styles.icon}/></button>
                    </div>
                    :
                    <>
                        <label>
                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)} />
                        </label>
                        <span onClick={() => setIsEditing(prev => !prev)}>{todo.title}</span>
                    </>
                }
            </form>
        </li>
    );
}

export default TodoListItem;