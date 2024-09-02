import { createDomElement, importCss } from '../../src/common.js';
import { Component } from '../component.js';
const css = "/components/multiTimestampLabel/multiTimestampLabel.css";
const html = "/components/multiTimestampLabel/multiTimestampLabel.html";

class TimestampLabelValue {
    constructor(label, start, end) {
        this.label = label;
        this.start = start;
        this.end = end;
    }
}

class Playbackbutton {

    constructor(parent, onClick) {
        const innerhtml = `
        <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor" class="playback-play">
                <polygon points="0,0 100,50 0,100" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor" class="playback-pause hidden">
                <g stroke="currentColor" stroke-width="20">
                    <line x1="25" y1="0" x2="25" y2="100" />
                    <line x1="75" y1="0" x2="75" y2="100" />
                </g>
            </svg>
        `;
        const btn = createDomElement("button", {
            parent: parent,
            classList: ['time-playback-btn']
        })
        btn.addEventListener("click", () => {
            onClick();
        })
        btn.innerHTML = innerhtml;
    }

    pause() {

    }

    play() {

    }
}

class TimestampLabel {
    constructor(labels, initialValue, parent, onLabelChange, onTimeChange, onDelete, onPlaybackClick, videoDuration) {
        // get value
        this.value = initialValue;
        this.onLabelChange = onLabelChange;
        this.isDraggingStart = false;
        this.isDraggingEnd = false;
        this.leftPercentage = (this.value.start / videoDuration) * 100;
        this.rightPercentage = (this.value.end / videoDuration) * 100;
        this.onTimeChange = onTimeChange;
        this.videoDuration = videoDuration;
        this.onPlaybackClick = onPlaybackClick;

        this.#createUI(parent, labels, this.value.label);
        this.#addBarsListener();
        // label list select
        this.labelsList.addEventListener("change", (event) => {
            // Get the selected value
            const selectedValue = event.target.value;
            this.value.label = selectedValue;
            // call callback
            this.onLabelChange(this.value);
        })
        // delete button click
        this.onDeleteBtn.addEventListener("click", () => {
            onDelete();
            parent.removeChild(this.root);
        })
        this.loopButton.addEventListener("click", () => {
            this.onPlaybackClick();
        })
        // update graphics with current value
        this.#updateGFX();
    }

    #createUI(parent, labels, initialLabel) {
        this.root = createDomElement("div", {
            classList: ["label-timestamp-container"],
            parent: parent
        });
        this.upperContainer = createDomElement("div", {
            classList: ["label-timestamp-upper-container"],
            parent: this.root
        });
        // create delete button
        this.onDeleteBtn = createDomElement("button", {
            parent: this.root,
            textContent: 'Remove',
            classList: ['remove-btn'],
        });

        const root = this.upperContainer;
        this.loopButton = createDomElement("button", {
            parent: root,
            textContent: '⟳',
            classList: ['loop-btn']
        });

