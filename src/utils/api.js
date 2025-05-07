const token = `Bearer ${import.meta.env.VITE_PAT}`;
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

export const apiRequest = async (options, onStart, onEnd) => {
    try {
        onStart && onStart();
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(res.status);
        }
        const { records } = await res.json();
        return { success: true, records };
    } catch (error) {
        console.log(error.message);
        return { error: error.message };
    } finally {
        onEnd && onEnd();
    }
};

export const getOptions = (method, payload) => {
    const options = {
        method: method,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    };
    if (payload !== undefined) {
        options.body = JSON.stringify(payload);
    }
    return options;
};