var request = require('request');
var fs = require('fs');

const { Builder, By } = require('selenium-webdriver');

async function photo() {
  let driver = await new Builder().forBrowser('chrome').build();
  sleep(200);
  await driver.get('https://news.qq.com/');
  sleep(200);
  let liList = [];
  // (await driver.findElement(By.className('item'))).click();
  let a = await driver.findElements(By.css('.channel_mod .list .item .picture'));
  // liList.push(a)
  // console.log(a);
  // liList.push(li)
  for (let i = 1; i < a.length; i++) {
    let href = await a[i].getAttribute('href');
    liList.push(href);
  }
  let h1 = '';
  let str = '';
  let strList = [];
  let h1List = [];
  for (let j = 1; j < liList.length; j++) {
    try {
      await driver.get(liList[j]);
      h1 = await driver.findElement(By.css('h1')).getText();
      str = await driver.findElement(By.className('content-article')).getText();
      console.log(str);
      h1List.push(h1);
      strList.push(str);
    } catch (error) {
      console.log(error);
    }
  }
  for (let k = 1; k < h1List.length; k++) {
    fs.mkdirSync(`txt/${h1List[k]}`);
    const name = `${k}.txt`;
    // request(strList[k]).pipe(fs.createWriteStream(`txt/${h1List[k]}/` + name));
    fs.writeFile(`txt/${h1List[k]}/${name}`, `${strList[k]}`, error => {
      if (error) return console.log('写入文件失败,原因是' + error.message);
      console.log('写入成功');
    });
  }
}
function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d; );
}
photo();