        // create label select
        this.labelsList = createDomElement("select", {
            parent: root,
            classList: ['label-select']
        });
        for (let index = 0; index < labels.length; index++) {
            createDomElement("option", {
                parent: this.labelsList,
                classList: ['label-option'],
                attributes: [
                    {
                        name: "value",
                        value: labels[index]
                    }
                ],
                textContent: labels[index]
            });
        }
        this.labelsList.value = initialLabel;
        // create bars
        this.playback = createDomElement("div", { parent: root, classList: ["playback-bar"] });
        this.progressBar = createDomElement("div", {
            parent: this.playback, classList: ["progress-bar"]
        });
        this.handleStart = createDomElement("div", {
            parent: this.playback, classList: ["handle"]
        });
        this.handleEnd = createDomElement("div", {
            parent: this.playback, classList: ["handle"]
        });
    }

    #addBarsListener() {
        // handle functions
        this.handleStart.addEventListener("mousedown", (e) => {
            this.isDraggingStart = true;
        })
        this.handleEnd.addEventListener("mousedown", (e) => {
            this.isDraggingEnd = true;
        })
        const minDistance = 1;
        // playback click
        this.playback.addEventListener('mousedown', (e) => {
            const percent = this.#getPercentage(e.clientX);
            if (percent > this.rightPercentage) {
                this.isDraggingEnd = true;
                this.rightPercentage = percent;
                this.onTimeChange(percent);
                this.#updateGFX();
            }
            else if (percent < this.leftPercentage) {
                this.isDraggingStart = true;
                this.leftPercentage = percent;
                this.onTimeChange(percent);
                this.#updateGFX();
            }
            else {
                // click on progress bar
                // update video time with the start
                //this.onTimeChange(this.leftPercentage);
            }
        });
        // Drag the handle
        document.addEventListener('mousemove', (e) => {
            if (this.isDraggingStart) {
                let percent = this.#getPercentage(e.clientX);

                if (percent > this.rightPercentage - minDistance) {
                    percent = this.rightPercentage - minDistance;
                }

                this.leftPercentage = percent;

                this.#updateGFX();
                //onTimeChange(percent);
            }

            if (this.isDraggingEnd) {
                let percent = this.#getPercentage(e.clientX);

                if (percent < this.leftPercentage + minDistance) {
                    percent = this.leftPercentage + minDistance;
                }

                this.rightPercentage = percent;

                this.#updateGFX();
                //onTimeChange(percent);
            }
        });

        // Stop dragging
        document.addEventListener('mouseup', () => {
            this.#stopDrag();
        });

        document.addEventListener('dragstart', () => {
            this.#stopDrag();
        })
    }
    #stopDrag() {
        if (this.isDraggingStart) {
            this.onTimeChange(this.leftPercentage);
        }
        else if (this.isDraggingEnd) {
            this.onTimeChange(this.rightPercentage);
        }
        else if (!this.isDraggingEnd && !this.isDraggingStart) {
            // not started from this
            return;
        }
        this.isDraggingStart = false;
        this.isDraggingEnd = false;
        this.value.start = this.leftPercentage / 100 * this.videoDuration;
        this.value.end = this.rightPercentage / 100 * this.videoDuration;
        // update values
        this.onLabelChange(this.value);
    }
    #getPercentage(clientX) {
        const rect = this.playback.getBoundingClientRect();
        let offsetX = clientX - rect.left;

        if (offsetX < 0) {
            offsetX = 0;
        } else if (offsetX > this.playback.clientWidth) {
            offsetX = this.playback.clientWidth;
        }
        return (offsetX / this.playback.clientWidth) * 100;
    }
    #updateGFX() {
        this.handleEnd.style.left = this.rightPercentage + '%';
        this.handleStart.style.left = this.leftPercentage + '%';

        this.progressBar.style.left = this.leftPercentage + '%';
        this.progressBar.style.width = 100 - this.leftPercentage - (100 - this.rightPercentage) + '%';
    }

    getValue() {
        return this.value;
    }

    setPlayback(value) {
        this.loopButton.classList.remove('active');
        this.progressBar.classList.remove('active');
        this.handleStart.classList.remove('active');
        this.handleEnd.classList.remove('active');
        if (value) {
            this.loopButton.classList.add('active');
            this.progressBar.classList.add('active');
            this.handleStart.classList.add('active');
            this.handleEnd.classList.add('active');
        }
    }

}

export class MultiTimestampLabel extends HTMLElement {
    constructor() {
        super();
        importCss(css);
        this.currentIndex = 0;
        this.timestamps = new Map();
        this.values = new Map();
        this.activeIndex = null;
    }

    connectedCallback() {
        this.container = createDomElement("div", {
            parent: this,
            classList: ['scrollable-container']
        });
        this.buttonContainer = createDomElement("div", {
            parent: this
        });
        this.buttonContainer.style.display = 'flex';
        this.buttonContainer.style.flexDirection = 'column';
        this.buttonContainer.style.alignItems = 'center';
        // add a button to create new items
        const button = createDomElement("button", {
            classList: ['create-label-btn'],
            parent: this.buttonContainer,
            textContent: 'Add new'
        });
        button.addEventListener("click", () => {
            // add new
            this.#addTimestamp(this.labels);
        });
    }

