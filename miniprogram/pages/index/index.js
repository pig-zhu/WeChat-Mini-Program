//index.js
const app = getApp()
const db = wx.cloud.database()
Page({  
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    one:'#007aff',
    two:'',
    three:"",
    imgList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    newsList: []
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },


  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onShow: function () {
    this.getNewsList()
    if(this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },
  onLoad: function() {
     this.onGetOpenid()
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
            }
          })
        }else{
          wx.navigateTo({
            url: '../authorization/authorization'
          })
        }
      }
    }) 
    this.getPhoto()
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },
  clickMe: function(data){    //首页点击底部按钮
    if(data.currentTarget.id=="home"){
      this.setData({
        one:"#007aff",
        two:"#000",
        three:"#000"
      })
      wx.redirectTo({
        url: '../index/index',
      })
    }else if(data.currentTarget.id=="shoppingCar"){
      this.setData({
        one:"#000",
        two:"#007aff",
        three:"#000"
      })
      wx.redirectTo({
        url: '../publish/publish',
      })
    }else{
      this.setData({
        one:"#000",
        two:"#000",
        three:"#007aff"
      })
      
    }
  },
  //获取轮播图图片
  getPhoto: function () {    
    db.collection('photo')
    .get().then(res=>{
      this.setData({
        imgList: res.data
      })
    })
  },
  //获取文章数据
  getNewsList(){
    db.collection('myBlog').where({
      _openid:app.globalData.openid
    }).orderBy('createTime','desc').get().then(res=>{
      let arr = res.data.splice(0,3)
      arr.forEach(ele=>{
        let time = new Date(ele.createTime)
        ele.createTime = time.toLocaleDateString()+"  "+time.toLocaleTimeString()
      })
      this.setData({
        newsList:arr
      })
    })
  },

  //查看文章详情
  toNewsDetail(item){
    wx.navigateTo({
      url: '../newsDetail/newsDetail?id='+item.currentTarget.id,
    })
  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
