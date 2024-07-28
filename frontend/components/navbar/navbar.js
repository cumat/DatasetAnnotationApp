import { Component } from '../component.js';
const navbarCssPath = "/components/navbar/navbar.css";
const navbarHtmlPath = "/components/navbar/navbar.html";

export class Navbar extends Component {
    constructor() {
        super(navbarHtmlPath, navbarCssPath);
    }
    setupHtml(node, attributes) {
        const title = node.querySelector(".navbar-title");
        title.textContent = attributes.title;
    }
}

customElements.define("navbar-comp", Navbar);