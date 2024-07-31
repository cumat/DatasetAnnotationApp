
export async function getDatasetDataAt(index) {
    try {
        const response = await fetch(`/dataset/${index}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}
