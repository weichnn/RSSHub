const got = require('@/utils/got');
const cheerio = require('cheerio');
// const iconv = require('iconv-lite');

const host = 'https://asl.ethz.ch/publications-and-sources/publications.html';
const hostName = 'ethz-asl';
// const map = new Map([
//     [1, { title: 'publication', id: 'publication' }],
// ]);

module.exports = async (ctx) => {
    // const type = Number.parseInt(ctx.params.type);
    // const id = map.get(type).id;
    const res = await got({
        method: 'get',
        url: host,
        responseType: 'buffer',
    });

    const $ = cheerio.load(res.data);
    const list = $('.articleBox').find('article').slice(0, 20);
    // console.log($('.result').find('tr.bibline').text());

    const items =
        list &&
        list
            .map((index, item) => {
                item = $(item);
                return {
                    title: item.find('.pub_title').text(),
                    // title: item.find('a').attr('title'),
                    // pubDate: new Date(item.find('.con1rm2l').text()).toUTCString(),
                    description: item.find('.pub_info'),
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
