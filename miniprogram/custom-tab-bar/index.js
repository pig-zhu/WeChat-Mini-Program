Component({
  data: {
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/icon_component.png",
      selectedIconPath: "/images/icon_component_HL.png",
      color:"#3cc51f",
      text: "首页"
    }, {
      pagePath: "/pages/publish/publish",
      iconPath: "/images/icon_API.png",
      selectedIconPath: "/images/icon_API_HL.png",
      color: "#7A7E83",
      text: "发布"
    },{
      pagePath: "/pages/mine/mine",
      iconPath: "/images/icon_API.png",
      selectedIconPath: "/images/icon_API_HL.png",
      color: "#7A7E83",
      text: "我的"
    }],
    selected:0
  },
  attached() {
  },
  methods: {
    tabChange(e) {
      const data = e.detail
      const url = data.item.pagePath
      wx.switchTab({url})      
      // let a = new Date().getTime()
//       wx.cloud.callFunction({
//         name:'getCurrentTime',
//         success: res=>{
//           console.log(res)
//         }
// ,      })
    }
  }
})