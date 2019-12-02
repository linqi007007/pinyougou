
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs: [
      {
        di: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        di: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        di: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        di: 3,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });
      
  },

  handleTabsItemChange(e) {
    //获取点击的标题索引,从子组件出来的
    const { index } = e.detail;
    //修改原数组,确定哪个是被点击的
    let { tabs } = this.data;
    tabs.forEach((item, i) => {
      i == index ? item.isActive = true : item.isActive = false
    });
    //赋值到data
    this.setData({
      tabs
    })
  }
})