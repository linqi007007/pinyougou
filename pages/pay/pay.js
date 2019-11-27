import { requestPayment, showToast } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/request"
Page({
  data: {
    address: {},
    cart: [],

    totalPrice: 0,
    totalNum: 0

  },
  onShow() {
    //获得缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车信息
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的cart数组
    cart = cart.filter(v => v.checked)
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    //把购物车数据和全选状态\总价格\总数量,重新设置回data中
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },
  //点击支付事件
  async  handleOrderPay() {
    try {
      //去拿缓存中的token
      const token = wx.getStorageSync("token");
      //判断token是否存在.
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return;
      }
      //创建订单 -准备请求头参数
      const header = { Authorization: token };
      //创建订单 -准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.goods_number,
          goods_price: v.goods_price
        })
      })
      const orderParams = { order_price, consignee_addr, goods }
      //发送请求,创建订单,获取订单编号
      let { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header });
      //发起预支付的接口
      let { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number }, header })
      //发起微信支付
      await requestPayment(pay);
      //确定最后的订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number }, header })
      await showToast({ title: "支付成功" });
      //跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order'
      });
        
    } catch (error) {
      await showToast({ title: "支付失败" });
      console.log(error)
    }
  }

})