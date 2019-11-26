import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx";
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
    //以下代码封装在setCart方法里了
    //计算全选复选框是否需要勾上
    //const allChecked = cart.length ? cart.every(v => v.checked) : false;
    // // 优化allChecked
    // let allChecked = true;
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.goods_price * v.num;
    //     totalNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // });
    // // 如果cart是空数组,上面forEach不能执,那么allChecked 就一直是真.所以需要判断下cart
    // allChecked = cart.length != 0 ? allChecked : false;
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setData({
      address
    });
    this.setCart(cart);
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
  handleItemChange(e) {
    //获取被修改选中状态的对象id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let { cart } = this.data;
    //找到被修改的商品对象的下标
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //给cart下的checked取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  //封装,设置购物车状态同时,重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 如果cart是空数组,上面forEach不能执,那么allChecked 就一直是真.所以需要判断下cart
    allChecked = cart.length != 0 ? allChecked : false;
    //把购物车数据和全选状态\总价格\总数量,重新设置回data中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    //把购物车数据重新设置回缓存中
    wx.setStorageSync("cart", cart);
  },
  //商品全选功能
  handleItemAllCheck() {

    //获取data中的数据
    let { cart, allChecked } = this.data;

    //修改打data中的allChecked值
    allChecked = !allChecked;
    console.log(allChecked);
    //循环修改cart数组中 商品选中状态
    cart.forEach(v => {
      v.checked = allChecked;
    })
    //把修改好的数据填充回data和本地存储
    this.setCart(cart);
  },
  //商品数量编辑功能
  async handleItemNumEdit(e) {
    //获取事件传递过来的参数
    const { id, operation } = e.currentTarget.dataset;
    //获取购物车数组
    let { cart } = this.data;
    // 需要 的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      //弹窗提示是否要删除
      const res = await showModal({
        content: "您是否要删除?"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {

      //进行修改数量
      cart[index].num += operation;
      //设置回缓存和data
      this.setCart(cart);
    }

  },
  //点击结算
  async handlePay() {
    //判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      let res = await showToast({ title: "您还没有选择收货地址" })
      return;
    }
    //判断有没有商品列表
    if (totalNum === 0) {
      let res = await showToast({ title: "您还没有选购商品" })
      return;
    }
    //有地址 有商品 执行跳转到支付页
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
      
  }

})