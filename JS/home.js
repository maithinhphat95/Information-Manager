import { validName, validEmail, checkInput, validPhone } from "./common.js";
// Init the array of user list
let userList = [];

// Constructor function of user objects
let User = function (name, email, phone, pass, level) {
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.pass = pass;
  this.level = level;
  this.login = false;
};
// -------------------Register--------------------------------
// Save array the local storage
let saveArray = (arr) => {
  // Conver object customer to JSON string and save to sessionStorage
  localStorage.setItem(10, JSON.stringify(arr));
};
// Save user to array
let storeUser = (name, email, phone, pass, level, arr) => {
  // Make an object for each customer
  let user = new User(name, email, phone, pass, level);
  // Push new customer to customer list
  arr.push(user);
  saveArray(arr);
};
// Function validate data
let validData = (name, email, phone, pass) => {
  let check = true;
  // Validate name
  if (checkInput(name) || validName(name.val())) {
    name.next().text("Please input name with letters");
    check = false;
    return;
  } else name.next().text("");
  // Validate email
  if (checkInput(email) || validEmail(email.val())) {
    email.next().text("The email is incorrect");
    check = false;
    return;
  } else if (!validExist("email", email.val())) {
    email.next().text("The email is existing");
    check = false;
  } else email.next().text("");
  // Validate phone
  if (checkInput(phone) || validPhone(phone.val())) {
    phone.next().text("The phone number is incorrect");
    check = false;
    return;
  } else if (!validExist("phone", phone.val())) {
    phone.next().text("The phone number is existing");
    check = false;
  } else phone.next().text("");
  // Validate password
  if (checkInput(pass)) {
    pass.next().text("Please input password");
    check = false;
    return;
  } else pass.next().text("");
  return check;
};
// Function validate the existing user
let validExist = (key, value) => {
  let check = true;
  userList.forEach((element) => {
    if (element[key] == value) {
      check = false;
    }
  });
  return check;
};
// Function register user
let registerUser = () => {
  // Get the input name and email
  let name = $("#name");
  let email = $("#email");
  let phone = $("#phone");
  let pass = $("#pass");
  let levelUser;
  // Get the levels input
  let levels = $("input[name='userLevel']");
  // Check the checked level
  for (var i = 0; i < levels.length; i++) {
    if ($(levels[i]).prop("checked")) {
      levelUser = $(levels[i]).val();
    }
  }
  if (validData(name, email, phone, pass)) {
    storeUser(
      name.val(),
      email.val(),
      phone.val(),
      pass.val(),
      levelUser,
      userList
    );
    alert("Đăng ký thành công");
  }
};

// ---------------------Login----------------------------------
// Function check login
export let checkLogin = () => {
  let loginCheck = userList.some((element) => {
    return element.login == true;
  });
  if (loginCheck) {
    sessionStorage.setItem(
      2,
      JSON.stringify(
        userList.find((element) => {
          return element.login == true;
        })
      )
    );
    accessUser(JSON.parse(sessionStorage.getItem(2)));
  } else {
    sessionStorage.removeItem(2);
    logOutUser();
  }
};
// Window load -> check login -> show user manager box
// Click login -> get the login info -> compare with user list -> change the status to login true -> show user manager box
// Function User access: show the user box, hide the regbox
let accessUser = (obj) => {
  $(".userContainer").removeClass("d-none");
  $(".regContainer").removeClass("d-flex").addClass("d-none");
  $(".userName").text(obj.name);
};
// Function log out User access: hide the user box, show the redox
let logOutUser = () => {
  $(".userContainer").addClass("d-none");
  $(".regContainer").removeClass("d-none").addClass("d-flex");
};

// Function login user
export let loginUser = (arr) => {
  let loginEmail = $("#loginEmail").val();
  let loginPass = $("#loginPass").val();
  let checkUser = false;
  arr.forEach((element) => {
    if (
      loginEmail.trim() &&
      element.email == loginEmail &&
      element.pass == loginPass
    ) {
      $("button[data-dismiss='modal']").click();
      element.login = true;
      checkUser = true;
      saveArray(arr);
      checkLogin();
      return;
    }
  });
  checkUser ? alert("Login successful") : alert("User does not exist");
};
// Function get the user list
export let getUserList = () => {
  if (JSON.parse(localStorage.getItem(10))) {
    userList = JSON.parse(localStorage.getItem(10));
  }
};
// ---------------------Log out ----------------------------------
// Function Log ou user
export let logOutEvent = () => {
  userList.forEach((element) => {
    element.login = false;
  });
  saveArray(userList);
  checkLogin();
};
// ---------------------User information manager access--------------------
let inforAccess = (event) => {
  // event.preventDefault();
  if (JSON.parse(sessionStorage.getItem(2))) {
    let level = JSON.parse(sessionStorage.getItem(2)).level;
    if (level != 2 && level != 3) {
      event.preventDefault();
      alert(
        "You must be logged in with a level 2 or 3 user to use this function"
      );
    } else {
      alert("You are accessing the User Information Manager page");
    }
  } else {
    event.preventDefault();
    alert(
      "You must be logged in with a level 2 or 3 user to use this function"
    );
  }
};
// ---------------------Trigger the button & onload event--------------
// Trigger register button
$("#saveBtn").click(registerUser);
$("#login-button").click(() => {
  loginUser(userList);
});
$(".logOut-button").click(logOutEvent);
$(".inforManager").click(inforAccess);
// Init the userlist when window onload
$(document).ready(() => {
  getUserList();
  checkLogin();
});
