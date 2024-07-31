import { Component } from '../component.js';
const css = "/components/labelsContainer/labelsContainer.css";
const html = "/components/labelsContainer/labelsContainer.html";

export class LabelsContainer extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.container = node.querySelector(".labels-container");
    }
    addChild(node) {
        this.container.appendChild(node);
    }
}

customElements.define('labels-container', LabelsContainer);