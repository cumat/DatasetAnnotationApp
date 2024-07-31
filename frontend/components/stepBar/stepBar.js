import { Component } from '../component.js';

const css = "/components/stepBar/stepBar.css";
const html = "/components/stepBar/stepBarWrapper.html";
const itemHtml = "/components/stepBar/stepBarItem.html";


export class StepData {
    constructor(content, completed, selected) {
        this.content = content;
        this.completed = completed;
        this.selected = selected;
    }
}

export class StepBarItem extends Component {
    constructor() {
        super(itemHtml, css);
    }

    setupHtml(node, attributes) {
        this.item = node.querySelector(".step-bar-item");
        this.text = node.querySelector(".step-counter");
        this.selectedBorder = node.querySelector(".step-item-selected-border");
    }

    setData(stepData) {
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
}


export class StepBar extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.wrapper = node.querySelector(".step-bar-wrapper");
    }
    setItems(stepsCount, completedSteps, activeIndex) {
        for (let index = 0; index < stepsCount; index++) {
            const item = document.createElement("step-bar-item");
            let selected = false;
            let completed = false;
            // check if it is completed
            if (completedSteps.includes(index)) {
                completed = true;
            }
            // check if it is selected
            if (index == activeIndex) {
                selected = true;
            }
            item.addOnLoadListener(() => {
                item.setData(new StepData(index + 1, completed, selected));
            });
            // add the item
            this.wrapper.appendChild(item);
        }
    }
}

customElements.define('step-bar-item', StepBarItem);
customElements.define('step-bar', StepBar);