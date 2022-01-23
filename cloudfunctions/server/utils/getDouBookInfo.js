const axios = require("axios");
const doubanbook = require("doubanbook");
const cheerio = require("cheerio");

async function getDouban(isbn) {
    const url = `https://search.douban.com/book/subject_search?search_text=${isbn}`;
    let serachRes = await axios.get(url);
    // 获取window.__DATA__ = 后面的数据 解密 就是 括号里的数据
    let reg = /window\.__DATA__ = "(.*)"/;
    if (reg.test(serachRes.data)) {
        let serachData = doubanbook(RegExp.$1)[0];
        return serachData;
    }
}
async function getBookDetail(bookInfo) {
    let res = await axios.get(bookInfo.url);
    const $ = new cheerio.load(res.data);
    let profile = $("#info")
        .text()
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e);
    let tag = [];
    $("#db-tags-section a.tag").each((i, e) => {
        tag.push($(e).text());
    });
    let des = $("#link-report").text().trim();
    // let comments = [];
    // $("#comments .comment").each((index, element) => {
    //     comments.push({
    //         author: $(element).find(".comment-info a").text(),
    //         content: $(element).find(".comment-content .short").text(),
    //         date: $(element).find(".comment-info span").text(),
    //         rating: $(element).find(".comment-info span").eq(0).attr().title,
    //     });
    // });

    const resultData = {
        name: `《${bookInfo.title}》`,
        rate: bookInfo.rating.value,
        images: bookInfo.cover_url,
        doubanUrl: bookInfo.url,
        summary: des,
        tag,
        author: profile[1],
        publisher: profile[2].slice(5),
        price: profile[profile.length - 4].slice(4, -1),
    };
    return resultData;
}
// 调试
async function getBookInfo(isbn) {
    // 第一个爬虫： 通过isbn获取豆瓣书籍详情 包含：书名、出版信息、评分、详情url
    let bookInfo = await getDouban(isbn);
    // 第二个爬虫：通过bookInfo.url爬取到书籍详情、评论等
    let bookDetail = await getBookDetail(bookInfo);
    return bookDetail;
}
module.exports = {
    getBookInfo,
};