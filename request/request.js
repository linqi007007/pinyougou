
//同时调用一下方法的执行次数
let ajaxTimes = 0;
export const request = (params) => {
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