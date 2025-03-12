var module = new pathfora.Message({
  id: 'slideout-content-recommend',
  layout: 'slideout',
  headline: 'Check This Out!',
  msg: 'Based on your interests we think you will like this content.',
  variant: 3,
  recommend: {
    rank: 'popular',
    collection: 'fd98201f51523a59fd28d422a667281b',
  },
  content: [
    {
      url: 'https://www.lytics.com/blog/personalization-with-precision-the-next-era-of-cpg-marketing/',
      title: 'Personalization with precision: The next era of CPG marketing',
      description:
        'Marketing for mass appeal is a relic of traditional CPG engagement strategies — especially when we know better (and can do better). Modern businesses already have the data they need to personalize with context, more easily, and more meaningfully than has ever been possible.',
      image:
        'https://s3.us-east-2.amazonaws.com/lytics.com/wp-content/uploads/2023/07/17231530/precise_personalization_cpgs.jpg',
      default: true,
    },
  ],
  cancelShow: false,
  okShow: false,
});

pathfora.initializeWidgets([module]);
