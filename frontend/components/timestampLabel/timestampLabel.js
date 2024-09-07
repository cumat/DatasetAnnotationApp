import { clearChildren, createDomElement, importCss } from '../../src/common.js';
const css = "/components/timestampLabel/timestampLabel.css";

class TimestampLabelValue {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

class TimestampLabelUI {
    constructor(initialValue, onLabelChange, onTimeChange, onPlaybackClick, videoDuration) {
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

        this.#createUI();
        this.#addBarsListener();
        this.loopButton.addEventListener("click", () => {
            this.onPlaybackClick();
        })
        // update graphics with current value
        this.#updateGFX();
    }

    getRoot() {
        return this.root;
    }

    #createUI() {
        this.root = createDomElement("div", {
            classList: ["single-label-timestamp-container"],
        });
        this.upperContainer = createDomElement("div", {
            classList: ["label-timestamp-upper-container"],
            parent: this.root
        });
        const root = this.upperContainer;
        this.loopButton = createDomElement("button", {
            parent: root,
            textContent: '⟳',
            classList: ['loop-btn']
        });
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

export class TimestampLabel extends HTMLElement {
    constructor() {
        super();
        this.hasValue = false;
        this.isActive = false;
        this.timestamp = null;
        this.container = createDomElement("div", {});
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.createDelBtn = createDomElement("button", {
            parent: this.container,
            classList: ['create-delete-btn']
        });
        this.createDelBtn.addEventListener('click', () => {
            this.#onCreateClick();
        });
        importCss(css);
    }
    connectedCallback() {
        clearChildren(this);
        this.appendChild(this.container);
    }

    #onCreateClick() {
        if (this.hasValue) {
            this.#clear();
        }
        else {
            this.#createTimestamp(new TimestampLabelValue(0, this.video.duration));
        }
        this.#saveLabel();
        this.#updateButtonUI();
    }
    #saveLabel() {
        if (this.timestamp != null) {
            this.onSelect(JSON.stringify(this.timestamp.getValue()));
        }
        else {
            this.onSelect(null);
        }
    }
    #createTimestamp(initialValue) {
        // create a timestamp
        this.timestamp = new TimestampLabelUI(initialValue,
            // on label change
            (val) => {
                this.#saveLabel()
            },
            // on time change
            (percent) => {
                // if this is active
                if (this.isActive) {
                    this.#updateVideoTime(percent);
                }
            },
            // on playback click
            () => {
                this.isActive = !this.isActive;
                this.timestamp.setPlayback(this.isActive);
            },
            // video duration
            this.video.duration,
        );
        // add to dom
        this.container.insertBefore(this.timestamp.getRoot(), this.container.firstChild);
        //this.container.appendChild(this.timestamp.getRoot());
        // set has value to true
        this.hasValue = true;
        this.isActive = false;
    }
    #clear() {
        clearChildren(this.container);
        this.container.appendChild(this.createDelBtn);
        this.timestamp = null;
        this.hasValue = false;
        this.isActive = false;
        this.#updateButtonUI();
    }
    #updateVideoTime(percent) {
        if (this.video) {
            this.video.currentTime = (percent / 100) * this.video.duration
        }
    }

    #parseAnswer(strAnswer) {
        let answer = null;
        try {
            answer = JSON.parse(strAnswer);
        }
        catch {
            answer = null;
        }
        if (answer) {
            this.#createTimestamp(answer);
        }
        else {
            this.hasValue = false;
        }
        this.#updateButtonUI();
    }

    #updateButtonUI() {
        if (this.hasValue) {
            this.createDelBtn.textContent = 'delete';
        }
        else {
            this.createDelBtn.textContent = 'create';
        }
    }

    #onPlayUpdate() {
        if (this.isActive) {
            const label = this.timestamp.getValue();
            if (this.video) {
                if (this.video.currentTime > label.end || this.video.currentTime < label.start - 0.1) {
                    this.video.currentTime = label.start;
                }
            }
        }
    }
    #setData(data, answer) {
        this.#clear();
        this.mediaId = data.mediaId;

        this.video = document.getElementById(this.mediaId);
        this.video.addEventListener('loadedmetadata', () => {
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
        this.#clear();
        this.#parseAnswer(answer);
    }
}

customElements.define('timestamp-label', TimestampLabel);