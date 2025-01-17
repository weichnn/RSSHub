// const got = require('@/utils/got');
const cheerio = require('cheerio');
// const iconv = require('iconv-lite');

const host = 'http://rse-lab.cs.washington.edu/publications/';
const hostName = 'wst-rse';
// const map = new Map([
//     [1, { title: 'publication', id: 'publication' }],
// ]);

module.exports = async (ctx) => {
    // const type = Number.parseInt(ctx.params.type);
    // const id = map.get(type).id;
    let document;
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(host);
    await page.waitForSelector('.pub-container', {
        visible: true,
    });
    const html = await page.evaluate(() => document.querySelector('.iframe').innerHTML);
    await browser.close();

    // console.log(html);

    const $ = cheerio.load(html);
    const list = $('.pub-container').find('.text1').slice(0, 20);
    // console.log($('.result').find('tr.bibline').text());

    const items =
        list &&
        list
            .map((index, item) => {
                item = $(item);
                return {
                    title: item.find('a').text(),
                    // title: item.find('a').attr('title'),
                    // pubDate: new Date(item.find('.con1rm2l').text()).toUTCString(),
                    // description: `${item.find('.bibthumb')}`,
                    link: `${item.find('a').attr('href')}`,
                    // link: `http://10.14.122.238/${item.find('a').attr('href')}`,
                };
            })
            .get();

    ctx.state.data = {
        title: hostName,
        link: host,
        item: items,
    };
};
