// Function validate name
export let validName = (a) => {
  let pattern = /[a-zA-Z]{1,}/;
  if (!pattern.test(a)) {
    return true;
  } else {
    return false;
  }
};
// Function validate the input data
export let checkInput = (obj) => {
  if (obj.val().trim() == "" || parseInt(obj.val()) <= 0) {
    return true; //validate that input the empty string or only space key
  }
  return false;
};
export let validEmail = (email) => {
  let emailPattern = /^[a-zA-Z0-9\._]+@[a-z]+(\.[a-z]+)+$/;
  if (!emailPattern.test(email)) {
    return true;
  } else return false;
};
export let validPhone = (phone) => {
  let phonePattern = /^[\d]{10,11}$/;
  if (!phonePattern.test(phone)) {
    return true;
  } else return false;
};
