
export async function getDatasetDataAt(user, index) {
    try {
        const response = await fetch(`/dataset/${user}/${index}`);
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

export async function saveDatasetLabel(user, id, label) {
    fetch(`/dataset/${user}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            label: label
        })
    });
}

export async function getDatasetName() {
    try {
        const response = await fetch(`/dataset/name`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return dataset name
        return data.dataset;
    } catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}

export async function downloadUserResults(user) {
    try {
        const response = await fetch(`/download/dataset/${user}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return result
        return data;
    }
    catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}

export async function getCompareResults() {
    try {
        const response = await fetch(`/dataset/results`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return result
        return data;
    }
    catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}

export async function getCompareAt(id) {
    try {
        const response = await fetch(`/dataset/at/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return result
        return data;
    }
    catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}

export async function saveDatasetFix(id, label) {
    fetch(`/dataset/fix`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            label: label
        })
    });
}

export async function getAgreementText() {
    try {
        const response = await fetch(`/dataset/agreement`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return result
        return data;
    }
    catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}

export async function downloadDatasetResults() {
    try {
        const response = await fetch(`/download/dataset`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // return result
        return data;
    }
    catch (error) {
        console.error('Fetching data failed:', error);
        throw error;  // Re-throw the error to allow handling it where the function is called
    }
}