// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime:'',
    content:'',
    showOneButtonDialog:false,
    oneButton: [{text: '确定'}],
    form_info: '',
    isDisable:false,
    abstract:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentTime()
  },
  // 获取当前时间
   getCurrentTime(time){
     if(!time){
       time = new Date()
     }    
    let y = time.getFullYear()
    let m = time.getMonth()+1
    m = m<10?'0'+m:m
    let d = time.getDate()
    d = d>9?d:'0'+d
    let currentTime = y+'/'+m+'/'+d
    this.setData({
      currentTime:currentTime
    })
  },
  //关闭弹窗
  tapDialogButton(e) {
    this.setData({
        showOneButtonDialog: false
    })
},
  //处理提交
  formSubmit(e){
    wx.getSetting({
      success: res => {
        if(res.authSetting['scope.userInfo']){
          if(this.data.content!=""&&e.detail.value.input!=""){
            this.setData({
              isDisable:true
            })
            const db = wx.cloud.database()
            var appInstance = getApp()
            db.collection("myBlog").add({
              data:{
                author:appInstance.globalData.userInfo.nickName,
                title:e.detail.value.input,
                content:this.data.content,
                abstract:this.data.abstract,
                createTime:new Date().getTime()
              }
            }).then(res=>{     
              this.setData({
                form_info:'',
                isDisable:false
              })  
              wx.navigateTo({
                url: 'msg?id='+res._id
              })
            }).catch(err=>{
              this.setData({
                isDisable:false
              })
              console.log(err)
              wx.showToast({
                title: err.msg         
              })
            })
            
      
          }else{
            wx.vibrateLong({
              success:(res)=>{
                this.setData({
                  showOneButtonDialog: true
              })
              },
              fail: (res) => {
                wx.vibrateLong()
              },
            })
          }
        }else{
          wx.navigateTo({
            url: '../authorization/authorization'
          })
        }
      }})    
    
  },
  bindTextAreaBlur(e){
    this.setData({
      content:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.getTabBar()){
      this.getTabBar().setData({
        selected:1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})