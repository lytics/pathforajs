var module = new pathfora.Message({
  id: 'modal-content-recommend',
  layout: 'modal',
  headline: 'Check This Out!',
  msg: 'Based on your interests we think you will like this content.',
  variant: 3,
  recommend: {
    visited: false,
    collection: 'fd98201f51523a59fd28d422a667281b',
  },
  content: [
    {
      url: 'https://www.lytics.com/blog/adapting-to-a-post-third-party-cookie-world-navigating-the-shift-with-third-party-data-and-dynamic-consumer-identity-strategies/',
      title:
        'Adapting to a post-third-party cookie world: Navigating the shift with third-party data and dynamic consumer identity strategies',
      description:
        'In 2024, the digital landscape is undergoing significant transformation due to the phase-out of third-party cookies, which were once central to tracking consumer behavior across various online platforms. This shift necessitates the adoption of new technologies and strategies for maintaining a comprehensive view of consumer activities and preferences.',
      image:
        'https://s3.us-east-2.amazonaws.com/lytics.com/wp-content/uploads/2024/03/04232206/article-adapting_post_third_party_cookie_world-1-MAINTITLE.jpg',
      default: true,
    },
  ],
  cancelShow: false,
  okShow: false,
});

pathfora.initializeWidgets([module]);
