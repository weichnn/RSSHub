const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const host = 'http://www.cse.zju.edu.cn/redir.php?catalog_id=';
// const host = 'http://10.14.122.238/redir.php?catalog_id=';

const map = new Map([
    [1, { title: '浙大控制学院 -- 重点提示', id: '1055602' }],
    [2, { title: '浙大控制学院 -- 对外交流', id: '1055867' }],
    [3, { title: '浙大控制学院 -- 研究生教育最新消息', id: '1055842' }],
    [4, { title: '浙大控制学院 -- 简讯', id: '1055601' }],
]);

module.exports = async (ctx) => {
    const type = Number.parseInt(ctx.params.type);
    const id = map.get(type).id;
    const res = await got({
        method: 'get',
        url: host + `${id}`,
        responseType: 'buffer',
    });

    const $ = cheerio.load(iconv.decode(res.data, 'gb2312'));
    const list = $('.con1rm2').find('li').slice(0, 20);
    // console.log($('.con1rm2').text());

    const items =
        list &&
        list
            .map((index, item) => {
                item = $(item);
                return {
                    title: item.find('a').text(),
                    // title: item.find('a').attr('title'),
                    pubDate: new Date(item.find('.con1rm2l').text()).toUTCString(),

                    link: `http://www.cse.zju.edu.cn/${item.find('a').attr('href')}`,
                    // link: `http://10.14.122.238/${item.find('a').attr('href')}`,
                };
            })
            .get();

    ctx.state.data = {
        title: map.get(type).title,
        link: host + `${id}`,
        item: items,
    };
};
