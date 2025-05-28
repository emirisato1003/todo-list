import styled from "styled-components";

const StyledLabel = styled.label`
    text-transform: uppercase;
    font-weight: 600;
    font-size: 1.1rem;
`;
const StyledInput = styled.input`
    flex: 1;
    min-width: 0;
`
export default function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
    return (
        <>
            <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
            <StyledInput type="text" id={elementId} ref={ref} onChange={onChange} value={value} placeholder={value ? value: "New todo"} autoComplete="off" />
        </>
    );
}
