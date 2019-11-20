import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  //商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);

  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: { goods_id }
    });
    this.GoodsInfo=goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics

      }
    })
  },
  //点击轮播图放大预览
  handlePreviewImage(e){
    //1选构造预览图片的数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    //2接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  //点击加入购物车的方法
  handleCartAdd(){
    //1获取本地存储里购物车的数据,如果没有返回空数组
    let cart=wx.getStorageSync('cart')||[];
    //2获取第一个符合(本地存储的goods_id 和当前商品对象goods_id一致)的元素索引值,如果没有,将返回-1
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //判断index是否等于-1
    if(index===-1){
      //是-1代表不存在,那么就要把数据第一次存入本地存储
      this.GoodsInfo.num=1;
      cart.push(this.GoodsInfo);
      
    }else{
      //如果第一次出现的下标存在,那么只执行数量上的增加(这个数组的第index元素中的num属性的值加1)
      cart[index].num++;
    }
    //然后把cart数组存入本地存储中
    wx.setStorageSync('cart', cart);
    //提示客户已经添加到购物车了
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask:true
    })
  }
})