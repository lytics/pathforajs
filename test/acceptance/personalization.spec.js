import globalReset from '../utils/global-reset';

// -------------------------
// INLINE PERSONALIZATION TEST
// -------------------------
describe('Inline Personalization', function () {
  beforeEach(function () {
    globalReset();
  });

  // -------------------------
  // TRIGGER ELEMENTS
  // -------------------------
  describe('pftrigger elements', function () {
    it('should select to show the first matching element per group', function (done) {
      window.lio = {
        data: {
          segments: ['all', 'high_value', 'email', 'smt_new'],
        },
        account: {
          id: '0',
        },
        loaded: true,
      };

      $(document.body).append(
        '<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="smt_new">New</div>'
      );

      $(document.body).append(
        '<div data-pfgroup="testgrp2" data-pftrigger="high_momentum">High Momentum</div>' +
          '<div data-pfgroup="testgrp2" data-pftrigger="email">Has Email</div>' +
          '<div data-pfgroup="testgrp2" data-pftrigger="default">Default</div>'
      );

      window.pathfora.inline.procElements();

      var grp1hide = $('[data-pfgroup="testgrp"][data-pftrigger]'),
        grp2hide = $('[data-pfgroup="testgrp2"][data-pftrigger]'),
        grp1show = $('[data-pfgroup="testgrp"][data-pfmodified="true"]'),
        grp2show = $('[data-pfgroup="testgrp2"][data-pfmodified="true"]');

      expect(grp1show.length).toBe(1);
      expect(grp2show.length).toBe(1);
      expect(grp1show.text()).toBe('High Value');
      expect(grp2show.text()).toBe('Has Email');
      expect(grp1show.css('display')).toBe('block');
      expect(grp2show.css('display')).toBe('block');

      expect(grp1hide.length).toBe(2);
      expect(grp2hide.length).toBe(2);
      expect(grp1hide.css('display')).toBe('none');
      expect(grp2hide.css('display')).toBe('none');

      $('[data-pfgroup="testgrp"], [data-pfgroup="testgrp2"]').remove();
      done();
    });

    it('should select to show the default if none of the triggers match', function (done) {
      window.lio = {
        data: {
          segments: ['all', 'email'],
        },
        account: {
          id: '0',
        },
        loaded: true,
      };

      $(document.body).append(
        '<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="default">Default</div>'
      );

      window.pathfora.inline.procElements();

      var def = $('[data-pfmodified="true"]'),
        hidden = $('[data-pftrigger]');

      expect(def.length).toBe(1);
      expect(def.text()).toBe('Default');
      expect(def.css('display')).toBe('block');

      expect(hidden.length).toBe(2);
      expect(hidden.css('display')).toBe('none');

      $('[data-pfgroup="testgrp"]').remove();
      done();
    });

    it('should not interfere with pathfora targeting', function (done) {
      window.lio = {
        data: {
          segments: ['all', 'portlanders', 'email'],
        },
        account: {
          id: '0',
        },
        loaded: true,
      };

      $(document.body).append(
        '<div data-pfgroup="testgrp" data-pftrigger="high_value">High Value</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="portlanders">Portlander</div>' +
          '<div data-pfgroup="testgrp" data-pftrigger="email">Has Email</div>'
      );

      var testModule = new pathfora.Message({
        id: '9ec53f71a1514339bb1552280ae76682',
        layout: 'slideout',
        msg: 'show this to people with an email',
      });

      var testModule2 = new pathfora.Message({
        id: 'ba6a6df43f774d769058950969b07a16',
        layout: 'slideout',
        msg: 'show this to people without an email',
      });

      var widgets = {
        target: [
          {
            segment: 'email',
            widgets: [testModule],
          },
        ],
        inverse: [testModule2],
      };

      pathfora.initializeWidgets(widgets);
      window.pathfora.inline.procElements();

      var shown = $('[data-pfmodified="true"]'),
        hidden = $('[data-pftrigger]'),
        w1 = $('#' + testModule.id),
        w2 = $('#' + testModule2.id);

      expect(shown.length).toBe(1);
      expect(shown.text()).toBe('Portlander');
      expect(shown.css('display')).toBe('block');

      expect(hidden.length).toBe(2);
      expect(hidden.css('display')).toBe('none');

      expect(w1.length).toBe(1);
      expect(w2.length).toBe(0);

      $('[data-pfgroup="testgrp"]').remove();
      done();
    });
  });

  // -------------------------
  // RECOMMENDATION ELEMENTS
  // -------------------------
  describe('pfrecommend elements', function () {
    beforeEach(function () {
      pathfora.acctid = 123;
      jasmine.Ajax.install();
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
    });

    it('should fill pftype elements with content recommendation data', function (done) {
      window.pathfora.locale = 'en-US';

      $(document.body).append(
        '<div data-pfblock="group1" data-pfrecommend="my_collection">' +
          '<img data-pftype="image" alt="My Image">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
          '<p data-pftype="published"></p>' +
          '<p data-pftype="author"></p>' +
          '<p data-pftype="description"></p>' +
          '</div><div data-pfblock="group1" data-pfrecommend="default"></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","created": "2013-03-13T06:21:00Z","author": "Test User","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}',
      });

      var rec = $('[data-pfmodified="true"]'),
        recImage = rec.find('[data-pftype="image"]'),
        recUrl = rec.find('[data-pftype="url"]'),
        recTitle = rec.find('[data-pftype="title"]'),
        recDesc = rec.find('[data-pftype="description"]'),
        recDate = rec.find('[data-pftype="published"]'),
        recAuthor = rec.find('[data-pftype="author"]'),
        def = $('[data-pfrecommend="default"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');
      expect(recImage.attr('src')).toBe(
        'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg'
      );
      expect(recUrl.attr('href')).toBe('http://www.example.com/1');
      expect(recTitle.text()).toBe('Example Title');
      expect(recDesc.text()).toBe('An example description');
      expect(recAuthor.text()).toBe('Test User');

      var date = recDate.text().split('/');
      expect(date.length).toBe(3);
      expect(date[0]).toBe('3');
      expect(date[2]).toBe('2013');

      expect(def.length).toBe(1);
      expect(def.css('display')).toBe('none');

      $('[data-pfblock="group1"]').remove();
      done();
    });

    it('should show the default content if invalid response from API', function (done) {
      $(document.body).append(
        '<div data-pfblock="group2" data-pfrecommend="bad_collection">' +
          '<img data-pftype="image" alt="My Image">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
          '<p data-pftype="description"></p>' +
          '</div><div data-pfblock="group2" data-pfrecommend="default"></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=bad_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 400,
        contentType: 'application/json',
        responseText:
          '{"data": null,"message": "No such account id","status": 400}',
      });

      var def = $('[data-pfmodified="true"]'),
        bad = $('[data-pfrecommend="bad_collection"]');

      expect(def.length).toBe(1);
      expect(def.css('display')).toBe('block');

      expect(bad.length).toBe(1);
      expect(bad.css('display')).toBe('none');

      $('[data-pfblock="group2"]').remove();
      done();
    });

    it('should set the background image of a div with pfdatatype image or the innerHtml of a div with pfdatatype url', function (done) {
      $(document.body).append(
        '<div data-pfblock="group3" data-pfrecommend="my_collection">' +
          '<div data-pftype="image"></div>' +
          '<div data-pftype="url"></div></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}',
      });

      var rec = $('[data-pfmodified="true"]'),
        recImage = rec.find('[data-pftype="image"]'),
        recUrl = rec.find('[data-pftype="url"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');
      expect(recImage.css('background-image')).toBe(
        'url("http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg")'
      );
      expect(recUrl.html()).toBe('http://www.example.com/1');

      $('[data-pfblock="group3"]').remove();
      done();
    });

    it('should recognize date formatting set by the user', function (done) {
      pathfora.locale = 'en-GB';
      pathfora.dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      $(document.body).append(
        '<div data-pfblock="group3" data-pfrecommend="my_collection">' +
          '<div data-pftype="image"></div>' +
          '<div data-pftype="published"></div>' +
          '<div data-pftype="url"></div></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","created": "2016-10-08T01:24:04.23095283Z","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}',
      });

      var rec = $('[data-pfmodified="true"]'),
        recPublished = rec.find('[data-pftype="published"]');

      expect(rec.length).toBe(1);
      expect(rec.css('display')).toBe('block');

      var date = recPublished.html().split(' ');
      expect(date.length).toBe(4);
      expect(date[2]).toBe('October');
      expect(date[3]).toBe('2016');

      $('[data-pfblock="group3"]').remove();
      done();
    });

    it('should return docs from the same response for multiple recommendations with the same filter (no repeat docs)', function (done) {
      $(document.body).append(
        '<div data-pfblock="group4" data-pfrecommend="my_collection">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
          '</div><div data-pfblock="group5" data-pfrecommend="my_collection">' +
          '<h2 data-pftype="title"></h2>' +
          '<div data-pftype="url"></div></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false},' +
          '{"url": "www.example.com/2","title": "Another Example Title","description": "An second example description","primary_image": "image2.jpg","confidence": 0.23334,"visited": false}]}',
      });

      var recs = $('[data-pfmodified="true"]');
      expect(recs.length).toBe(2);

      var rec1 = $(recs[0]),
        rec1Title = rec1.find('[data-pftype="title"]'),
        rec1Url = rec1.find('[data-pftype="url"]');

      expect(rec1.css('display')).toBe('block');
      expect(rec1Title.text()).toBe('Example Title');
      expect(rec1Url.attr('href')).toBe('http://www.example.com/1');

      var rec2 = $(recs[1]),
        rec2Title = rec2.find('[data-pftype="title"]'),
        rec2Url = rec2.find('[data-pftype="url"]');

      expect(rec2.css('display')).toBe('block');
      expect(rec2Title.text()).toBe('Another Example Title');
      expect(rec2Url.html()).toBe('http://www.example.com/2');

      $('[data-pfblock="group4"], [data-pfblock="group5"]').remove();
      done();
    });

    it('should recognize the data-pfshuffle attribute', function (done) {
      $(document.body).append(
        '<div data-pfblock="group1" data-pfrecommend="my_collection2" data-pfshuffle="true">' +
          '<img data-pftype="image" alt="My Image">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a>' +
          '<p data-pftype="published"></p>' +
          '<p data-pftype="author"></p>' +
          '<p data-pftype="description"></p>' +
          '</div><div data-pfblock="group1" data-pfrecommend="default"></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection2&shuffle=true'
      );

      $('[data-pfblock="group1"]').remove();
      done();
    });

    it('should not conflict with segment trigger groups', function (done) {
      window.lio = {
        data: {
          segments: ['all', 'high_value', 'email', 'smt_new'],
        },
        account: {
          id: '0',
        },
      };

      $(document.body).append(
        '<div data-pfgroup="seg1" data-pftrigger="high_value" data-pfblock="block1" data-pfrecommend="my_collection">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a></div>' +
          '<div data-pfblock="block1" data-pfrecommend="default">default block1</div>' +
          '<div data-pfgroup="seg1" data-pftrigger="default">default seg1</div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data": null,"message": "No such account id","status": 400}',
      });

      var elems = $('[data-pfmodified="true"]');
      expect(elems.length).toBe(2);

      var elem1 = $(elems[0]);
      expect(elem1.css('display')).toBe('none');
      expect(elem1.attr('data-pfblock')).toBe('block1');
      expect(elem1.attr('data-pfrecommend')).toBe('my_collection');

      var elem2 = $(elems[1]);
      expect(elem2.css('display')).toBe('block');
      expect(elem2.html()).toBe('default block1');

      $('[data-pfgroup="seg1"], [data-pfblock="block1"]').remove();

      $(document.body).append(
        '<div data-pfgroup="seg2" data-pftrigger="blah">in blah seg2</div>' +
          '<div data-pfgroup="seg2" data-pftrigger="high_value">in high_value seg2</div>' +
          '<div data-pfgroup="seg2" data-pftrigger="default" data-pfblock="block2" data-pfrecommend="my_collection">' +
          '<a data-pftype="url"><h2 data-pftype="title"></h2></a></div>'
      );

      pathfora.inline.procElements();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        'https://c.lytics.io/api/content/recommend/123/user/_uids/123?contentsegment=my_collection'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}',
      });

      elems = $('[data-pfmodified="true"]');
      expect(elems.length).toBe(2);

      elem1 = $(elems[0]);
      expect(elem1.css('display')).toBe('block');
      expect(elem1.html()).toBe('in high_value seg2');

      elem2 = $(elems[1]);
      expect(elem2.css('display')).toBe('none');
      expect(elem2.attr('data-pfblock')).toBe('block2');

      $('[data-pfgroup="seg2"], [data-pfblock="block2"]').remove();
      done();
    });
  });
});
