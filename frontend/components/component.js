import { importCss, importHtml } from '../src/common.js'


function replaceNodeWithChildren(node) {
    if (!node || !node.parentElement) {
        console.error("Node or parent element is not defined.");
        return;
    }

    const parent = node.parentElement;

    // Move each child node of the given node to its parent
    while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
    }

    // Remove the node itself
    parent.removeChild(node);
}

//const components = new Map();

export function getComponentWithId(id) {
    return document.getElementById(id);
}

export class Component extends HTMLElement {
    constructor(htmlPath, cssPath = null) {
        super();
        // set id if present
        // if (this.attributes.id) {
        //     console.log("saved id: ", this.attributes.id.value);
        //     components[this.attributes.id.value] = this;
        // }
        // set is loaded to false
        this.isLoaded = false;
        this.onLoaded = [];
        if (cssPath)
            importCss(cssPath);
        importHtml(htmlPath, (html) => {
            // Create a template element to parse the HTML string
            const template = document.createElement('template');
            template.innerHTML = html.innerHTML;

            // Collect the current children of this element
            const children = Array.from(this.children);

            // Clear the existing content of this element
            this.innerHTML = '';

            // Append the new nodes from the template
            this.appendChild(template.content.cloneNode(true));
            // Set up the HTML and call afterHtml
            this.setupHtml(this, this.#getAttributes(), children);
            // replace the custom node with his children
            //replaceNodeWithChildren(this);
            // set is loaded to true
            this.isLoaded = true;
            // call on loaded callback
            this.onLoaded.forEach(callback => callback());
        })

    }
    addOnLoadListener(callback) {
        // call immediately if already loaded
        if (this.isLoaded) {
            callback();
        }
        else {
            // add to callback list
            this.onLoaded.push(callback);
        }
    }
    // Method to collect attributes as an object
    #getAttributes() {
        return Array.from(this.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});
    }
    setupHtml(node, attributes, children = null) {
        throw new Error('setupHtml must be implemented by subclasses');
    }
}

addEventListener('DOMContentLoaded', e => console.log('DOM loaded'));
