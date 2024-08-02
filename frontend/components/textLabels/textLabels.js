import { clearChildren } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/textLabels/textLabels.css";
const html = "/components/textLabels/textLabels.html";

export class TextLabel {
    constructor() {
        this.button = document.createElement("button");
        this.button.classList.add("text-label");
        this.button.addEventListener("click", () => { this.#onSelect() })
        this.selected = false;
    }
    #onSelect() {
        if (this.onSelect) {
            let val = this.label;
            if (this.selected) {
                // was already selected
                val = null;
            }
            this.onSelect(val);
        }
    }
    setData(label, callback) {
        this.label = label;
        this.button.textContent = label;
        this.onSelect = callback;
    }

    setSelected(value) {
        this.selected = value;
        if (value) {
            this.button.classList.add("selected");
        }
        else {
            this.button.classList.remove("selected");
        }
    }

    getRoot() {
        return this.button;
    }
}
customElements.define('text-label', TextLabel);
export class TextLabels extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.container = node.querySelector(".text-labels-container");
        window.addEventListener("resize", () => { this.#onResize() });
        this.#onResize();
    }
    static BIG_BUTTONS_IN_ROW = 4;
    static MED_BUTTONS_IN_ROW = 3;
    static SML_BUTTONS_IN_ROW = 2;
    static currentMaxButtonsInRow = TextLabels.MED_BUTTONS_IN_ROW;
    #onResize() {
        const desktopSize = 750;
        const bigDesktop = 1000;
        const prevMax = TextLabels.currentMaxButtonsInRow;
        if (window.innerWidth >= bigDesktop)
            TextLabels.currentMaxButtonsInRow = TextLabels.BIG_BUTTONS_IN_ROW;
        else if (window.innerWidth >= desktopSize)
            TextLabels.currentMaxButtonsInRow = TextLabels.MED_BUTTONS_IN_ROW;
        else if (window.innerWidth < desktopSize) {
            TextLabels.currentMaxButtonsInRow = TextLabels.SML_BUTTONS_IN_ROW;
        }
        if (this.lastShow && prevMax != TextLabels.currentMaxButtonsInRow)
            this.show(this.lastShow.labels, this.currentAnswer);
    }

    show(labels, answer) {
        this.labels = [];
        this.lastShow = {
            labels: labels
        }
        this.currentAnswer = answer;
        clearChildren(this.container);
        this.#sortLabels(labels, this.container);
        this.#updateSelectedLabel(answer)
    }

    setData(data, answer) {
        this.show(data, answer);
    }
    #createLabelItem(label) {
        const lab = new TextLabel();
        // push in labels list
        this.labels.push(lab);
        lab.setData(label, (label) => {
            this.#onSelect(label);
            // select
            this.#updateSelectedLabel(label);
        });
        return lab.getRoot();
    }

    #sortLabels(labels, labelsContainer) {
        const maxButtonInRow = TextLabels.currentMaxButtonsInRow;
        function createButtonRowDiv(children) {
            const div = document.createElement("div");
            div.setAttribute("class", "label-row");
            children.forEach(element => {
                div.appendChild(element);
            });
            return div;
        }
        let buttonList = [];
        for (let index = 0; index < labels.length; index++) {
            const label = labels[index];
            // create button
            const lab = this.#createLabelItem(label);
            this.container.appendChild(lab)
            // add to button row list
            buttonList.push(lab);
            // add to this list
            if (buttonList.length >= maxButtonInRow) {
                const div = createButtonRowDiv(buttonList);
                labelsContainer.appendChild(div);
                buttonList.length = 0;
            }
        }
        // add if buttons were less then max buttons in row
        if (buttonList.length > 0) {
            const div = createButtonRowDiv(buttonList);
            labelsContainer.appendChild(div);
            buttonList.length = 0;
        }
    }

    #updateSelectedLabel(label) {
        this.labels.forEach(lab => {
            if (lab.label == label) {
                lab.setSelected(true);
            }
            else {
                lab.setSelected(false);
            }
        })
    }

    #onSelect(label) {
        if (this.onSelect) {
            this.currentAnswer = label;
            this.onSelect(label);
        }
    }

    setSelectedLabel(label) {
        this.currentAnswer = label;
        this.#updateSelectedLabel(label);
    }

    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }
}

customElements.define('text-labels', TextLabels);