import { Component } from '../component.js';
const css = "/components/imageLabel/imageLabel.css";
const html = "/components/imageLabel/imageLabel.html";

class ImageLabelValue {
    constructor(startX = 0, startY = 0, endX = 0, endY = 0) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.callbacks = [];
    }

    addOnValueChangeListener(callback) {
        this.callbacks.push(callback);
    }

    setValue(strAnswer) {
        let answer = null;
        try {
            answer = JSON.parse(strAnswer);

        }
        catch {
            answer = null;
        }
        finally {
            if (answer) {
                this.startX = answer.startX;
                this.startY = answer.startY;
                this.endX = answer.endX;
                this.endY = answer.endY;
            }
            else {
                this.startX = 0;
                this.startY = 0;
                this.endX = 0;
                this.endY = 0;
            }
        }
        this.callbacks.forEach(c => {
            c();
        })
    }

    valueChanged() {
        this.callbacks.forEach(c => {
            c();
        })
    }

    getStringValue() {
        if (this.startX == this.endX && this.startY == this.endY) {
            return null;
        }
        else {
            return JSON.stringify({
                'startX': this.startX,
                'startY': this.startY,
                'endX': this.endX,
                'endY': this.endY
            });
        }
    }
}

export class ImageLabel extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.canvas = node.querySelector(".img-canvas");
        this.colorPicker = node.querySelector(".color-picker");
        this.resetButton = node.querySelector(".reset-btn");
        this.helpText = node.querySelector(".help-text");
        this.ctx = this.canvas.getContext("2d");
        this.coordsText = node.querySelector(".coords-text");
        this.imageId = null;
        this.isDrawnig = false;
        this.currentValue = new ImageLabelValue();
        this.currentColor = this.colorPicker.value;
        // add canvas draw events
        this.canvas.addEventListener("mousedown", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.currentValue.startX = e.clientX - rect.left;
            this.currentValue.startY = e.clientY - rect.top;

            this.currentValue.endX = this.currentValue.startX;
            this.currentValue.endY = this.currentValue.startY;
            this.currentValue.valueChanged()
            this.#drawRect()
            this.isDrawing = true;
        })
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) return;
            const rect = this.canvas.getBoundingClientRect();
            this.currentValue.endX = e.clientX - rect.left;
            this.currentValue.endY = e.clientY - rect.top;
            this.currentValue.valueChanged()
            this.#drawRect()

        })
        window.addEventListener("mouseup", (e) => {
            if (this.isDrawing) {
                this.#onSetLabel(this.currentValue.getStringValue());
            }
            this.isDrawing = false;
        })

        this.resetButton.addEventListener("click", () => {
            this.#resetRect();
        })

        this.colorPicker.addEventListener("change", (e) => {
            const color = e.target.value;
            this.currentColor = color;
            // redraw
            this.#drawRect();
        })
        this.currentValue.addOnValueChangeListener(() => {
            console.log("value change callback");
            this.resetButton.classList.add("hidden");
            this.helpText.classList.remove("hidden");
            this.coordsText.classList.add("hidden");
            if (this.currentValue.getStringValue() != null) {
                this.resetButton.classList.remove("hidden");
                this.coordsText.classList.remove("hidden");
                this.helpText.classList.add("hidden");

                this.coordsText.textContent = `rect coords: (${this.currentValue.startX}, ${this.currentValue.startY}), (${this.currentValue.endX}, ${this.currentValue.endY})`
            }
        })

        window.addEventListener("resize", () => {
            this.#onResize();
        })
        document.getElementById("root").addEventListener("scroll", () => {
            this.#onResize();
        })
    }

    #onResize() {
        const img = document.getElementById(this.imageId);
        img.onload = () => {
            this.#setCanvasFromImage(img);
            this.#drawRect();
        };
        // If the image is already loaded (cached), trigger the onload handler manually
        if (img.complete) {
            img.onload();
        }
    }

    #onSetLabel(val) {
        if (this.onSelect) {
            this.onSelect(val);
        }
    }
    #resetRect() {
        this.currentValue.setValue(null);
        this.#onSetLabel(null);
        this.#drawRect();
    }
    #drawRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.rect(this.currentValue.startX, this.currentValue.startY,
            this.currentValue.endX - this.currentValue.startX,
            this.currentValue.endY - this.currentValue.startY);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.stroke();
    }
    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }
    #setCanvasFromImage(img) {
        const rect = img.getBoundingClientRect();

        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = `${rect.top + window.scrollY}px`;
        this.canvas.style.left = `${rect.left + window.scrollX}px`;
    }
    #setData(data, answer) {
        this.imageId = data.imageId
        const img = document.getElementById(data.imageId);
        img.classList.add("label-target-image");
        this.currentValue.setValue(answer);
        img.onload = () => {
            this.#setCanvasFromImage(img);
            this.#drawRect();
        };
        // If the image is already loaded (cached), trigger the onload handler manually
        if (img.complete) {
            img.onload();
        }
    }

    setLabels(data, answer, onSelectCallback) {
        this.addOnLoadListener(() => {
            this.#setData(data, answer);
            this.setOnSelectCallback(onSelectCallback);
        });
    }
    setSelectedLabel(label) {
        this.addOnLoadListener(() => {
            this.currentValue.setValue(label);
            this.#drawRect();
        });
    }
}

customElements.define('image-label', ImageLabel);