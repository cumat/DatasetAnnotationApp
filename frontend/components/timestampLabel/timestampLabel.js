import { Component } from '../component.js';
const css = "/components/timestampLabel/timestampLabel.css";
const html = "/components/timestampLabel/timestampLabel.html";

class TimestampLabelValue {
    constructor() {
        this.start = null;
        this.end = null;
    }

    setStartValue(value) {
        this.start = Number(value.toFixed(2));
        if (this.end == null || this.start > this.end) {
            this.end = this.start
        }
    }

    setEndValue(value) {
        this.end = Number(value.toFixed(2));
        if (this.start == null || this.start > this.end) {
            this.start = 0.0;
        }
    }

    setAnswer(strAnswer) {
        let answer = null;
        try {
            answer = JSON.parse(strAnswer);
        }
        catch {
            answer = null;
        }
        if (answer) {
            this.start = answer.start.toFixed(2);
            this.end = answer.end.toFixed(2);
        }
        else {
            this.reset();
        }
    }

    hasValue() {
        return this.start != null && this.end != null;
    }

    reset() {
        this.start = this.end = null;
    }

    getStringValue() {
        if (this.start == null || this.end == null) {
            return null;
        }
        else {
            return JSON.stringify(
                {
                    'start': Number(this.start),
                    'end': Number(this.end)
                }
            );
        }
    }
}

export class TimestampLabel extends Component {
    constructor() {
        super(html, css);
    }
    setupHtml(node, attributes) {
        this.startTimeButton = node.querySelector(".start");
        this.endTimeButton = node.querySelector(".end");
        this.resetButton = node.querySelector(".reset");
        this.playButton = node.querySelector(".playback");
        this.plabackPlayIcon = node.querySelector(".playback-play");
        this.plabackPauseIcon = node.querySelector(".playback-pause");

        this.isPlaying = false;
        this.resetButton.addEventListener("click", () => {
            this.#reset();
            if (this.isPlaying) {
                this.#togglePlayback();
                const vid = document.getElementById(this.mediaId);
                vid.pause();
            }
        });
        this.startTimeButton.addEventListener("click", () => {
            if (this.mediaId && !this.isPlaying) {
                const media = document.getElementById(this.mediaId);
                this.currentValue.setStartValue(media.currentTime);
                this.#updateGfx();
                this.#onSetLabel();
            }
        });
        this.endTimeButton.addEventListener("click", () => {
            if (this.mediaId && !this.isPlaying) {
                const media = document.getElementById(this.mediaId);
                this.currentValue.setEndValue(media.currentTime);
                this.#updateGfx();
                this.#onSetLabel();
            }
        });
        this.playButton.addEventListener("click", () => {
            this.#togglePlayback();
        })
        this.currentValue = new TimestampLabelValue();
        this.mediaId = null;
        this.#updateGfx();
    }
    #togglePlayback() {
        this.plabackPlayIcon.classList.add("hidden");
        this.plabackPauseIcon.classList.add("hidden");
        this.startTimeButton.classList.add("disabled");
        this.endTimeButton.classList.add("disabled");


        if (this.currentValue.hasValue() == false) {
            this.isPlaying = false;
            const vid = document.getElementById(this.mediaId)
            vid.setAttribute("controls", "controls");
            this.plabackPlayIcon.classList.remove("hidden");
            this.startTimeButton.classList.remove("disabled");
            this.endTimeButton.classList.remove("disabled");
            return;
        }
        this.isPlaying = !this.isPlaying;
        const vid = document.getElementById(this.mediaId)
        vid.currentTime = this.currentValue.start;
        if (this.isPlaying) {
            vid.removeAttribute("controls");
            this.plabackPauseIcon.classList.remove("hidden");
        }
        else {
            vid.setAttribute("controls", "controls");
            this.plabackPlayIcon.classList.remove("hidden");
            this.startTimeButton.classList.remove("disabled");
            this.endTimeButton.classList.remove("disabled");
        }
        if (this.isPlaying) {
            vid.play();
        }
        else {
            vid.pause();
        }
    }
    #onSetLabel() {
        if (this.onSelect) {
            this.onSelect(this.currentValue.getStringValue());
        }
    }

    #updateGfx() {
        if (!this.currentValue.hasValue()) {
            this.startTimeButton.textContent = `Click to set start time`;
            this.endTimeButton.textContent = `Click to set end time`;
        }
        else {
            this.startTimeButton.textContent = `Start time: ${this.currentValue.start}`;
            this.endTimeButton.textContent = `End time: ${this.currentValue.end}`;
        }

    }
    #reset() {
        this.currentValue.reset();
        this.#updateGfx();
        this.#onSetLabel();
    }
    #setData(data, answer) {
        this.mediaId = data.mediaId;
        this.currentValue.setAnswer(answer);
        this.#updateGfx();
        const vid = document.getElementById(this.mediaId)
        vid.addEventListener("timeupdate", () => {
            if (this.currentValue.hasValue() && this.isPlaying) {
                if (vid.currentTime > this.currentValue.end) {
                    vid.currentTime = this.currentValue.start;
                    //vid.play();
                }
            }
        })
    }

    setOnSelectCallback(callback) {
        this.onSelect = callback;
    }
    setLabels(data, answer, onSelectCallback) {
        this.addOnLoadListener(() => {
            this.#setData(data, answer);
            this.setOnSelectCallback(onSelectCallback);
        });
    }
    setSelectedLabel(label) {
        this.addOnLoadListener(() => {
            this.currentValue.setAnswer(label);
            this.#updateGfx();
        });
    }
}

customElements.define('timestamp-label', TimestampLabel);