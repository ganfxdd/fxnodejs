const Nightmare = require('nightmare')
const MyRandom = require("../common/random.js");
require('nightmare-real-mouse')(Nightmare);
const n = new Nightmare({show: true, webPreferences: {webSecurity: false}})
class MONEY {
    constructor() {
      n.goto('http://www.moneypartners.co.jp/login/')
        .evaluate(() => {
          document.querySelector('[name=loginId]').value = "ログインID"//ログインIDを入力
        })
        .evaluate(() => {
          document.querySelector('[name=password]').value = "ログインpass"//ログインpassを入力
          doLogin()
        })
        .wait(3000)
        .goto('https://account.moneypartners.co.jp/retail/quick_trade_board.do?serviceId=PARTNERS_FX&channelId=WEB&btnId=02')
        .wait(1000)
    }

    async prepare(lot) {
      await n.wait(3000).evaluate((lot) => {
      }, lot)

      .realClick('.orderQuantityWrapper span [data-uifieldtype="spinnerup"]')
      //このタイミングでlotを手動で変える
      await n.wait(3000)
    }

    async getDataAsync() {
      return n.evaluate(() => {return {sell: Number(document.querySelector(".streamingBidButton div .small").innerText + document.querySelector(".streamingBidButton div .big").innerText+ document.querySelector(".streamingBidButton div .fraction").innerText), 
      buy: Number(document.querySelector(".streamingAskButton div .small").innerText + document.querySelector(".streamingAskButton div .big").innerText + document.querySelector(".streamingAskButton div .fraction").innerText)}})
    }

    async takePositionAsync(isLong) {
      console.log("★★★★★★★★")
        if (isLong) {
          await n.realClick('.streamingAskButton')
        } else {
          await n.realClick('.streamingBidButton')
        }
      await n.wait(2100)//←
      await n.realClick('#positionList tbody td [name="pListPositionListTarget"]')
    }

    async releasePositionAsync(isLong) {
        if (isLong) {
          await n.evaluate(() => {
            document.querySelectorAll(".streamingBidButton")[1].click()
          })
        } else {
          await n.evaluate(() => {
            document.querySelectorAll(".streamingAskButton")[1].click()
          })
        }
        console.log("@@@@@@@@@@@")
        await n.wait(2000)//←
    }
}

module.exports = MONEY;
