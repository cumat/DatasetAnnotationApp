import { getComponentWithId as getComponentById } from "../components/component.js";
import { TableData, AnswerData } from "../components/compareTable/compareTable.js";
import { getAgreementText, getCompareResults, getDatasetName } from "./requests.js";
import { getArg, redirect, updateUrl } from "./common.js";
import { UNANSWERED, CONFLICT, FIXES } from "../components/compareTableFilters/compareTableFilters.js";


const compareTable = getComponentById("compare");
const filters = getComponentById("filters");
let res = null;
let currentPage = getArg("page") ? Number(getArg("page")) : 1;
let currentFilter = getArg("filter") ? getArg("filter") : null;
const agreementText = document.getElementById("agreement");

async function setAgreementText() {
    const agreement = await getAgreementText()
    if (agreement) {
        agreementText.textContent = agreement.agreement;
        agreementText.setAttribute("title", agreement.details);
    }
}

function updateURL() {
    if (currentFilter) {
        updateUrl(`/compare?page=${currentPage}&filter=${currentFilter}`);
    }
    else {
        updateUrl(`/compare?page=${currentPage}`);
    }
}

function onPageChange(page) {
    currentPage = page;
    updateURL();
}

function onElementClick(id) {
    redirect(`compare/${id}`);
}

function onFilterSelected(filter) {
    currentFilter = filter;
    showWithFilter(filter);
    updateURL();
}

function filterRes(filter, res) {
    if (filter == null) {
        return res.answers;
    }
    const answers = [];
    res.answers.forEach(answer => {
        if (filter == FIXES) {
            if (answer.fix) {
                answers.push(answer);
            }
        }
        else if (filter == UNANSWERED) {
            if (answer.labels.length == 0) {
                answers.push(answer);
            }
        }
        else if (filter == CONFLICT) {
            if (answer.labels.length > 1 && !answer.fix) {
                answers.push(answer);
            }
        }

        else {
            answers.push(answer);
        }
    });
    return answers;
}

function showWithFilter(filter) {
    if (res) {
        filters.addOnLoadListener(() => {
            filters.setSelectedFilter(filter);
        });
        const answers = filterRes(filter, res);
        compareTable.addOnLoadListener(() => {
            compareTable.setData(answers, onElementClick, currentPage);
            compareTable.setOnPageChangeListener(onPageChange);
        });
    }
}

async function main() {

    res = await getCompareResults();
    console.log(res);
    let fixes = false;
    let unanswered = false;
    let conflict = false;
    // check
    res.answers.forEach(answer => {
        if (answer.fix) {
            fixes = true;
        }

        if (answer.labels.length > 1) {
            conflict = true;
        }
        if (answer.labels.length == 0) {
            unanswered = true;
        }
    });

    filters.addOnLoadListener(() => {
        filters.setData(onFilterSelected, unanswered, fixes, conflict);
    })
    const title = document.getElementById("dataset-title");
    const name = await getDatasetName();
    title.textContent = name;
    setAgreementText();
    showWithFilter(currentFilter);
}

main();

window.addEventListener('pageshow', main);