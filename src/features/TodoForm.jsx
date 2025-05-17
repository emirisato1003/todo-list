import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledButton = styled.button`
    &:disabled{
    font-style: italic;
    background-color: #ccc;
    cursor: not-allowed;
    }
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
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

