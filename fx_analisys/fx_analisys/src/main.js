const PriceGetter = require("./common/price-getter.js");
var fs = require('fs');
var moment = require("moment");
var priceGetter = new PriceGetter()
var hasPosition = ""

const Lot = 5 // position数
const CHECK_RANGE = 0.003 // 売買する差分(0.3銭)
const RELEASE_RANGE = 0.001 // 決済する差分(0.1銭)
var companyNames



!(async() => {
    var companyArray = await priceGetter.prepare(Lot)

    companyNames = Object.keys(await priceGetter.getAllDataAsync()) // 初回Loadは遅いため一度空Load
    run()
})()

async function run() {
    var dataObj = await priceGetter.getAllDataAsync()
    let diff = await compareAll(dataObj)
    if (diff) {
        fs.appendFile('../result/result.csv', diff, function(err){if (err) {
            throw err;
        }});
    }

    if (hasPosition) {
        setTimeout(releasePosition, 1000)
    } else {
        console.log(dataObj)
        setTimeout(run, 500) // 500msごとに確認
    }
}

async function releasePosition() {
    var dataObj = await priceGetter.getPositionDataAsync(hasPosition)
    console.log(dataObj)
    if (dataObj[hasPosition[1].object.constructor.name].data.sell - dataObj[hasPosition[0].object.constructor.name].data.buy >= RELEASE_RANGE) {
        await Promise.all([hasPosition[0].object.releasePositionAsync(Lot, true), hasPosition[1].object.releasePositionAsync(Lot, false)]);
        hasPosition = ""
        console.log("release!!")
        setTimeout(run, 1000)
    } else {
        setTimeout(releasePosition, 500) // 500msごとに確認
    }
}

async function compareAll(dataObj) {
    var diffMoreRange = ''
    for (var i=0; i<companyNames.length-1; i++) {
        let buy = dataObj[companyNames[i]].data.buy
        let sell = dataObj[companyNames[i]].data.sell
        for (var j=i+1; j<companyNames.length; j++) {
            // 全fx会社を比較 売値と買値を比較して差がある場合は情報を保存
            if (buy < dataObj[companyNames[j]].data.buy) {
                var diff = compare(dataObj[companyNames[j]].data.sell, buy) ? moment().format("HH:mm:ss") + `,${companyNames[j]} sell,${dataObj[companyNames[j]].data.sell},${companyNames[i]} buy,${buy}\n` : ''
                var obj = [dataObj[companyNames[j]], dataObj[companyNames[i]]]
            } else {
                var diff = compare(sell, dataObj[companyNames[j]].data.buy) ? moment().format("HH:mm:ss") + `,${companyNames[i]} sell,${sell},${companyNames[j]} buy,${dataObj[companyNames[j]].data.buy}\n` : ''
                var obj = [dataObj[companyNames[i]], dataObj[companyNames[j]]]
            }
            
            if (diff) {
                hasPosition = obj
                await Promise.all([hasPosition[0].object.takePositionAsync(false), hasPosition[1].object.takePositionAsync(true)]);
                diffMoreRange += diff;
                break;
            }
            if (diff) {
                break;
            }
        }
    }
    return diffMoreRange
}

function compare(bigSell, smallBuy, range = CHECK_RANGE) {
    return bigSell - smallBuy >= range
}