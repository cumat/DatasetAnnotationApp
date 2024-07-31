import { getComponentWithId } from "../components/component.js";

// get the username form
const userForm = getComponentWithId("user-form-id");

userForm.addOnLoadListener(() => userForm.setOnSubmitCallback(onSubmit));

function onSubmit(value) {
    console.log("submitted value", value);
}