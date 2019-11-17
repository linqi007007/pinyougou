import { request } from "../../request/request";
Page({
  /**
     * 页面的初始数据
     */
  data: {
    //轮播图数组存储
    swiperList: [],
    // 导航数组存储
    catesList: [],
    // 楼层数据存储
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //发送异步请求轮播图数据 此处需要优化,使用promise优化解决回调地狱
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();

  },
  //获取轮播图数据的方法
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  //获取分类导航数据的方法
  getCatesList() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  //获取楼层数据的方法
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  }
})