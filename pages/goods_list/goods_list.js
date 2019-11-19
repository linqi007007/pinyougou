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
        value: "综合",
        isActive: true
      },
      {
        di: 1,
        value: "销量",
        isActive: false
      },
      {
        di: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
    
    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  
  //获取商品列表数据的方法
  async getGoodsList(){
    let res=await request({url:"/goods/search",data:this.QueryParams});
    //console.log(res);
    const total=res.total
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    //console.log(this.totalPages);
    this.setData({
      //由于触底激发新数据,故现有数据是老数据与新数据扩展组合而来
      goodsList:[...this.data.goodsList,...res.goods]
    });
    //数据已经拿到,关闭下拉等待效果. 没有触发下拉刷新窗口,执行这个关闭也不会报错
    wx.stopPullDownRefresh();
  },

  //标题点击事件,从子组件传递过来的
  handleTabsItemChange(e) {
    //获取点击的标题索引,从子组件出来的
      const {index}=e.detail;
    //修改原数组,确定哪个是被点击的
    let { tabs } = this.data;
    tabs.forEach((item, i) => {
      i == index ? item.isActive =true : item.isActive =false
    });
    //赋值到data
    this.setData({
      tabs
    })
  },
  //页面上划,滚动条触底监听事件
  onReachBottom(){
    //判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页了
      //console.log("没有下一页了");
      wx.showToast({
        title: '已到底部'
      });
        
    }else{
      //还有下一页
      console.log("还有下一页");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //触发下拉刷新事件
  onPullDownRefresh(){
    //重置数组
    this.setData({
      goodsList:[]
    });
    //重置页码
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsList();
  }
})