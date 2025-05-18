import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";
import { IoIosAddCircleOutline } from "react-icons/io";

const StyledForm = styled.form`
margin-block: 2em;
`;

const StyledButton = styled.button`
    &:after{
    content:'+'
    }
    &:disabled{
    font-style: italic;
    background-color: #ccc;
    cursor: not-allowed;
    }
`;

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef();
    const [workingTodo, setWorkingTodo] = useState('');
    console.log(Boolean(!workingTodo));
    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodo);
        setWorkingTodo('');
        todoTitleInput.current.focus();
    }
    return (
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(e) => setWorkingTodo(e.target.value)}
                elementId="todoTitle"
                labelText='Todo'
            />
            <StyledButton disabled={!workingTodo} aria-disabled={!workingTodo}>Add Todo</StyledButton>
        </StyledForm>
    );
}

export default TodoForm;

