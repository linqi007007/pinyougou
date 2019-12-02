import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        di: 0,
        value: "全部",
        isActive: true
      },
      {
        di: 1,
        value: "待付款",
        isActive: false
      },
      {
        di: 2,
        value: "待发货",
        isActive: false
      },
      {
        di: 3,
        value: "退货/退款",
        isActive: false
      }
    ],
    orders:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: () => {
    //判断有没有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    //拿页面栈里的数组 需要借用getCurrentPages方法,因为onShow的形参里接收不到问号传参
    let pages = getCurrentPages();
    //拿到数组里的最后一项,也就是当前页面
    let currentPage = pages[pages.length - 1];
    //当前页面里的options里结构出type
    const { type } = currentPage.options;
    //根据type值来决定谁被选中
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
     //修改原数组,确定哪个是被点击的
    let { tabs } = this.data;
    tabs.forEach((item, i) => {
      i == index ? item.isActive = true : item.isActive = false
    });
    //赋值到data
    this.setData({
      tabs
    })
  },
  //标题点击事件,从子组件传递过来的
  handleTabsItemChange(e) {
    //获取点击的标题索引,从子组件出来的
    const { index } = e.detail;
   this.changeTitleByIndex(index);
   //重新发送请求 type=1的时候index可是0哦
   this.getOrders(index+1);
  }
})