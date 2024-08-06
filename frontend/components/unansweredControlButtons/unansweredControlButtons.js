import { Component } from '../component.js';
import { clamp, clearChildren } from '../../src/common.js';
const css = "/components/unansweredControlButtons/unansweredControlButtons.css";
const html = "/components/unansweredControlButtons/unansweredControlButtons.html";

export class UnansweredControlButtons extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.next = node.querySelector(".next");
        this.prev = node.querySelector(".prev");

        this.next.textContent = ">>";
        this.prev.textContent = "<<";

        this.next.addEventListener("click", () => {
            this.#goNext();
        });
        this.prev.addEventListener("click", () => {
            this.#goPrev();
        })

        this.onNext = null;
        this.onPrev = null;
    }

    #goNext() {
        if (this.onNext) {
            this.onNext();
        }
    }

    #goPrev() {
        if (this.onPrev) {
            this.onPrev();
        }
    }

    setCallbacks(onPrev, onNext) {
        this.onNext = onNext;
        this.onPrev = onPrev;
        this.next.classList.remove("hidden");
        this.prev.classList.remove("hidden");

        if (!this.onNext) {
            this.next.classList.add("hidden");
        }
        if (!this.onPrev) {
            this.prev.classList.add("hidden");
        }
    }

}
customElements.define('unanswered-controls', UnansweredControlButtons);