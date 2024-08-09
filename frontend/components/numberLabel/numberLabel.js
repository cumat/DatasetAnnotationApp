import { clearChildren } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/numberLabel/numberLabel.css";
const html = "/components/numberLabel/numberLabel.html";

export class NumberLabel extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.setAttribute("style", "height: 100%");
        this.input = node.querySelector(".value-input");
        this.slider = node.querySelector(".value-slider");
        this.input.addEventListener("input", (event) => {
            this.#onInputValueChange(event);
        })
        this.slider.addEventListener("input", (event) => {
            this.input.value = event.target.value;
        })
        this.slider.addEventListener("change", (event) => {
            this.#onInputValueChange(event);
        })
        this.min = this.max = 0;
        this.currentValue = null;
    }

    #setLabel(label) {
        if (this.onSelect) {
            this.onSelect(label);
        }
    }

    #onInputValueChange(event) {
        if (event.target.value == "" || event.target.value == null || event.target.value == undefined) {
            this.currentValue = null;
            this.input.value = this.currentValue;
            this.slider.value = this.currentValue;
            this.#setLabel(this.currentValue);
            return;
        }
        // const numberValue = event.target.value.replace(".", "");
        const n = Number(event.target.value);
        const value = event.target.value;
        console.log("changed to ", value);
        console.log("n", n);
        if (n != null) {

            if (n < this.min || n > this.max) {
                // set previous value
                this.input.value = this.currentValue;
                this.slider.value = this.currentValue;
            }
            else {
                if (this.input.step == 1) {
                    this.currentValue = String(n.toFixed(0));
                    this.input.value = this.currentValue;
                }
                else {
                    this.currentValue = value;
                }
                this.#setLabel(this.currentValue);
                this.slider.value = this.currentValue;
            }
        }
        else {
            this.currentValue = null;
            this.input.value = this.currentValue;
            this.slider.value = this.currentValue;
            this.#setLabel(this.currentValue);
        }
    }
    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }

    #setData(data, answer) {
        this.min = data.min;
        this.max = data.max;
        this.input.placeholder = `Number between ${this.min} and ${this.max}`;
        this.input.setAttribute("min", this.min);
        this.input.setAttribute("max", this.max);
        this.slider.setAttribute("min", this.min);
        this.slider.setAttribute("max", this.max);
        this.input.setAttribute("step", data.step);
        this.slider.setAttribute("step", data.step);
        this.currentValue = answer;
        this.input.value = this.currentValue;
        this.slider.value = this.currentValue;
    }

    setLabels(data, answer, onSelectCallback) {
        this.addOnLoadListener(() => {
            this.#setData(data, answer);
            this.setOnSelectCallback(onSelectCallback);
        });
    }
    setSelectedLabel(label) {
        this.addOnLoadListener(() => {
            this.currentValue = label;
            this.input.value = this.currentValue;
            this.slider.value = this.currentValue;
        });
    }
}

customElements.define('number-labels', NumberLabel);