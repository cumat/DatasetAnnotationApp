import { getComponentById } from "../components/component";
import { getArg, getPathParameterAt, setPageTitle } from "./common";
import { getCompareAt, getDatasetName, saveDatasetFix } from "./requests";


const id = getPathParameterAt(1);

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
    return comp;
}

function onLabelSelected(label) {
    saveDatasetFix(id, label);
}

async function main() {
    const res = await getCompareAt(id);
    console.log(res);

    const nav = getComponentById("navbar");
    nav.addOnLoadListener(async () => {
        const datasetName = await getDatasetName();
        nav.setTitle(`Compare ${datasetName}`);
        setPageTitle(`Compare ${res.title}`);
    });

    setContent(res.title, res.html);

    const labelsContainer = getComponentById("labels");
    const labels = createLabels(res.labels, res.fix, labelsContainer, onLabelSelected);


    const answers = document.getElementById("answers");
    answers.setData(res.answers, (label) => {
        labels.setSelectedLabel(label);
        onLabelSelected(label);
    });
}

main();