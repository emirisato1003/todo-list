
export default function TextInputWithLabel({elementId, labelText, onChange, ref, value}) {
    // console.log(elementId);
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            <input type="text" id={elementId} ref={ref} onChange={onChange} value={value} autoComplete="off" />
        </>
    );
}
