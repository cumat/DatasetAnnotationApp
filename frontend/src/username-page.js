import { getComponentById } from "../components/component.js";

// get the username form
const userForm = getComponentById("user-form-id");

userForm.addOnLoadListener(() => userForm.setOnSubmitCallback(onSubmit));

function onSubmit(value) {
    console.log("submitted value", value);
}