import resetLegacyTag from '../utils/reset-legacy-tag';

// -------------------------
//  CONTENT RECOMMENDATIONS
// -------------------------
describe('the content recommendation component', function () {
  beforeEach(function () {
    resetLegacyTag();
    jasmine.Ajax.install();
    window.lio = {};
    window.pathfora.dateOptions = {};
    pathfora.clearAll();
  });

  afterEach(function () {
    window.lio = {};
    window.liosetup = {};
    jasmine.Ajax.uninstall();
    window.pathfora.dateOptions = {};
    window.pathfora.acctid = '';
  });

  it('should handle defaults', function (done) {
    window.jstag.config.cookie = 'seerid';

    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    pathfora.acctid = 321;

    var sampleModal = new pathfora.Message({
      id: 'recommendation-modal-sample1',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: 'FILTER AND(url LIKE "www.example.com/*") FROM content'
        }
      }
    });

    pathfora.initializeWidgets([sampleModal]);

    setTimeout(function () {
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=FILTER AND(url LIKE "www.example.com/*") FROM content'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });

      done();
    }, 200);
  });

  it('should handle both the BY field and value override', function (done) {
    window.jstag.config.cookie = 'seerid';

    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    window.liosetup = window.liosetup || {};
    window.liosetup.field = 'customField';
    window.liosetup.value = 'customValue';
    pathfora.acctid = 321;

    var sampleModal = new pathfora.Message({
      id: 'recommendation-modal-sample2',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: 'FILTER AND(url LIKE "www.example.com/*") FROM content'
        }
      }
    });

    pathfora.initializeWidgets([sampleModal]);

    setTimeout(function () {
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/customField/customValue?ql=FILTER AND(url LIKE "www.example.com/*") FROM content'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });

      done();
    }, 200);
  });

  it('should handle the default lytics cookie override', function (done) {
    window.jstag.config.cookie = 'bonk';
    pathfora.utils.saveCookie('bonk', '123.bonk.override');

    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    pathfora.acctid = 321;

    var sampleModal = new pathfora.Message({
      id: 'recommendation-modal-sample3',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: 'FILTER AND(url LIKE "www.example.com/*") FROM content'
        }
      }
    });

    pathfora.initializeWidgets([sampleModal]);

    setTimeout(function () {
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/_uids/123.bonk.override?ql=FILTER AND(url LIKE "www.example.com/*") FROM content'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });

      done();
    }, 200);
  });

  it('should show recommendations returned from the api and default content if there is an error', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var modal = new pathfora.Message({
      id: 'recommendation-modal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: 'FILTER AND(url LIKE "www.example.com/*") FROM content'
        }
      }
    });

    var defaultModal = new pathfora.Message({
      id: 'recommendation-modal2',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      content: [
        {
          default: true,
          url: 'http://www.example.com/2',
          title: 'Default Title',
          description: 'Default description',
          image:
            'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg'
        }
      ],
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    // Should show default
    pathfora.initializeWidgets([defaultModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe(
      '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
    );

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 400,
      contentType: 'application/json',
      responseText:
        '{"data": null,"message": "No such account id","status": 400}'
    });

    pathfora.acctid = 321;

    // Should get and show api response
    pathfora.initializeWidgets([modal]);
    setTimeout(function () {
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=FILTER AND(url LIKE "www.example.com/*") FROM content'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });

      var widget = $('#' + modal.id);
      var widget2 = $('#' + defaultModal.id);
      expect(widget).toBeDefined();
      expect(widget2).toBeDefined();

      setTimeout(function () {
        expect(widget.hasClass('opened')).toBeTruthy();
        expect(widget2.hasClass('opened')).toBeTruthy();

        var href = widget.find('.pf-content-unit').attr('href'),
            desc = widget.find('.pf-content-unit p').text(),
            img = widget.find('.pf-content-unit-img').css('background-image'),
            title = widget.find('.pf-content-unit h4').text();

        expect(title).toBe('Example Title');
        expect(href).toBe('http://www.example.com/1');
        expect(desc).toBe('An example description');
        expect(img).toBe(
          'url("http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg")'
        );

        href = widget2.find('.pf-content-unit').attr('href');
        desc = widget2.find('.pf-content-unit p').text();
        img = widget2.find('.pf-content-unit-img').css('background-image');
        title = widget2.find('.pf-content-unit h4').text();

        expect(title).toBe('Default Title');
        expect(href).toBe('http://www.example.com/2');
        expect(desc).toBe('Default description');
        expect(img).toBe(
          'url("http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg")'
        );

        pathfora.clearAll();
        pathfora.acctid = '';
        done();
      }, 200);
    }, 100);
  });

  it('should throw errors if default content is improperly defined', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var errorModal = new pathfora.Message({
      id: 'recommendation-modal4',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    var errorModal2 = new pathfora.Message({
      id: 'recommendation-modal5',
      msg: 'A',
      variant: 3,
      layout: 'button',
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    var errorModal3 = new pathfora.Message({
      id: 'recommendation-modal6',
      msg: 'A',
      variant: 3,
      layout: 'slideout',
      recommend: {
        ql: {
          raw: '*'
        }
      },
      content: [
        {
          url: 'http://www.example.com/2',
          title: 'Default Title',
          description: 'Default description',
          image:
            'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg'
        }
      ]
    });

    // Should error since there is no default defined
    expect(function () {
      pathfora.initializeWidgets([errorModal]);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 400,
        contentType: 'application/json',
        responseText:
          '{"data": null,"message": "No such account id","status": 400}'
      });
    }).toThrow(
      new Error('Could not get recommendation and no default defined')
    );

    pathfora.acctid = 123;

    expect(function () {
      pathfora.initializeWidgets([errorModal2]);
    }).toThrow(new Error('Unsupported layout for content recommendation'));

    expect(function () {
      pathfora.initializeWidgets([errorModal3]);
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
      );

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'application/json',
        responseText:
          '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
      });
    }).toThrow(
      new Error('Cannot define recommended content unless it is a default')
    );

    done();
  });

  it('should accept segment AST definition', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var astModal = new pathfora.Message({
      id: 'ast-modal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ast: {
          args: [
            {
              ident: 'author'
            }
          ],
          op: 'exists'
        }
      }
    });

    pathfora.initializeWidgets([astModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe(
      '//api.lytics.io/api/content/recommend/321/user/_uids/123?contentsegments=[%7B%22table%22%3A%22content%22%2C%22ast%22%3A%7B%22args%22%3A%5B%7B%22ident%22%3A%22author%22%7D%5D%2C%22op%22%3A%22exists%22%7D%7D]'
    );

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText:
        '{"data":[{"url": "www.example.com/1","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
    });

    var widget = $('#' + astModal.id);
    expect(widget).toBeDefined();
    setTimeout(function () {
      expect(widget.hasClass('opened')).toBeTruthy();
      done();
    }, 200);
  });

  it('should not append protocol to relative urls', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var relativeModal = new pathfora.Message({
      id: 'relative-modal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: '*'
        }
      }
    });

    pathfora.initializeWidgets([relativeModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe(
      '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
    );

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText:
        '{"data":[{"url": "this/is/a/path","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false}]}'
    });

    var widget = $('#' + relativeModal.id);
    expect(widget).toBeDefined();

    var href = widget.find('.pf-content-unit').attr('href');
    expect(href).toBe('this/is/a/path');

    pathfora.acctid = '';
    done();
  });

  it('should account for display options for content recommendations', function (done) {
    window.pathfora.locale = 'en-US';

    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var displayModal = new pathfora.Message({
      id: 'recDisplayModal',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: '*'
        },
        display: {
          author: true,
          date: true,
          descriptionLimit: 100,
          dateOptions: {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }
        }
      }
    });

    pathfora.initializeWidgets([displayModal]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe(
      '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
    );

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText:
        '{"data":[{"url": "this/is/a/path","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false, "author": "Test Example", "created": "2017-01-01T12:22:13.283199021Z"}]}'
    });

    var widget = $('#' + displayModal.id);
    expect(widget).toBeDefined();

    var info = widget.find('.pf-content-unit-meta span.pf-content-unit-info'),
        desc = widget.find('.pf-content-unit-meta p');

    expect(info.html()).toBe('by Test Example | January 1, 2017');
    expect(desc.html().length < 103).toBeTruthy();

    var displayModal2 = new pathfora.Message({
      id: 'recDisplayModal2',
      msg: 'A',
      variant: 3,
      layout: 'modal',
      recommend: {
        ql: {
          raw: '*'
        },
        display: {
          image: false,
          description: false
        }
      }
    });

    pathfora.initializeWidgets([displayModal2]);
    expect(jasmine.Ajax.requests.mostRecent().url).toBe(
      '//api.lytics.io/api/content/recommend/321/user/_uids/123?ql=*'
    );

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 200,
      contentType: 'application/json',
      responseText:
        '{"data":[{"url": "this/is/a/path","title": "Example Title","description": "An example description","primary_image": "http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg","confidence": 0.499,"visited": false, "author": "Test Example", "created": "2017-01-01T12:22:13.283199021Z"}]}'
    });

    widget = $('#' + displayModal2.id);
    expect(widget).toBeDefined();

    var image = widget.find('.pf-content-unit-metadiv.pf-content-unit-img');
    desc = widget.find('.pf-content-unit-meta p');

    expect(desc.length).toBe(0);
    expect(image.length).toBe(0);

    pathfora.acctid = '';
    done();
  });

  it('should display a recommendation modal even if missing a description', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var modal = new pathfora.Message({
      id: 'modal1',
      layout: 'modal',
      variant: '3',
      msg: 'test',
      theme: 'custom',
      colors: {
        actionBackground: '#fff',
        actionText: '#444',
        background: '#f1f1f1',
        cancelBackground: '#f1f1f1',
        cancelText: '#bbb',
        close: '#bbb',
        headline: '#d35145',
        text: '#d35145'
      },
      recommend: {
        collection: 'blah'
      },
      content: [
        {
          url: 'https://www.getlytics.com/blog/post/know_your_data',
          title: 'test',
          default: true
        }
      ]
    });
    window.pathfora.initializeWidgets([modal]);

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'application/json',
      responseText:
        '{"data": null,"message": "Internal Server Error","status": 400}'
    });

    var widget = $('#' + modal.id);
    setTimeout(function () {
      expect(widget).toBeDefined();
      expect(widget.length).toBe(1);
      done();
    }, 200);
  });

  it('should set the colors specified to the content recommendation modal', function (done) {
    window.lio = {
      account: {
        id: '321'
      },
      loaded: true
    };

    var modal = new pathfora.Message({
      id: 'modal1',
      layout: 'modal',
      variant: '3',
      msg: 'test',
      theme: 'custom',
      colors: {
        actionBackground: '#fff',
        actionText: '#53f442',
        background: '#f1f1f1',
        cancelBackground: '#f1f1f1',
        cancelText: '#bbb',
        close: '#bbb',
        headline: '#53f442',
        text: '#d35145'
      },
      recommend: {
        collection: 'blah'
      },
      content: [
        {
          url: 'https://www.getlytics.com/blog/post/know_your_data',
          title: 'test',
          description: 'sample test content description',
          default: true
        }
      ]
    });
    window.pathfora.initializeWidgets([modal]);

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'application/json',
      responseText:
        '{"data": null,"message": "Internal Server Error","status": 400}'
    });

    setTimeout(function () {
      var widget = $('#' + modal.id),
          title = widget.find('.pf-content-unit-meta h4'),
          description = widget.find('.pf-content-unit-meta p');
      expect(title.css('color')).toBe('rgb(83, 244, 66)');
      expect(description.css('color')).toBe('rgb(211, 81, 69)');
      done();
    }, 200);
  });
});
