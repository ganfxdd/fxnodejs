const Nightmare = require('nightmare')
const n = new Nightmare({show: true, height: 900, width: 1280, webPreferences: {webSecurity: false}})

class GMO {
  constructor() {
    n.goto('https://fx-demo.click-sec.com/neo/demo-sso/')
        .type('#j_username', 'ログインID')//ログインIDを入力
        .type('#j_password', 'ログインパス')//ログインパスワードを入力
        .click('*[name=LoginForm]')
        .wait(15000)
  }
  
  async prepare(lot) {
    await n.wait(2000).evaluate((lot) => {
          document.querySelector('.tabs-menus-order').click()
    }, lot)

    await n.type('*[name=firstOrderLot]', lot)
  }


  async getDataAsync() {
     return n.evaluate(() => {return {sell: Number(document.querySelector(".ratePanel-box-bid-0").innerText + document.querySelector(".ratePanel-box-bid-1").innerText+ document.querySelector(".ratePanel-box-bid-2").innerText)
     , buy: Number(document.querySelector(".ratePanel-box-ask-0").innerText + document.querySelector(".ratePanel-box-ask-1").innerText+ document.querySelector(".ratePanel-box-ask-2").innerText)}})
  }

  async takePositionAsync(isLong) {
    if (isLong) {
      await n.evaluate(() => {
        document.querySelectorAll(".order-buysell-input-label")[1].click()
        document.querySelector('.button-blue').click()
        document.querySelector('.button-red').click()
      })

      await n.wait(3000).click('.tabs-menus-list-text').wait(300).click('.update-btn-inside-text')

      await n.wait(1000).evaluate(() => {
        document.querySelectorAll(".button-position")[3] ? document.querySelectorAll(".button-position")[3].click() : ""
        document.querySelectorAll(".button-position")[9] ? document.querySelectorAll(".button-position")[9].click() : ""
      })

    } else {
      await n.evaluate(() => {
        document.querySelectorAll(".order-buysell-input-label")[0].click()
        document.querySelector('.button-blue').click()
        document.querySelector('.button-red').click()
      })

      await n.wait(3000).click('.tabs-menus-list-text').wait(300).click('.update-btn-inside-text')

      await n.wait(1000).evaluate(() => {
        document.querySelectorAll(".button-position")[3] ? document.querySelectorAll(".button-position")[3].click() : ""
        document.querySelectorAll(".button-position")[9] ? document.querySelectorAll(".button-position")[9].click() : ""
      })
    }

    await n.wait(1000)
  }


  async releasePositionAsync(lot) {
    await n.evaluate(() => {
      document.querySelectorAll(".button-blue")[1].click()
      document.querySelectorAll(".button-red")[1].click()
    })
    
    await n.wait(2000).evaluate(() => {
      document.querySelector(".order-ok-button")
    })

    await this.prepare(lot)
  }

  finish() {
    console.log("finish2")
    n.halt()
  }
}

module.exports = GMO;
