var request = require('request');
var fs = require('fs');


const { Builder, By } = require('selenium-webdriver');

async function photo() {
  let driver = await new Builder().forBrowser('chrome').build();
  sleep(200);
  await driver.get('https://movie.douban.com/explore#!type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=0');
  sleep(200);
  let list = await driver.findElements(By.css('.list a'));
  let pList = await driver.findElements(By.css('.item p'));
  let hrefList = [];
  let pListArr = [];
  for (let i = 0; i < list.length; i++) {
    let href = await list[i].getAttribute('href');
    let p = await pList[i].getText();
    pListArr.push(p);
    hrefList.push(href);
  }
  for (let i = 0; i < hrefList.length; i++) {
    // await driver.get(hrefList[i]);
    // sleep(200)
    // console.log(By.xpath('//*[@id="related-pic"]/h2/span/a[4]').getAttribute('href'))
    // await driver.get(driver.findElement(By.partialLinkText('图片')).getAttribute('href'));
    await driver.get(hrefList[i].split('?')[0] + 'all_photos');

    let imgList = [];
    let needImg = [];
    let needList = await driver.findElements(By.css('.pic-col5 a'));
    for (let k = 0; k < 6; k++) {
      let src = await needList[k].getAttribute('href');
      imgList.push(src);
    }
    for (let j = 0; j < imgList.length; j++) {
      await driver.get(imgList[j]);
      let oneList = await driver.findElement(By.css('.photo-wp img')).getAttribute('src');
      console.log(oneList);
      needImg.push(oneList);
    }
    fs.mkdirSync(`image/${pListArr[i]}`);
    for (const url of needImg) {
      const name = `${url.slice(url.lastIndexOf('/') + 1).split('.')[0]}.jpg`;
      request(url).pipe(fs.createWriteStream(`image/${pListArr[i]}/` + name));
    }
  }
}
function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d; );
}
photo();
