
Page({
  data: {
    tabs: [
      {
        di: 0,
        value: "体验问题",
        isActive: true
      },
      {
        di: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    //被选中图片数组数据
    chooseImgs: [],
    //表示 文本域的内容存储
    textVal: ""
  },
  //全局变量，存储的是图片的外网数据数组
  UpLoadImgs: [],
  //点击tabs组件时需要做的事
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
  },
  //点击+号选择图片事件
  handleChooseImg() {
    //调用小程序内置的api
    wx.chooseImage({
      //同时能选择的图片数量
      count: 9,	// 默认为9
      //图片的格式
      sizeType: ['original', 'compressed'],	// 指定原图或者压缩图
      // 指定图片来源
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          //图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  //点击自定义上传图片的事件
  handleRemoveImg(e) {
    //获取被点击组件的索引
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  //点击文本域输入的事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //提交按钮触发的事件
  handleFormSubmit() {
    //获取文本域里存储的数据，和拿图片数组
    const { textVal, chooseImgs } = this.data;

    //合法性验证
    if (!textVal.trim()) {
      //不合法的
      wx.showToast({
        title: '请先输入内容',
        mask: true
      })
      return;
    }
    //显示正在等待的图标
    wx.showLoading({
      title: "上传中",
      mask: true
    });
    //判定用户有没有选择图片
    if (chooseImgs.length != 0) {
      //把图片上传到专门的服务器，然后拿到图片的外网地址
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          //文件上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          //被上传的文件路径
          filePath: v,
          //上传的文件的名称，用途是后台来获取文件
          name: "file",
          //上传文件时可以外带一些文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            //所有的图片都上传完毕了才触发
            if (i === chooseImgs.length - 1) {
              //关闭上传等待提示窗口
              wx.hideLoading();

              console.log("要到接口,把文本和图片外网地址传给接口");
              //提交都成功了,后重置页面,然后返回上一页.
              this.setData({
                chooseImgs: [],
                textVal: ""
              });
              wx.navigateBack({
                delta: 1
              });


            }

          }
        });
      })
    } else {
      wx.hideLoading();
      console.log("只是提交文本给对应的接口");
      this.setData({
        textVal: ""
      });
      wx.navigateBack({
        delta: 1
      });
    }





  }
})