import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

  },
  async getGoodsDetail(goods_id){
    const goodsObj=await request({
      url:"/goods/detail",
      data:{goods_id}
    });
    console.log(goodsObj);
    this.setData({
      goodsObj
    })
  }
})