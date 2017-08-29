var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // console.log(postData);
    //如果在onload方法中不是异步的去执行一个一个数据保定，不需要使用setData（）,只需要给this.data赋值就可以了
    this.setData({
      postData: postData
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic : true
      })
    }
    this.setMusicMonitor();
  },

  setMusicMonitor:function(){
    /*事件监听函数 */
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    }) 
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },

  /*点击收藏 */
  onCollectionTap: function (event) {
    this.getPostsCollectedSyc();
  },

  /**异步 用的时候很少，不推荐 */
  getPostsCollectedAsy: function (event) {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        //取反
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        // this.showModal(postCollected, postsCollected);
        that.showToast(postCollected, postsCollected);
      }
    })
  },

  /**同步 */
  getPostsCollectedSyc: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    //取反
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // this.showModal(postCollected, postsCollected);
    this.showToast(postCollected, postsCollected);
  },

  showModal: function (postCollected, postsCollected) {
    var that = this;
    wx.showModal({
      title: postCollected ? '收藏' : '取消收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章?',
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      success: function (res) {
        if (res.confirm) {
          //更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        } else {

        }
      }
    });
  },
  showToast: function (postCollected, postsCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      icon: 'success',
      duration: 1000,
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onShareTap: function (event) {
    var itemList = ["分享给微信好友",
      "分享到朋友圈",
      "分享到微博"]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "red",
      success: function (res) {
        wx.showModal({
          title: '用户分享到了' + itemList[res.tapIndex],
          content: '现在展示无法实现分享功能',
        })
      },
    })
  },

  onMusicTap: function () {
    var isPlayigMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postDataMusic = postsData.postList[currentPostId].music;
    if (isPlayigMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postDataMusic.url,
        title: postDataMusic.title,
        coverImgUrl: postDataMusic.coverImg
      });
      this.setData({
        isPlayingMusic: true
      })
    }
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