import { Component } from '../component.js';
const homeButtonCss = "/components/homeButton/homeButton.css";
const homeButtonHtml = "/components/homeButton/homeButton.html";

export class HomeButton extends Component {
    constructor() {
        super(homeButtonHtml, homeButtonCss);
    }
    setupHtml(node, attributes) {
        const title = node.querySelector(".home-button-title");
        title.textContent = attributes.title;
        const description = node.querySelector(".home-button-description");
        description.textContent = attributes.description;
        if (attributes.href) {
            const homeA = node.querySelector(".home-button");
            homeA.setAttribute("href", attributes.href);
        }
    }
}

customElements.define('home-button', HomeButton);