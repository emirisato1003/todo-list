import styled from "styled-components";

const StyledLabel = styled.label`
    text-transform: uppercase;
    font-weight: 600;
    font-size: 1.1rem;
`;
export default function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
    return (
        <>
            <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
            <input type="text" id={elementId} ref={ref} onChange={onChange} value={value} placeholder="New todo" autoComplete="off" />
        </>
    );
}
