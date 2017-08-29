var util = require('../../utils/util.js');
var app =getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var publicUrl =app.globalData.doubanBase;
    var inTheatersUrl = publicUrl+"/v2/movie/in_theaters"+"?start=0&count=3";
    var ComingSoonUrl = publicUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = publicUrl + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(ComingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣Top250");
  },
  
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },

  getMovieListData:function(url,settedKey,categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.processDoubanData(res.data,settedKey,categoryTitle);
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  processDoubanData:function(moviesDouban,settedKey,categoryTitle){
    var moviesAll = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length>=6){
        title = title.substring(0,6)+"...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id
      }
      moviesAll.push(temp);
    };
    var readyData={};
    readyData[settedKey] = {
      categoryTitle:categoryTitle,
      movies:moviesAll
    };
    this.setData(readyData);
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