"use strict";

// Load all Angular Modules
import "bootstrap";
import "angular";
// import "angular-route";
import '@angular/router/angular1/angular_1_router'; // "angular-component-router";
import "angular-sanitize";
import "angular-chart.js";

require("bootstrap/dist/css/bootstrap-reboot.css");
require("bootstrap/dist/css/bootstrap.css");
require("assets/main.styl");

// App Global variable
var app = require("app.module");
app.config(require("app.config"));
app.value('$routerRootComponent', 'app');

// Services
app.factory("Auth", require("services/auth"));
app.factory("Account", require("services/account"));
app.factory("Records", require("services/records"));
app.factory("Users", require("services/users"));

// Commponents

// App
app.component('app', require("components/app"));

// Pages
app.component('homePage', require("pages/home"));
app.component('loginPage', require("pages/login"));
app.component('logoutPage', require("pages/logout"));
app.component('registrationPage', require("pages/registration"));
app.component('recordsPage', require("pages/records"));
app.component('usersPage', require("pages/users"));
app.component('profilePage', require("pages/profile"));

// Blocks
app.component('recordItem', require("components/record-item"));
app.component('recordCreate', require("components/record-create"));
app.component('menuBeforeAuth', require("components/menu-before-auth"));
app.component('menuHeader', require("components/menu-header"));
app.component('responseMessage', require("components/response-message"));
app.component('pagination', require("components/pagination"));
