
import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧列表数据
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    //右侧每次刷新距离顶部的距离
    scrollTop: 0
  },
  //分类页面所有数据请求,接口的返回数据存放处
  Cates: [],

  onLoad: function (options) {
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync('cates');
    //判断本地存储是否存在
    if (!Cates) {
      //不存在
      this.getCats();
    }
    else {
      //存在 需先判断有没有过期,没过期就使用,如过期还要发请求.
      if (Date.now() - Cates.time > 1000 * 300) {
        //超时就要从新发请求数据
        this.getCats();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  // 获取分类页面数据
  async getCats() {
    // request({
    //   url: "/categories"
    // }).then(result => {
    //   this.Cates = result.data.message;
    //   // 把数据存入本地存储
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    //   //构造左侧菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //构造右边商品内容数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })

    //使用es7的async 和await发布异步请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把数据存入本地存储
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    //构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右边商品内容数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      //重置 右侧商品列表滚动位置为置顶
      scrollTop: 0
    });


  }
})