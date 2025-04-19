import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

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
            <TextInputWithLabel
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(e) => setWorkingTodo(e.target.value)}
                elementId='todoTitle'
                labelText='Todo'
            />
            <button disabled={!workingTodo ? true : false}>Add Todo</button>
        </form>
    );
}

export default TodoForm;

