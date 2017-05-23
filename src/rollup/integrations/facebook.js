/** @module pathfora/integrations/facebook */

// globals
import { templates, pathforaDataObject } from '../globals/config';

// dom
import window from '../dom/window';
import document from '../dom/document';

// integrations
import onFacebookLoad from './on-facebook-load';

/**
 * Initialize facebook tag and set up social login
 * button template
 *
 * @exports integrateWithFacebook
 * @params {string} appId
 */
export default function integrateWithFacebook (appId) {
  if (appId !== '') {
    var btn = templates.social.facebookBtn.replace(
      /(\{){2}facebook-icon(\}){2}/gm,
      templates.assets.facebookIcon
    );

    var parseFBLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='fb-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.5',
        status: true,
        cookie: true
      });

      onFacebookLoad();
    };

    // NOTE API initialization
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    parseFBLoginTemplate(templates.form);
    parseFBLoginTemplate(templates.sitegate);

    pathforaDataObject.socialNetworks.facebookAppId = appId;
  }
}
