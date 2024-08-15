import { getDatasetName } from "./requests";

async function main() {
    const nameElement = document.getElementById("dataset-name");
    const name = await getDatasetName();
    nameElement.textContent = name;
}

main();
