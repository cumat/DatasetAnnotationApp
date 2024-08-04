import { getDatasetDataAt, getDatasetName, saveDatasetLabel } from "./requests";
import { getComponentWithId } from "../components/component.js";
import { redirect, updateUrl, getArg, clamp, clearChildren, getPathParameterAt, setPageTitle } from "./common.js";


let user;
let container;
let currentData;
function goToIndex(stepIndex) {
    const currentIndex = Number(getArg("index")) ? clamp(Number(getArg("index")) - 1, 0) : 0;
    console.log("step selected: ", stepIndex);
    const index = Number(stepIndex);
    if (currentIndex != index) {
        updateUrl(`/annotate/${user}?index=${(index + 1)}`);
        fetchDataAt(index);
    }
}

function onLabelSelected(label) {
    console.log("selected label: ", label);
    if (currentData) {
        saveDatasetLabel(user, currentData.id, label);
    }
    else {
        console.error("currentData is null");
    }
}

async function fetchDataAt(index) {
    const res = await getDatasetDataAt(user, index);
    if (res) {
        console.log("data at ", index, res);
        currentData = res;
        const title = document.querySelector("#data-title");
        title.textContent = res.title;
        const content = document.querySelector("#data-content");
        content.innerHTML = res.html;
        const comp = document.createElement(res.labels.component);
        comp.addOnLoadListener(() => {
            comp.setData(res.labels.data, res.answer);
            comp.setOnSelectCallback(onLabelSelected);
        })
        const stepBar = getComponentWithId("step-bar");
        stepBar.addOnLoadListener(() => {
            stepBar.setItems(res.steps.count, res.steps.completedSteps, index);
            stepBar.setOnSelectCallback(goToIndex);
        });

        const labels = getComponentWithId("labels");
        labels.addOnLoadListener(() => {
            labels.setChild(comp);
        });

        const controls = getComponentWithId("controls");
        controls.addOnLoadListener(() => {
            const onPrev = index > 0 ? () => goToIndex(index - 1) : null;
            const onNext = index < res.steps.count - 1 ? () => goToIndex(index + 1) : null;
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
    updateUrl(`/annotate/${user}?index=${(currentIndex + 1)}`);
    fetchDataAt(currentIndex);
}

function main() {
    user = getPathParameterAt(1);

    if (!user) {
        redirect('/login');
        return;
    }
    const nav = getComponentWithId("navbar");
    nav.addOnLoadListener(async () => {
        nav.setUser(user);
        const datasetName = await getDatasetName();
        console.log("dataset name", datasetName);
        nav.setTitle(`Annotate ${datasetName}`);
        setPageTitle(`Annotate ${datasetName}`);
    });

    container = getComponentWithId("content-container")
    container.addOnLoadListener(loadData);
}

main();