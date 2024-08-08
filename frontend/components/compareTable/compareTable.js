import { clamp, clearChildren, createDomElement } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/compareTable/compareTable.css";
const html = "/components/compareTable/compareTable.html";

export class AnswerData {
    constructor(label, percentage) {
        this.label = label;
        this.percentage = percentage;
    }
}

export class TableData {
    constructor(title, labels) {
        this.title = title;
        this.labels = labels;
    }
}

class TableDataRow {
    constructor() {
        this.tr = createDomElement("tr");
        this.title = createDomElement("td", { parent: this.tr, classList: ["results-title-data"] });
        const tdData = createDomElement("td", { parent: this.tr, classList: ["results-data-row"] });
        this.table = createDomElement("table", { parent: tdData });
        this.title.addEventListener("click", () => {
            this.#onClick();
        });
    }

    #onClick() {
        if (this.onElementClick) {
            this.onElementClick();
        }
    }

    setData(data, onClick) {
        clearChildren(this.table);
        this.title.textContent = data.title;
        this.onElementClick = onClick;
        // add fix if present
        if (data.fix) {
            const row = createDomElement("tr", { parent: this.table });
            createDomElement("td", { parent: row, textContent: `fix: ${data.fix}`, classList: ["fix-data"] });
        }
        // check if there is a conflict
        else if (data.labels.length > 1) {
            const row = createDomElement("tr", { parent: this.table });
            createDomElement("td", { parent: row, textContent: `conflict`, classList: ["conflict-data"] });
        }
        // add labels
        data.labels.forEach(answer => {
            const row = createDomElement("tr", { parent: this.table });
            createDomElement("td", { parent: row, textContent: answer.label, classList: ["label-data"] });
            const percentageBar = createDomElement("td", { parent: row, classList: ["percentage-bar-data"] });
            createDomElement("div", { parent: percentageBar, classList: ["percentage-bar"], attributes: [{ name: "style", value: (`width: ${answer.percentage}%`) }] })
            createDomElement("td", { parent: row, textContent: answer.percentage + "%", classList: ["percentage-text-data"] });
        });

    }

    getRoot() {
        return this.tr;
    }
}
export class CompareTable extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.table = node.querySelector(".results-table");
        this.container = node.querySelector(".table-data-container");
        this.elementsPerPage = 10;
        this.maxButtons = 5;
        this.paginationContainer = node.querySelector(".pagination-container");
        this.next = createDomElement("button", { classList: ['next', 'pagination-control-btn'], textContent: ">" });
        this.next.addEventListener("click", () => { this.#goNextPage() });
        this.prev = createDomElement("button", { classList: ['prev', 'pagination-control-btn'], textContent: "<" });
        this.prev.addEventListener("click", () => { this.#goPrevPage() });
        this.header = node.querySelector(".header");
        this.dataRows = [];
        this.currentPage = 1;
        this.currentData = [];
        this.maxPages = 1;
        for (let index = 0; index < this.elementsPerPage; index++) {
            this.dataRows.push(new TableDataRow());
        }
    }

    #onElementClick(id) {
        if (this.onElemClick) {
            this.onElemClick(id);
        }
    }

    #goPrevPage() {
        this.setCurrentPage(this.currentPage - 1);
    }
    #goNextPage() {
        this.setCurrentPage(this.currentPage + 1);
    }

    #setupPagination(pages, currentPage) {
        clearChildren(this.paginationContainer);
        this.paginationContainer.appendChild(this.prev);
        const half = Math.floor(this.maxButtons / 2);
        let startingIndex = currentPage - half - 1;
        let finalIndex = currentPage + half;
        if (startingIndex < 0) {
            startingIndex = 0;
            finalIndex = clamp(this.maxButtons, 0, pages);
        }

        if (finalIndex > pages) {
            startingIndex = clamp(pages - this.maxButtons, 0, pages);
            finalIndex = pages;
        }
        for (let index = startingIndex; index < finalIndex; index++) {

            const btn = createDomElement("button", { classList: ['pagination-btn'], parent: this.paginationContainer, textContent: String(index + 1) });
            if (index + 1 == currentPage) {
                btn.classList.add("selected");
            }
            btn.addEventListener("click", () => {
                this.setCurrentPage(index + 1);
            });

        }
        this.paginationContainer.appendChild(this.next);
    }
    #show() {
        const data = this.currentData;
        const currentPage = this.currentPage;
        const elements = data.length;
        const pages = elements / this.elementsPerPage;
        this.#setupPagination(pages, currentPage);

        const startingIndex = (currentPage - 1) * this.elementsPerPage;
        const endingIndex = clamp(startingIndex + this.elementsPerPage, 0, elements);

        clearChildren(this.table);
        this.table.appendChild(this.header);
        for (let index = startingIndex; index < endingIndex; index++) {
            const d = data[index];
            const row = this.dataRows[index - startingIndex];
            row.setData(d, () => {
                this.#onElementClick(d.id);
            });
            this.table.appendChild(row.getRoot());
        }
    }
    setData(data, onElemClick, currentPage = 1) {
        this.onElemClick = onElemClick;
        this.currentData = data;
        this.currentPage = currentPage;
        this.maxPages = Math.ceil(data.length / this.elementsPerPage);
        this.#show();
        this.#updateControls();
    }

    #updateControls() {
        const page = this.currentPage;
        this.next.classList.remove("disabled");
        this.prev.classList.remove("disabled");

        if (page == 1) {
            this.prev.classList.add("disabled");
        }
        if (page == this.maxPages) {
            this.next.classList.add("disabled");
        }
    }

    setCurrentPage(page) {
        if (page >= 1 && page <= this.maxPages && page != this.currentPage) {
            this.currentPage = page;
            this.#show();
            this.#updateControls();
            if (this.onPageChange) {
                this.onPageChange(page);
            }
        }
    }

    setOnPageChangeListener(callback) {
        this.onPageChange = callback;
    }
}

customElements.define('compare-table', CompareTable);
