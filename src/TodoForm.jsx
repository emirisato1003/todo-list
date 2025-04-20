import { useRef, useState } from "react";

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef();
    const [workingTodo, setWorkingTodo] = useState('');

    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodo);
        setWorkingTodo('');
        todoTitleInput.current.focus();
    }
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" ref={todoTitleInput} value={workingTodo} onChange={(e) => setWorkingTodo(e.target.value)} id="todoTitle" />
            <button disabled={!workingTodo ? true : false}>Add Todo</button>
        </form>
    );
}

export default TodoForm;

