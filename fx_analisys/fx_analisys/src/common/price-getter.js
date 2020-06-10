const GMO = require("../company/gmo.js");
const MONEY = require("../company/money.js");


class PriceGetter {
    constructor() {
        this.companyArray = []
        this.companyArray.push(new MONEY())
        this.companyArray.push(new GMO())
    }

    async prepare(lot) {
        var promise = []
        for (let company of this.companyArray) {
            promise.push(company.prepare(lot))
        }
        await Promise.all(promise);

        return this.companyArray
    }

    async getAllDataAsync() {
        var promise = []
        for (let company of this.companyArray) {
            promise.push(company.getDataAsync())
        }
        var dataArray = await Promise.all(promise);
        var dataObj = {}
        for (var i=0; i<this.companyArray.length; i++) {
            dataObj[this.companyArray[i].constructor.name] = {data: dataArray[i], object: this.companyArray[i]}
        }
        return dataObj
    }

    async getPositionDataAsync(hasPosition) {
        var promise = []
        promise.push(hasPosition[0].object.getDataAsync(true, true))
        promise.push(hasPosition[1].object.getDataAsync(true, false))
        var dataArray = await Promise.all(promise);
        var dataObj = {}
        for (var i=0; i<2; i++) {
            dataObj[hasPosition[i].object.constructor.name] = {data: dataArray[i], object: hasPosition[i].object}
        }
        return dataObj
    }
}

module.exports = PriceGetter;
