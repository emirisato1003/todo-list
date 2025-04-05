import { useRef } from "react";

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef();

    function handleAddTodo(event) {
        event.preventDefault();
        const title = event.target.title.value;
        event.target.title.value = "";
        onAddTodo(title);
        todoTitleInput.current.focus();
    }
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" ref={todoTitleInput} id="todoTitle" name="title" />
            <button>Add Todo</button>
        </form>
    );
}

export default TodoForm;