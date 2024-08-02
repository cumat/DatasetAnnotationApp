import { getDatasetDataAt } from "./requests";
import { getComponentWithId } from "../components/component.js";
import { redirect, updateUrl, getArg, clamp, clearChildren } from "./common.js";


const container = getComponentWithId("content-container")
container.addOnLoadListener(loadData);



function onStepSelected(stepIndex) {
    const currentIndex = Number(getArg("index")) ? clamp(Number(getArg("index")) - 1, 0) : 0;
    console.log("step selected: ", stepIndex);
    const index = Number(stepIndex);
    if (currentIndex != index) {
        updateUrl(`/annotate?index=${(index + 1)}`);
        fetchDataAt(index);
    }
}

function onLabelSelected(label) {
    console.log("selected label: ", label);
}

async function fetchDataAt(index) {
    const res = await getDatasetDataAt(index);
    if (res) {
        console.log("data at ", index, res);
        const title = document.querySelector("#data-title");
        title.textContent = res.title;
        const content = document.querySelector("#data-content");
        content.innerHTML = res.html;
        const comp = document.createElement(res.labels.component);
        comp.addOnLoadListener(() => {
            comp.setData(res.labels.data, "label3");
            comp.setOnSelectCallback(onLabelSelected);
        })
        const stepBar = getComponentWithId("step-bar");
        stepBar.addOnLoadListener(() => {
            stepBar.setItems(res.steps.count, res.steps.completed, index);
            stepBar.setOnSelectCallback(onStepSelected);
        });

        const labels = getComponentWithId("labels");
        labels.addOnLoadListener(() => {
            labels.setChild(comp);
        });

        const controls = getComponentWithId("controls");
        controls.addOnLoadListener(() => {
            const onPrev = index > 0 ? () => fetchDataAt(index - 1) : null;
            const onNext = index < res.steps.count - 1 ? () => fetchDataAt(index + 1) : null;
            controls.setCallbacks(onPrev, onNext);
        })
    }
    else {
        // handle error
        //redirect('/')
    }
}

function loadData() {
    const currentIndex = Number(getArg("index")) ? clamp(Number(getArg("index")) - 1, 0) : 0;
    updateUrl(`/annotate?index=${(currentIndex + 1)}`);
    fetchDataAt(currentIndex);
}