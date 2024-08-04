import { getComponentWithId } from "../components/component.js";
import { getArg, getPathParameterAt, redirect } from "./common.js";


const user = getArg("user");

const form = getComponentWithId('user-form-id');

form.addOnLoadListener(setupUserForm)

function login(username) {
    console.log("login: ", username);
    redirect(`/annotate/${username}`);
}

function setupUserForm() {
    if (user) {
        form.setStartingValue(user);
    }
    form.setOnSubmitCallback(login)
}