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

export function redirect(path) {
    window.location.href = path;
}

export function updateUrl(path) {
    if (window.location.pathname !== path)
        history.pushState({ path: path }, '', path);
}

export function getArg(name) {
    // Get the query string from the URL
    const queryString = window.location.search;

    // Create a URLSearchParams object
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the 'name' query parameter
    return urlParams.get(name);
}

export function getPathParameterAt(index) {
    const path = window.location.pathname;
    const segments = path.split('/');
    segments.splice(0, 1); // remove host
    if (index > segments.length - 1)
        return null;
    else
        return segments[index];
}


export function clearChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

export function setPageTitle(title) {
    document.title = title;
}

export function clamp(x, min = 0, max = Number.MAX_VALUE) {
    if (x < min) {
        return min;
    }
    else if (x > max) {
        return max;
    }
    else return x;
}

export function createDomElement(type, settings = {}) {
    // Default settings
    const defaultSettings = {
        parent: null,
        classList: [],
        attributes: [],
        textContent: null
    };
    // Merge default settings with provided settings
    const { parent, classList, attributes, textContent } = { ...defaultSettings, ...settings };
    // Create the element
    const element = document.createElement(type);

    // Add classes
    if (classList.length > 0) {
        element.classList.add(...classList);
    }

    // Set attributes
    attributes.forEach(attr => {
        const { name, value } = attr;
        element.setAttribute(name, value);
    });

    if (textContent) {
        element.textContent = textContent;
    }

    // Append to parent if provided
    if (parent) {
        parent.appendChild(element);
    }

    return element;
}