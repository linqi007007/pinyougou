import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0

  },
  onShow() {
    //获得缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车信息
    const cart = wx.getStorageSync("cart") || [];
    //计算全选复选框是否需要勾上
    //const allChecked = cart.length ? cart.every(v => v.checked) : false;
    // 优化allChecked
    let allChecked=true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      }else{
        allChecked=false;
      }
    });
    // 如果cart是空数组,上面forEach不能执,那么allChecked 就一直是真.所以需要判断下cart
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
  },
  //点击收货地址按钮最初的代码,需要优化
  // handleChooseAddress() {
  //   wx.getSetting({
  //     success: (result) => {
  //       //获取权限状态信息
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if (scopeAddress === true || scopeAddress === undefined) {
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log(result1);
  //           }
  //         });
  //       } else {
  //         //之前拒绝过开发权限
  //         wx.openSetting({
  //           success: (result2) => {
  //             wx.chooseAddress({
  //               success: (result3) => {
  //                 console.log(result3);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     }
  //   })
  // }

  //点击收货地址按钮出发的事件
  async handleChooseAddress() {
    //try catch 当可以点击取消授权时,会抛出一个错误.用此方式接受错误并做一些处理,避免终止后续程序
    try {
      //获取权限状态信息
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //判断权限的状态
      if (scopeAddress === false) {
        //之前拒绝过开放权限,引导客户进入开放权限界面
        await openSetting();
      }
      //当有权限后,拿到客户存储的收货地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //把收货地址存入本地存储
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handleItemChange(e){
    //获取被修改选中状态的对象id
    const goods_id=e.currentTarget.dataset.id;
  }

})