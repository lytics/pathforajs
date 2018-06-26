/** @module pathfora/widgets/recommendation/setup-widget-content-unit */

// globals
import { PF_LOCALE, PF_DATE_OPTIONS, DEFAULT_CHAR_LIMIT, DEFAULT_CHAR_LIMIT_STACK } from '../../globals/config';

// dom
import window from '../../dom/window';
import document from '../../dom/document';

/**
 * Setup HTML for a widget with content recommendations
 *
 * @exports setupWidgetContentUnit
 * @params {object} widget
 * @params {object} config
 */
export default function setupWidgetContentUnit (widget, config) {
  var widgetContentUnit = widget.querySelector('.pf-content-unit'),
      settings = config.recommend;

  if (config.recommend && config.content) {
    // Make sure we have content to get
    if (Object.keys(config.content).length > 0) {

      // The top recommendation should be default if we couldn't
      // get one from the api
      var rec = config.content[0],
          recImage = document.createElement('div'),
          recMeta = document.createElement('div'),
          recTitle = document.createElement('h4'),
          recDesc = document.createElement('p'),
          recInfo = document.createElement('span');

      widgetContentUnit.href = rec.url;

      // image div
      if (rec.image && (!settings.display || settings.display.image !== false)) {
        recImage.className = 'pf-content-unit-img';
        recImage.style.backgroundImage = "url('" + rec.image + "')";
        widgetContentUnit.appendChild(recImage);
      }

      recMeta.className = 'pf-content-unit-meta';

      // title h4
      if (rec.title && (!settings.display || settings.display.title !== false)) {
        recTitle.innerHTML = rec.title;
        recMeta.appendChild(recTitle);
      }

      if (rec.author && (settings.display && settings.display.author === true)) {
        recInfo.innerHTML = 'by ' + rec.author;
      }

      if (rec.date && (settings.display && settings.display.date === true)) {
        var published = new Date(rec.date),
            locale = settings.display.locale,
            dateOptions = settings.display.dateOptions;

        if (!locale && window.pathfora && window.pathfora.locale) {
          locale = window.pathfora.locale;
        } else if (!locale) {
          locale = PF_LOCALE;
        }

        if (!dateOptions && window.pathfora && window.pathfora.dateOptions) {
          dateOptions = window.pathfora.dateOptions;
        } else if (!dateOptions) {
          dateOptions = PF_DATE_OPTIONS;
        }

        published = published.toLocaleDateString(locale, dateOptions);

        if (!recInfo.innerHTML) {
          recInfo.innerHTML = published;
        } else {
          recInfo.innerHTML += ' | ' + published;
        }
      }

      if (recInfo.innerHTML) {
        recInfo.className = 'pf-content-unit-info';
        recMeta.appendChild(recInfo);
      }

      // description p
      if (rec.description && (!settings.display || settings.display.description !== false)) {
        var desc = rec.description,
            limit = config.layout === 'modal' ? DEFAULT_CHAR_LIMIT : DEFAULT_CHAR_LIMIT_STACK;


        // set the default character limit for descriptions
        if (!settings.display) {
          settings.display = {
            descriptionLimit: limit
          };
        } else if (!settings.display.descriptionLimit) {
          settings.display.descriptionLimit = limit;
        }

        if (desc.length > settings.display.descriptionLimit && settings.display.descriptionLimit !== -1) {
          desc = desc.substring(0, settings.display.descriptionLimit);
          desc = desc.substring(0, desc.lastIndexOf(' ')) + '...';
        }

        recDesc.innerHTML = desc;
        recMeta.appendChild(recDesc);
      }

      widgetContentUnit.appendChild(recMeta);
    }
  }
}
