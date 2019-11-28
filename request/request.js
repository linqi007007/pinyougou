
//同时调用一下方法的执行次数
let ajaxTimes = 0;
export const request = (params) => {
//判断url中是否带有字符串 /my/ 如果有说明需要请求头里带上token
    let header={...params.header}
    if(params.url.includes("/my/")){
        //拼接header 带上token
        header["Authorization"]=wx.getStorageSync('token');
    }
    ajaxTimes++;
    //显示加载中蒙版
    wx.showLoading({
        title: "加载中",
        mask: true
    });

    //定义公共的url
    const baseUrl = 'https://api.zbztb.cn/api/public/v1';
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => { reject(err) },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    //关闭加载中蒙版
                    wx.hideLoading();
                }
            }
        });
    });
}