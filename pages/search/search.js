import { request } from "../../request/request";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        goods:[],
        //取消按钮是否显示
        isFocus:false,
        //输入框的值
        inpValue:""
    },
    TimeId:-1,
    // 输入框的值发生改变时触发的事件
    handleInput(e) {
       //获取输入框的值
       console.log(e.detail);
        const {value}=e.detail;
        console.log(value);
        //检查合法性
        if(!value.trim()){
            //不合法的,没有值
            this.setData({
                goods:[],
                isFocus:false
            })
            return;
        }
        //验证通过,发送请求获取数据
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId=setTimeout(() => {
            this.qsearch(value);
        }, 1000);
        
    },
    //发送请求获取搜索结果的数据
    async qsearch(query){
        const goods=await request({url:"/goods/qsearch",data:{query}});
        this.setData({
            goods
        })
    },
    //取消按钮的事件
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,

            goods:[]
        })
    }

})