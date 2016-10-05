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
const __1 = require('../../..');
class RandomOptions {
}
exports.RandomOptions = RandomOptions;
let Random = class Random {
    constructor(options) {
        this.options = options;
    }
    random() {
        return Math.random() * this.options.amount || 1.0;
    }
};
Random = __decorate([
    __1.decorators.options(RandomOptions),
    __1.decorators.service(), 
    __metadata('design:paramtypes', [RandomOptions])
], Random);
exports.Random = Random;
