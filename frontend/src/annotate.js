import { downloadUserResults, getDatasetDataAt, getDatasetName, saveDatasetLabel } from "./requests";
import { getComponentById } from "../components/component.js";
import { redirect, updateUrl, getArg, clamp, clearChildren, getPathParameterAt, setPageTitle } from "./common.js";


let user;
let container;
let currentData;
const snackbar = getComponentById("snackbar");

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

function setContent(title, html) {
    const t = document.querySelector("#data-title");
    t.textContent = title;
    const content = document.querySelector("#data-content");
    content.innerHTML = html;
}

function createLabels(labels, answer, container, onLabelSelected) {
    const comp = document.createElement(labels.component);
    comp.setLabels(labels.data, answer, onLabelSelected);
    container.addOnLoadListener(() => {
        container.setChild(comp);
    });
}

async function fetchDataAt(index) {
    const res = await getDatasetDataAt(user, index);
    if (res) {
        console.log("data at ", index, res);
        currentData = res;

        setContent(res.title, res.html);

        const stepBar = getComponentById("step-bar");
        stepBar.addOnLoadListener(() => {
            stepBar.setItems(res.steps.count, res.steps.completedSteps, index);
            stepBar.setOnSelectCallback(goToIndex);
        });

        const labels = getComponentById("labels");
        createLabels(res.labels, res.answer, labels, onLabelSelected);

        const controls = getComponentById("controls");
        controls.addOnLoadListener(() => {
            const onPrev = index > 0 ? () => goToIndex(index - 1) : null;
            const onNext = index < res.steps.count - 1 ? () => goToIndex(index + 1) : null;
            controls.setCallbacks(onPrev, onNext);
        })

        const unansweredControl = getComponentById("unanswered-controls");
        unansweredControl.addOnLoadListener(() => {
            const onPrev = res.steps.prev ? () => goToIndex(res.steps.prev) : null;
            const onNext = res.steps.next ? () => goToIndex(res.steps.next) : null;
            unansweredControl.setCallbacks(onPrev, onNext);
        })
    }
    else {
        // handle error
        if (index != 0) {
            // redirect to the first question
            redirect(`/annotate/${user}`);
        }
        else {
            redirect('/login');
        }
    }
}

function loadData() {
    const currentIndex = Number(getArg("index")) ? clamp(Number(getArg("index")) - 1, 0) : 0;
    updateUrl(`/annotate/${user}?index=${(currentIndex + 1)}`);
    fetchDataAt(currentIndex);
}

function onDownloadRequested() {
    downloadUserResults(user).then((res) => {
        if (res != null) {
            //alert(`Results available in ${res.path}`);
            snackbar.createSnackbar(res.msg, res.success);
        }
        else {
            //alert(`error when downloading`);
            snackbar.createSnackbar(`an error occurred`, false);
        }
    });
}

function main() {
    user = getPathParameterAt(1);

    if (!user) {
        redirect('/login');
        return;
    }
    const nav = getComponentById("navbar");
    nav.addOnLoadListener(async () => {
        nav.setUser(user);
        const datasetName = await getDatasetName();
        console.log("dataset name", datasetName);
        nav.setTitle(`Annotate ${datasetName}`);
        nav.setOnDownloadListener(onDownloadRequested);
        setPageTitle(`Annotate ${datasetName}`);
    });


    container = getComponentById("content-container")
    container.addOnLoadListener(loadData);
}

main();