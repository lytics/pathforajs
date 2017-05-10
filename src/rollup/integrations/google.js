/** @module pathfora/integrations/google */

import window from '../dom/window'
import document from '../dom/document'
import { templates, pathforaDataObject } from '../globals/config'
import onGoogleLoad from './on-google-load'

export default function integrateWithGoogle (clientId) {
  if (clientId !== '') {
    var head = document.querySelector('head');

    var appMetaTag = templates.social.googleMeta.replace(
      /(\{){2}google-clientId(\}){2}/gm,
      clientId
    );

    var btn = templates.social.googleBtn.replace(
      /(\{){2}google-icon(\}){2}/gm,
      templates.assets.googleIcon
    );

    var parseGoogleLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='google-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    head.innerHTML += appMetaTag;

    window.___gcfg = {
      parsetags: 'onload'
    };

    window.pathforaGoogleOnLoad = onGoogleLoad;

    // NOTE Google API
    (function () {
      var s, po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/platform.js?onload=pathforaGoogleOnLoad';
      s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    }());

    pathforaDataObject.socialNetworks.googleClientID = clientId;
    parseGoogleLoginTemplate(templates.form);
    parseGoogleLoginTemplate(templates.sitegate);
  }
};