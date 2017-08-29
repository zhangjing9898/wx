var postsData = require('../../data/posts-data.js');

Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function (options) {


    this.setData({
       postList:postsData.postList
      });
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
     wx.navigateTo({
       url: 'post-detail/post-detail?id='+postId,
     })
  },
  onSwiperTap: function (event) {
    /**target 和 currentTarget 的区别
     * target 当前点击的组件 这里是image
     * currentTarget 是事件捕获的组件  这里是swiper组件
     */
    var postId = event.target.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})