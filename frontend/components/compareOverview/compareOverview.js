import { clearChildren, createDomElement, importCss } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/compareOverview/compareOverview.css";


class CompareElement {
    constructor(label, percentage, users, onSelect) {
        this.root = createDomElement("div", {
            classList: ['compare-element-container']
        })
        this.root.addEventListener("click", () => { onSelect(); });
        let s = " (";
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            s += element
            if (index != users.length - 1) {
                // append ,
                s += ", ";
            }
        }
        s += ")";
        createDomElement("h3", {
            textContent: label, parent: this.root
        });

        createDomElement("span", {
            textContent: `: ${percentage}% ${s}`, parent: this.root
        });
    }

    getRoot() {
        return this.root;
    }
}

export class CompareOverview extends HTMLElement {
    constructor() {
        super();
        importCss(css);
    }

    setData(answers, onSelect) {
        clearChildren(this);
        answers.forEach(answer => {
            this.appendChild(new CompareElement(answer.label, answer.percentage, answer.users, () => {
                onSelect(answer.label);
            }).getRoot());
        })
    }
}

customElements.define("compare-overview", CompareOverview);