"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const _1 = require('../../../');
const random_1 = require('../services/random');
let HomeController = class HomeController extends _1.Controller {
    constructor(rnd) {
        super();
        this.rnd = rnd;
    }
    random(ctx) {
        ctx.body = "Random " + this.rnd.random();
    }
    send(ctx) {
        return ctx.send("home.js", {
            root: __dirname
        });
    }
};
__decorate([
    _1.decorators.get('/random'), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', void 0)
], HomeController.prototype, "random", null);
__decorate([
    _1.decorators.get("/send"), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', void 0)
], HomeController.prototype, "send", null);
HomeController = __decorate([
    _1.decorators.controller(), 
    __metadata('design:paramtypes', [random_1.Random])
], HomeController);
exports.HomeController = HomeController;
