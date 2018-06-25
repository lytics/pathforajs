export default function hasRecommend (widget) {
  return widget.recommend && Object.keys(widget.recommend).length !== 0;
}
