import { clearChildren, createDomElement } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/multiImageLabel/multiImageLabel.css";
const html = "/components/multiImageLabel/multiImageLabel.html";


class RectValue {
    constructor(startX = 0, startY = 0, endX = 0, endY = 0, label = null) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.label = label;
        this.callbacks = [];
    }

    isEmpty() {
        return this.startX == this.endX && this.startY == this.endY;
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
                this.label = answer.label;
            }
            else {
                this.startX = 0;
                this.startY = 0;
                this.endX = 0;
                this.endY = 0;
                this.label = null;
            }
        }
        this.callbacks.forEach(c => {
            c();
        })
    }
    getStringValue() {
        if (this.startX == this.endX && this.startY == this.endY && label != null) {
            return null;
        }
        else {
            return JSON.stringify({
                'startX': this.startX,
                'startY': this.startY,
                'endX': this.endX,
                'endY': this.endY,
                'label': this.label
            });
        }
    }
}

class RectController {
    constructor(index, parent, labels, initialLabel, onDelete, onHoverEnter, onHoverExit, onLabelChange) {
        const container = createDomElement("div", {
            classList: ['rect-ctrl-container'],
            parent: parent,
        });
        const title = createDomElement("span", {
            parent: container,
            textContent: `#${index}`
        });
        const labelsList = createDomElement("select", {
            parent: container,
        });
        for (let index = 0; index < labels.length; index++) {
            createDomElement("option", {
                parent: labelsList,
                attributes: [
                    {
                        name: "value",
                        value: labels[index]
                    }
                ],
                textContent: labels[index]
            });
        }
        labelsList.value = initialLabel;
        labelsList.addEventListener("change", (event) => {
            // Get the selected value
            const selectedValue = event.target.value;
            // call callback
            onLabelChange(selectedValue);
        })
        const deleteBtn = createDomElement("button", {
            parent: container,
            classList: ['del-btn'],
            textContent: `Delete`
        });
        deleteBtn.addEventListener("click", () => {
            // call the on delete callback
            onDelete();
            // remove itself
            parent.removeChild(container);
        });

        container.addEventListener("mouseenter", () => {
            // highlight the rect
            onHoverEnter();
        });

        container.addEventListener("mouseleave", () => {
            // highlight the rect
            onHoverExit();
        });
    }
}

export class MultiImageLabel extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.canvas = node.querySelector(".img-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.controllerContainer = node.querySelector(".controller-container");
        this.rects = new Map();
        this.rectsController = [];
        this.currentRectValue = null;
        this.hoverRectIndex = null;
        this.colorPicker = node.querySelector(".color-picker");
        this.currentColor = this.colorPicker.value;
        this.labels = [];
        this.currentIndex = 0;
        // add canvas draw events
        this.canvas.addEventListener("mousedown", (e) => {
            this.isDrawing = true;
            this.#onDrawStart(e);
            this.#draw();
        })
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) {
                this.#onCanvasMouseMove(e)
            }
            else {
                this.#onDrawUpdate(e);
            }
            this.#draw();

        })
        window.addEventListener("mouseup", (e) => {
            if (!this.isDrawing) return;
            this.#onDrawEnd();
            this.#draw();

            this.isDrawing = false;
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
        if (img) {
            img.onload = () => {
                this.#setCanvasFromImage(img);
                this.#draw();
            };
            // If the image is already loaded (cached), trigger the onload handler manually
            if (img.complete) {
                img.onload();
            }
        }
    }
    #onDrawStart(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.currentIndex++;
        this.rects.set(this.currentIndex, new RectValue(x, y, x, y, this.labels[0]));
        this.currentRectValue = this.rects.get(this.currentIndex);
    }

    #onDrawUpdate(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.currentRectValue = this.rects.get(this.currentIndex);
        // change the end vector
        this.currentRectValue.endX = e.clientX - rect.left;
        this.currentRectValue.endY = e.clientY - rect.top;
    }
    #addRectController(label = null) {
        const curr = this.currentIndex;
        if (label == null) {
            label = this.labels[0];
        }
        // add the controller
        this.rectsController.push(new RectController(this.currentIndex, this.controllerContainer, this.labels, label,
            // on delete
            () => {
                // delete the rect
                this.rects.delete(curr);
                // redraw to update the ui
                this.#draw();
                // save
                this.#saveAnswers()
            },
            // on hover enter
            () => {
                this.hoverRectIndex = curr;
                // redraw to update the ui
                this.#draw();
            },
            // on hover exit
            () => {
                this.hoverRectIndex = null;
                // redraw to update the ui
                this.#draw();
            },
            // on label change
            (label) => {
                this.rects.get(curr).label = label;
                // redraw to update the ui
                this.#draw();
                // save
                this.#saveAnswers()
            }
        ));
    }
    #onDrawEnd() {
        // save rect
        if (this.currentRectValue.isEmpty()) {
            // pop the value
            this.rects.delete(this.currentIndex);
            this.currentIndex--;
        }
        else {
            this.#addRectController();
            // save
            this.#saveAnswers()

        }
        // delete current rect
        this.currentRectValue = null;
    }

    #onCanvasMouseMove(event) {
    }

    #draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.rects.forEach((element, index) => {
            // Calculate the top-left corner of the rectangle
            const topLeftX = Math.min(element.startX, element.endX);
            const topLeftY = Math.min(element.startY, element.endY);

            // Calculate the width and height of the rectangle
            const width = Math.abs(element.endX - element.startX);
            const height = Math.abs(element.endY - element.startY);

            this.ctx.beginPath();
            if (this.hoverRectIndex == index) {
                // Set the fill style to the RGBA color
                this.ctx.fillStyle = `${this.currentColor}80`; // 80 is the hex code for 50% opacity
                // Fill the rectangle with the semi-transparent color
                this.ctx.fillRect(topLeftX, topLeftY, width, height);
            }
            // Draw the rectangle
            this.ctx.rect(topLeftX, topLeftY, width, height);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.stroke();

            // Draw the text label at the top-left corner
            this.ctx.font = "16px Arial"; // Set font size and font family
            this.ctx.fillStyle = this.currentColor; // Set text color (same as stroke color)
            this.ctx.textBaseline = "bottom"; // Align text baseline to the bottom of the text
            this.ctx.fillText(`#${index}-${element.label}`, topLeftX + 5, topLeftY - 2); // Draw text at the top-left corner
        })

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
        // redraw
        this.#draw();
    }

    #parseAnswer(answer) {
        // set answers
        const ans = JSON.parse(answer);
        if (ans) {
            ans.forEach(answer => {
                this.currentIndex++;
                this.rects.set(this.currentIndex, answer);
                this.#addRectController(answer.label);
            })
            this.#draw();
        }
    }

    #setData(data, answer) {
        this.#clear();

        this.imageId = data.imageId;
        this.labels = data.labels;

        this.#parseAnswer(answer);

        const img = document.getElementById(data.imageId);
        img.classList.add("label-target-image");
        img.onload = () => {
            this.#setCanvasFromImage(img);
        };
        // If the image is already loaded (cached), trigger the onload handler manually
        if (img.complete) {
            img.onload();
        }
    }
    #clear() {
        this.currentIndex = 0;
        clearChildren(this.controllerContainer);
        this.rects.clear();
    }
    #saveAnswers() {
        const answers = [];
        this.rects.forEach(rect => {
            answers.push(rect);
        })
        const answersJson = JSON.stringify(answers);

        if (this.onSelect) {
            this.onSelect(answersJson);
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
            // clear
            this.#clear();
            this.#parseAnswer(label);
        });
    }
}

customElements.define('multi-image-label', MultiImageLabel);