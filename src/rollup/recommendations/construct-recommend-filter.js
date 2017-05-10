/** @module api/recommend/construct-recommend-filter */

export default function constructRecommendFilter (urlPat) {
  // URL pattern uses wildcards '*'
  // should not contain http protocol
  // examples:
  // www.example.com/blog/posts/*
  // www.example.com/*
  // *
  // (Note: using a single wildcard results in no filtering and can
  // potentially return any url on your website)
  return 'FILTER AND(url LIKE "' + urlPat + '") FROM content';
};