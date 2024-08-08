import { Component } from "../component.js";

const html = "/components/compareTableFilters/compareTableFilters.html";
const css = "/components/compareTableFilters/compareTableFilters.css"

export const UNANSWERED = "unanswered";
export const CONFLICT = "conflict";
export const FIXES = "fixes";

export class CompareTableFilters extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes, children) {
        this.unanswered = node.querySelector(".unanswered");
        this.conflict = node.querySelector(".conflict");
        this.fixes = node.querySelector(".fixes");

        this.unanswered.addEventListener("click", () => {
            this.#onFilterSelect(UNANSWERED);
        })
        this.conflict.addEventListener("click", () => {
            this.#onFilterSelect(CONFLICT);
        })
        this.fixes.addEventListener("click", () => {
            this.#onFilterSelect(FIXES);
        })
        this.currentFilter = null;
    }

    #selectFilter(filter) {
        this.unanswered.classList.remove("selected");
        this.conflict.classList.remove("selected");
        this.fixes.classList.remove("selected");

        if (filter == UNANSWERED) {
            this.unanswered.classList.add("selected");
        }
        else if (filter == CONFLICT) {
            this.conflict.classList.add("selected");
        }
        else if (filter == FIXES) {
            this.fixes.classList.add("selected");
        }
    }

    #onFilterSelect(filter) {

        this.currentFilter = this.currentFilter == filter ? null : filter;
        this.#selectFilter(this.currentFilter);
        if (this.onFilterSelected) {
            this.onFilterSelected(this.currentFilter);
        }
    }

    setSelectedFilter(filter) {
        this.currentFilter = filter;
        this.#selectFilter(this.currentFilter);
    }

    setData(callback, unanswered = false, fixes = false, conflict = false) {
        this.onFilterSelected = callback;
        this.unanswered.classList.add("hidden");
        this.fixes.classList.add("hidden");
        this.conflict.classList.add("hidden");

        if (unanswered) {
            this.unanswered.classList.remove("hidden");
        }
        if (fixes) {
            this.fixes.classList.remove("hidden");
        }
        if (conflict) {
            this.conflict.classList.remove("hidden");
        }
    }
}

customElements.define('compare-table-filters', CompareTableFilters);