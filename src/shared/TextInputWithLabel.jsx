import styled from "styled-components";

const StyledLabal = styled.label`
    text-transform: uppercase;
    font-weight: 600;
    font-size: 1.1rem;
`;
export default function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
    return (
        <>
            <StyledLabal htmlFor={elementId}>{labelText}</StyledLabal>
            <input type="text" id={elementId} ref={ref} onChange={onChange} value={value} autoComplete="off" />
        </>
    );
}
