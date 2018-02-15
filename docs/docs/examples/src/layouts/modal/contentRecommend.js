var module = new pathfora.Message({
  id: 'modal-content-recommend',
  layout: 'modal',
  headline: 'Check This Out!',
  msg: 'Based on your interests we think you will like this content.',
  variant: 3,
  recommend: {
    visited: false,
    collection: 'bb5ecbeadb9e572d66cd83d62d3dcd09'
  },
  content: [
    {
      url: 'https://www.getlytics.com/blog/post/know_your_data',
      title: 'Are You Making the Most of Your First-Party Data?',
      description: 'Making sense of your first-party data can lead to killer remarketing advantages. Learn more about how the data you collect already can supercharge your ad campaign performance.',
      image: 'https://www.getlytics.com/img/blog/posts/know_your_data/know_your_data-bg.jpg',
      default: true
    }
  ],
  cancelShow: false,
  okShow: false
});

pathfora.initializeWidgets([module]);
