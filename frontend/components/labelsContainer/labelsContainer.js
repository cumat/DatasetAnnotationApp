import { clearChildren } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/labelsContainer/labelsContainer.css";
const html = "/components/labelsContainer/labelsContainer.html";

export class LabelsContainer extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.container = node.querySelector(".labels-container");
        this.style = `
        width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
        `
    }
    setChild(node) {
        clearChildren(this.container);
        this.container.appendChild(node);
    }
}

customElements.define('labels-container', LabelsContainer);