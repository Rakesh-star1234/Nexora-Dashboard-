// Hide page until check complete
document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {

let user = localStorage.getItem("loggedInUser");
let page = window.location.pathname.split("/").pop();


// ================= PAGE PROTECTION =================

if (page === "index.html" || page === "") {

    if (user === "admin") {
        window.location.replace("admin.html");
        return;
    }

    if (user) {
        window.location.replace("home.html");
        return;
    }
}

if (page === "home.html") {
    if (!user || user === "admin") {
        window.location.replace("index.html");
        return;
    }
}

if (page === "profile.html") {
    if (!user || user === "admin") {
        window.location.replace("index.html");
        return;
    }
}

if (page === "admin.html") {
    if (user !== "admin") {
        window.location.replace("index.html");
        return;
    }
}


// ================= LOAD THEME =================

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}


// ================= HOME PAGE DATA =================

let welcome = document.getElementById("welcomeUser");
if (welcome && user) welcome.innerText = user;

let cardUser = document.getElementById("cardUsername");
if (cardUser && user) cardUser.innerText = user;

let themeText = document.getElementById("currentTheme");
if (themeText) {
    themeText.innerText =
        localStorage.getItem("theme") === "light" ? "Light" : "Dark";
}


// ================= LAST LOGIN =================

let lastLogin = document.getElementById("lastLogin");
if (lastLogin) {
    lastLogin.innerText = localStorage.getItem("lastLogin") || "First Login";
}


// ================= LOGIN COUNT =================

let loginCount = document.getElementById("loginCount");

if(loginCount){

let count = localStorage.getItem("loginCount") || 0;
loginCount.innerText = count;

}


// ================= PROFILE PAGE =================

let profileUser = document.getElementById("profileUser");
if (profileUser && user) {
    profileUser.innerText = "Username: " + user;
}


// ================= ADMIN USER LIST =================

if (page === "admin.html") {

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let list = document.getElementById("userList");

    if (list) {

        list.innerHTML = "";

        users.forEach(u => {

            let li = document.createElement("li");
            li.style.margin = "8px 0";
            li.innerText = u.username;

            list.appendChild(li);

        });

        if (users.length === 0) {
            list.innerHTML = "<li>No users registered</li>";
        }

    }

}


// ================= PROFILE IMAGE SHOW =================

showProfileImage();


// Show page after loading
document.documentElement.style.visibility = "visible";

});


// ================= SIGNUP =================

function signup() {

let username = document.getElementById("username").value.trim();
let password = document.getElementById("password").value.trim();
let message = document.getElementById("message");

if (!username || !password) {

    message.innerText = "Fill all fields";
    message.style.color = "red";
    return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

if (users.find(u => u.username === username)) {

    message.innerText = "User already exists";
    message.style.color = "red";
    return;
}

users.push({ username, password });

localStorage.setItem("users", JSON.stringify(users));

message.innerText = "Signup Successful";
message.style.color = "green";

}


// ================= LOGIN =================

function login() {

let username = document.getElementById("username").value.trim();
let password = document.getElementById("password").value.trim();
let message = document.getElementById("message");

if (username === "admin" && password === "admin123") {

    localStorage.setItem("loggedInUser", "admin");
    localStorage.setItem("lastLogin", new Date().toLocaleString());

    window.location.replace("admin.html");
    return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

let valid = users.find(
    u => u.username === username && u.password === password
);

if (valid) {

    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("lastLogin", new Date().toLocaleString());

    let count = localStorage.getItem("loginCount") || 0;
    count++;
    localStorage.setItem("loginCount", count);

    window.location.replace("home.html");

} else {

    message.innerText = "Invalid Credentials";
    message.style.color = "red";
}

}


// ================= LOGOUT =================

function logout() {

localStorage.removeItem("loggedInUser");

window.location.replace("index.html");

}


// ================= NAVIGATION =================

function goHome() {
window.location.replace("home.html");
}

function goProfile() {
window.location.replace("profile.html");
}

function goForgot() {
window.location.replace("forgot.html");
}


// ================= PASSWORD TOGGLE =================

function togglePassword() {

let pass = document.getElementById("password");

if (pass) {

pass.type = pass.type === "password" ? "text" : "password";

}

}


// ================= THEME =================

function toggleTheme() {

document.body.classList.toggle("light-mode");

localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode")
        ? "light"
        : "dark"
);

let themeText = document.getElementById("currentTheme");

if (themeText) {

themeText.innerText =
    document.body.classList.contains("light-mode")
        ? "Light"
        : "Dark";

}

}


// ================= UPDATE PROFILE =================

function updateProfile() {

let currentUser = localStorage.getItem("loggedInUser");

let newUsername = document.getElementById("editUsername").value.trim();
let newPassword = document.getElementById("editPassword").value.trim();

let users = JSON.parse(localStorage.getItem("users")) || [];

let index = users.findIndex(u => u.username === currentUser);

if (index === -1) return;

if (newUsername) {

    if (users.find(u => u.username === newUsername)) {

        alert("Username already taken");
        return;

    }

    users[index].username = newUsername;
    localStorage.setItem("loggedInUser", newUsername);

}

if (newPassword) {

    users[index].password = newPassword;

}

localStorage.setItem("users", JSON.stringify(users));

alert("Profile Updated Successfully");

location.reload();

}


// ================= DELETE ACCOUNT =================

function deleteAccount() {

let confirmDelete = confirm("Are you sure you want to delete your account?");

if (!confirmDelete) return;

let currentUser = localStorage.getItem("loggedInUser");

let users = JSON.parse(localStorage.getItem("users")) || [];

users = users.filter(u => u.username !== currentUser);

localStorage.setItem("users", JSON.stringify(users));

localStorage.removeItem("loggedInUser");

alert("Account Deleted Successfully"); 

window.location.replace("index.html");

}


// ================= RESET PASSWORD =================

function resetPassword(){

let username = document.getElementById("resetUsername").value.trim();
let newPassword = document.getElementById("newPassword").value.trim();
let message = document.getElementById("resetMessage");

let users = JSON.parse(localStorage.getItem("users")) || [];

let index = users.findIndex(u => u.username === username);

if(index === -1){

message.innerText = "User not found";
message.style.color = "red";
return;

}

users[index].password = newPassword;

localStorage.setItem("users", JSON.stringify(users));

message.innerText = "Password Reset Successful";
message.style.color = "green";

}


// ================= PROFILE IMAGE UPLOAD =================

function uploadProfileImage(){

let file = document.getElementById("uploadImage").files[0];

if(!file){
alert("Select image first");
return;
}

let reader = new FileReader();

reader.onload = function(){

localStorage.setItem("profileImage", reader.result);

showProfileImage();

};

reader.readAsDataURL(file);

}


// ================= SHOW PROFILE IMAGE =================

function showProfileImage(){

let img = localStorage.getItem("profileImage");

let profile = document.getElementById("profileImage");
let home = document.getElementById("homeProfileImage");

if(profile && img){
profile.src = img;
}

if(home && img){
home.src = img;
}

}