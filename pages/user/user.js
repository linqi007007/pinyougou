
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    //被收藏的商品的数量
    collectNums: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      userInfo,
      collectNums: collect.length
    });
  }

})