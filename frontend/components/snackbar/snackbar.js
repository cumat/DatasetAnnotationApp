import { createDomElement } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/snackbar/snackbar.css";
const html = "/components/snackbar/snackbar.html";

const autoDeleteTime = 5;

function createSnackbarElem(message, container, stateClass) {
    const root = createDomElement("div", { classList: ['snackbar-elem', stateClass], parent: container, textContent: message });
    const btn = createDomElement("button", { classList: ['snackbar-btn'], parent: root, textContent: "X" })
    btn.addEventListener("click", () => {
        // remove the snackbar on button clicked
        container.removeChild(root);
    })
    // Set a timeout to automatically delete the snackbar after x seconds
    const autoDeleteTimeout = setTimeout(() => {
        if (container.contains(root)) {
            container.removeChild(root);
        }
    }, autoDeleteTime * 1000); // Convert seconds to milliseconds
}

export class Snackbar extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.container = node.querySelector(".snackbar-container");
    }

    createSnackbar(message, success = true) {
        createSnackbarElem(message, this.container, success ? "success" : "failure");
    }
}

customElements.define('snackbar-container', Snackbar);