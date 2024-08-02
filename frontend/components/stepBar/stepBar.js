import { Component } from '../component.js';
import { clamp, clearChildren } from '../../src/common.js';
const css = "/components/stepBar/stepBar.css";
const html = "/components/stepBar/stepBarWrapper.html";

export class StepData {
    constructor(content, completed, selected) {
        this.content = content;
        this.completed = completed;
        this.selected = selected;
    }
}

export class StepBarItem {
    init() {
        this.item = document.createElement("div");
        this.item.setAttribute("class", "step-bar-item");
        this.text = document.createElement("div");
        this.text.setAttribute("class", "step-counter");
        this.selectedBorder = document.createElement("div");
        this.selectedBorder.setAttribute("class", "step-item-selected-border");
        this.text.addEventListener("click", () => { this.#select() });
        this.item.appendChild(this.text);
        this.item.appendChild(this.selectedBorder);
        this.onSelect = null;
        this.id = null;
        return this;
    }

    #select() {
        if (this.onSelect) {
            this.onSelect(this.id);
        }
    }

    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }

    setData(id, stepData) {
        this.id = id;
        this.text.textContent = stepData.content;
        //this.item.textContent = stepData.content;
        this.item.classList.remove("completed");
        this.item.classList.remove("active");
        this.selectedBorder.classList.add("hidden");
        if (stepData.completed) {
            this.item.classList.add("completed");
        }
        if (stepData.selected) {
            this.item.classList.add("active");
            this.selectedBorder.classList.remove("hidden");
        }
    }

    getRoot() {
        return this.item;
    }
}


export class StepBar extends Component {
    constructor() {
        super(html, css);
        window.addEventListener("resize", () => { this.onResize() })
    }
    static currentMaxSteps = 5;
    static BIG_MAX_STEPS = 7;
    static MED_MAX_STEPS = 5;
    static SML_MAX_STEPS = 3;

    onResize() {
        const desktopSize = 640;
        const bigDesktop = 1280;
        if (window.innerWidth >= bigDesktop)
            StepBar.currentMaxSteps = StepBar.BIG_MAX_STEPS;
        else if (window.innerWidth >= desktopSize)
            StepBar.currentMaxSteps = StepBar.MED_MAX_STEPS;
        else if (window.innerWidth < desktopSize) {
            StepBar.currentMaxSteps = StepBar.SML_MAX_STEPS;
        }
        if (this.lastShow) {
            if (this.lastShow.max != StepBar.currentMaxSteps)
                this.#show(this.lastShow.stepsCount, this.lastShow.completedSteps, this.lastShow.activeIndex);
        }
    }

    setupHtml(node, attributes) {
        this.wrapper = node.querySelector(".step-bar-wrapper");

        this.onSelectCallback = null;
        this.lastShow = null;
        this.elements = [];
        // create max elements
        for (let index = 0; index < StepBar.BIG_MAX_STEPS; index++) {
            this.elements.push(new StepBarItem().init());
        }
    }
    setOnSelectCallback(callback) {
        this.onSelectCallback = callback;
    }

    #onStepSelected(step) {
        if (this.onSelectCallback) {
            this.onSelectCallback(step);
        }
    }

    #getLayout(steps, currentIndex) {
        const maxSteps = StepBar.currentMaxSteps;
        const half = Math.floor(maxSteps / 2);
        let firstIndex = clamp(currentIndex - half, 1, steps);
        let secondIndex = Math.min(maxSteps + 1, steps + 1);
        if (currentIndex > half) {
            secondIndex = clamp(currentIndex + half + 1, 1, steps + 1);
        }

        if (currentIndex > steps - half) {
            firstIndex = clamp(steps - maxSteps + 1, 1);
            secondIndex = steps + 1;
        }
        return {
            "first": firstIndex - 1,
            "second": secondIndex - 1
        };
    }

    #show(stepsCount, completedSteps, activeIndex) {
        clearChildren(this.wrapper);
        this.lastShow = {
            stepsCount: stepsCount,
            completedSteps: completedSteps,
            activeIndex: activeIndex,
            max: StepBar.currentMaxSteps
        }
        const layout = this.#getLayout(stepsCount, activeIndex + 1);
        for (let index = layout.first; index < layout.second; index++) {
            let selected = false;
            let completed = false;
            // check if is completed
            if (completedSteps.includes(index)) {
                completed = true;
            }
            // check if is selected
            if (index == activeIndex) {
                selected = true;
            }
            // get the item and set the data
            const item = this.elements[index - layout.first];
            item.setData(index, new StepData(index + 1, completed, selected));
            item.setOnSelectCallback((stepId) => { this.#onStepSelected(stepId) });
            // add the item
            this.wrapper.appendChild(item.getRoot());
        }
    }

    setItems(stepsCount, completedSteps, activeIndex) {
        this.#show(stepsCount, completedSteps, activeIndex);
    }
}
customElements.define('step-bar', StepBar);