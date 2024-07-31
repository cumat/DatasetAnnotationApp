import { Component } from '../component.js';
const css = "/components/textLabels/textLabels.css";
const html = "/components/textLabels/textLabels.html";
const labelhtml = "/components/textLabels/textLabel.html";
export class TextLabel extends Component {
    constructor() {
        super(labelhtml, css);
    }
    setupHtml(node, attributes) {
        this.button = node.querySelector(".text-label");
    }
    setData(label) {
        this.button.textContent = label;
    }
}
customElements.define('text-label', TextLabel);
export class TextLabels extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.container = node.querySelector(".text-labels-container");
    }
    setData(data) {
        data.forEach(label => {
            const lab = document.createElement("text-label");
            lab.addOnLoadListener(() => {
                lab.setData(label);
            })
            this.container.appendChild(lab)
        });
    }
}

customElements.define('text-labels', TextLabels);