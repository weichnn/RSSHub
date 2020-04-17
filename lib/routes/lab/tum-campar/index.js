const got = require('@/utils/got');
const cheerio = require('cheerio');
// const iconv = require('iconv-lite');

const host = 'http://campar.in.tum.de/view/Chair/PublicationOverview?author=all&group=all&year=all&project=all&media=all';
const hostName = 'tum-campar';
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
    const list = $('tbody').find('tr').slice(0, 20);
    // console.log($('.result').find('tr.bibline').text());

    const items =
        list &&
        list
            .map((index, item) => {
                item = $(item);
                return {
                    title: item.find('b').find('a').text(),
                    // title: item.find('a').attr('title'),
                    // pubDate: new Date(item.find('.con1rm2l').text()).toUTCString(),
                    // description: `${item.find('.bibthumb')}`,
                    link: `${item.find('b').find('a').attr('href')}`,
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
