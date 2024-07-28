import { Component } from '../component.js';
const homeButtonCss = "/components/usernameForm/usernameForm.css";
const homeButtonHtml = "/components/usernameForm/usernameForm.html";

export class UsernameForm extends Component {
    constructor() {
        super(homeButtonHtml, homeButtonCss);
    }
    setupHtml(node, attributes) {

        const form = node.querySelector(".username-form");
        if (form) {
            form.addEventListener("submit", (event) => {
                this.#onSubmit(event)
            })
        }

        if (attributes.label) {
            const label = node.querySelector(".username-form-label");
            label.textContent = attributes.label;
            label.addEventListener("click", () => {
                console.log("clicked label");
            })
        }

        if (attributes.buttontext) {
            const button = node.querySelector(".username-form-button");
            button.textContent = attributes.buttontext;
        }
        this.onSubmitCallback = null;
        this.input = node.querySelector(".username-form-input");
    }

    #onSubmit(event) {
        event.preventDefault();
        // user function
        if (this.onSubmitCallback) {
            this.onSubmitCallback(this.input.value);
        }
    }

    setOnSubmitCallback(callback) {
        this.onSubmitCallback = callback;
    }
}

customElements.define('username-form', UsernameForm);