    #updateVideoTime(percent) {
        if (this.video) {
            this.video.currentTime = (percent / 100) * this.video.duration
        }
    }

    #saveLabel() {
        // save value
        // create an array from the map
        if (this.timestamps.size == 0) {
            this.onSelect(JSON.stringify(null));
            return;
        }
        const vec = []
        this.timestamps.forEach((v) => {
            vec.push(v.getValue());
        });

        if (this.onSelect) {
            this.onSelect(JSON.stringify(vec));
        }

    }

    #addTimestamp(labels, initialValue = null) {
        const index = this.currentIndex;
        const initialLabel = labels[0];
        let value = initialValue;
        if (initialValue == null) {
            value = new TimestampLabelValue(initialLabel, 0, this.video.duration);
        }
        this.timestamps.set(this.currentIndex, new TimestampLabel(
            labels,
            value,
            this.container,
            // on label change
            (val) => {
                this.#saveLabel()
            },

            // on time change
            (percent) => {
                // if this is active
                if (this.activeIndex == index) {
                    this.#updateVideoTime(percent);
                }
            },

            // on delete
            () => {
                // set this active
                //this.activeIndex = index;
                this.timestamps.delete(index);
                if (this.activeIndex == index) {
                    this.activeIndex = null;
                }
                // save label this one was deleted
                this.#saveLabel();
            },
            // on playback click
            () => {

                if (this.activeIndex != null) {
                    // deactivate porevious one
                    const l = this.timestamps.get(this.activeIndex);
                    l.setPlayback(false);
                }
                if (this.activeIndex == index) {
                    this.activeIndex = null;
                }
                else {
                    // activate this one
                    this.activeIndex = index;
                    const l = this.timestamps.get(this.activeIndex);
                    l.setPlayback(true);
                }

            },
            // video duration
            this.video.duration,
        ));
        this.currentIndex++;
        // save label a new one was added
        this.#saveLabel();
    }

    #onPlayUpdate() {
        if (this.activeIndex != null) {
            // get the timestamp
            const label = this.timestamps.get(this.activeIndex).getValue();
            if (this.video) {
                if (this.video.currentTime > label.end || this.video.currentTime < label.start - 0.1) {
                    this.video.currentTime = label.start;
                }
            }
        }
    }

    #parseAnswer(answer) {
        const ans = JSON.parse(answer);
        if (ans) {
            ans.forEach(answer => {
                this.#addTimestamp(this.labels, new TimestampLabelValue(answer.label, answer.start, answer.end));
            })
        }
    }

    #setData(data, answer) {
        this.mediaId = data.mediaId;

        this.video = document.getElementById(this.mediaId);
        this.labels = data.labels;
        // Use 'loadedmetadata' event to ensure duration is available
        this.video.addEventListener('loadedmetadata', () => {
            // Now the video.duration should be properly loaded and available
            //this.#addTimestamp(data.labels, data.labels[0]);
            this.#parseAnswer(answer);
        });
        this.video.addEventListener("timeupdate", () => {
            this.#onPlayUpdate();
        })
        // Trigger the event handler if metadata is already loaded
        if (this.video.readyState >= 1) { // 'readyState' >= 1 means metadata is available
            // Manually invoke the 'loadedmetadata' event handler
            this.video.dispatchEvent(new Event('loadedmetadata'));
        }

    }

    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }
    setLabels(data, answer, onSelectCallback) {
        this.#setData(data, answer);
        this.setOnSelectCallback(onSelectCallback);
    }
    setSelectedLabel(label) {
        this.currentValue.setAnswer(label);
    }
}

customElements.define('multi-timestamp-label', MultiTimestampLabel);