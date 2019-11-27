// pages/auth/index.js
import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      //获取小程序登录成功后的登录客户的code值
      const { code } = await login();

      const loginParams = { encryptedData, rawData, iv, signature, code }
      //有了以上信息,准备发送数据给服务器拿到客户的token
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" });
      //把token存储到缓存中,同时跳转会上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }

  }

})