import { getComponentWithId as getComponentById } from "../components/component.js";
import { TableData, AnswerData } from "../components/compareTable/compareTable.js";
import { getCompareResults, getDatasetName } from "./requests.js";
import { getArg, redirect, updateUrl } from "./common.js";


function onPageChange(page) {
    updateUrl(`/compare?page=${page}`);
}

function onElementClick(id) {
    console.log("Clicked ", id);
    redirect(`compare/${id}`);
}

const currentPage = getArg("page") ? Number(getArg("page")) : 1;
async function main() {

    const res = await getCompareResults();
    console.log(res);
    const compareTable = getComponentById("compare");
    let compareData = [];
    for (let index = 0; index < 2; index++) {
        compareData.push(new TableData("ans " + String(index), [new AnswerData("label1", 0.2), new AnswerData("label2", 0.5), new AnswerData("label3", 0.3)]))
        updateUrl(`/compare?page=${currentPage}`);
    }

    compareTable.addOnLoadListener(() => {
        compareTable.setData(res.answers, onElementClick, currentPage);
        compareTable.setOnPageChangeListener(onPageChange);
    })
    const title = document.getElementById("dataset-title");
    const name = await getDatasetName();
    title.textContent = name;
}

main();
