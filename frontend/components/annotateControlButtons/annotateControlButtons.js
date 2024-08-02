import { Component } from '../component.js';
const css = "/components/annotateControlButtons/annotateControlButtons.css";
const html = "/components/annotateControlButtons/annotateControlButtons.html";

export class AnnotateControlButtons extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.next = node.querySelector(".next");
        this.prev = node.querySelector(".prev");

        this.onNext = null;
        this.onPrev = null;

        this.next.addEventListener("click", () => { this.#onNext() });
        this.prev.addEventListener("click", () => { this.#onPrev() });
        this.next.classList.add("hidden");
        this.prev.classList.add("hidden");
    }

    #onPrev() {
        if (this.onPrev) {
            this.onPrev();
        }
    }

    #onNext() {
        if (this.onNext) {
            this.onNext();
        }
    }

    setCallbacks(onPrev, onNext) {
        this.onPrev = onPrev;
        this.onNext = onNext;
        this.next.classList.add("hidden");
        this.prev.classList.add("hidden");

        // set visibility
        if (this.onPrev) {
            this.prev.classList.remove("hidden");
        }
        if (this.onNext) {
            this.next.classList.remove("hidden");
        }
    }
}

customElements.define('annotate-control-buttons', AnnotateControlButtons);