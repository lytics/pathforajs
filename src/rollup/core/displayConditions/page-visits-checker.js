/** @module core/page-visits-checker */

export default function pageVisitsChecker (pageVisitsRequired) {
  return (this.pageViews >= pageVisitsRequired);
};