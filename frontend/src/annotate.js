import { getDatasetDataAt } from "./requests";
import { getComponentWithId } from "../components/component.js";


const container = getComponentWithId("content-container")
container.addOnLoadListener(loadData);


async function loadData() {
    const currentIndex = 0;
    const res = await getDatasetDataAt(currentIndex);
    console.log("data at 0", res);
    const title = document.querySelector("#data-title");
    title.textContent = res.title;
    const content = document.querySelector("#data-content");
    content.innerHTML = res.html;
    const comp = document.createElement(res.labels.component);
    comp.addOnLoadListener(() => {
        comp.setData(res.labels.data);
    })
    const stepBar = getComponentWithId("step-bar");
    stepBar.addOnLoadListener(() => {
        stepBar.setItems(res.steps.count, res.steps.completed, currentIndex);
    });

    const labels = getComponentWithId("labels");
    labels.addOnLoadListener(() => {
        labels.addChild(comp);
    });
    //document.body.appendChild(comp);
}