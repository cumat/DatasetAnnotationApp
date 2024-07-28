const importedCss = [];

export function importCss(path) {
    // do not include multiple times
    if (importedCss.includes(path)) return;
    const cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("href", path);
    importedCss.push(path);
    document.head.appendChild(cssLink);
}

export async function importHtml(url, onLoad) {
    try {
        // Fetch the external HTML file
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        // Get the HTML text
        const htmlText = await response.text();

        // Insert the HTML into the target element
        const container = document.createElement("div");
        container.innerHTML = htmlText;
        onLoad(container);
    } catch (error) {
        console.error('Error loading external HTML:', error);
    }
}