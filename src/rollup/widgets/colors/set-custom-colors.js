/** @module pathfora/widgets/colors/set-custom-colors */

import hasClass from '../../utils/class/has-class';

/**
 * Set colors for a widget with a custom theme
 * defined in the config
 *
 * @exports setCustomColors
 * @params {object} widget
 * @params {object} colors
 */
export default function setCustomColors (widget, colors) {
  var i = 0,
      close = widget.querySelector('.pf-widget-close'),
      msg = widget.querySelectorAll('.pf-widget-message'),
      headline = widget.querySelectorAll('.pf-widget-headline'),
      headlineLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-headline'),
      cancelBtn = widget.querySelectorAll('.pf-widget-btn.pf-widget-cancel'),
      okBtn = widget.querySelectorAll('.pf-widget-btn.pf-widget-ok'),
      arrow = widget.querySelector('.pf-widget-caption span'),
      arrowLeft = widget.querySelector('.pf-widget-caption-left span'),
      contentUnit = widget.querySelector('.pf-content-unit'),
      contentUnitMeta = widget.querySelector('.pf-content-unit-meta'),
      fields = widget.querySelectorAll('input, textarea, select'),
      branding = widget.querySelector('.branding svg'),
      required = widget.querySelectorAll('.pf-required-flag'),
      requiredAsterisk = widget.querySelectorAll('span.required'),
      requiredInline = widget.querySelectorAll('[data-required=true]:not(.pf-has-label)'),
      socialBtns = Array.prototype.slice.call(widget.querySelectorAll('.social-login-btn')),
      body = widget.querySelector('.pf-widget-body');

  if (colors.background) {
    if (hasClass(widget, 'pf-widget-modal')) {
      widget.querySelector('.pf-widget-content').style.setProperty('background-color', colors.background, 'important');
    } else {
      widget.style.setProperty('background-color', colors.background, 'important');
    }
  }

  if (colors.fieldBackground) {
    for (i = 0; i < fields.length; i++) {
      fields[i].style.setProperty('background-color', colors.fieldBackground, 'important');
    }
  }

  if (colors.required) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('background-color', colors.required, 'important');
      required[i].querySelector('span').style.setProperty('border-right-color', colors.required, 'important');
    }

    for (i = 0; i < requiredInline.length; i++) {
      requiredInline[i].style.setProperty('border-color', colors.required, 'important');
    }

    for (i = 0; i < requiredAsterisk.length; i++) {
      requiredAsterisk[i].style.setProperty('color', colors.required, 'important');
    }
  }

  if (colors.requiredText) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('color', colors.requiredText, 'important');
    }
  }

  if (contentUnit && contentUnitMeta) {
    if (colors.actionBackground) {
      contentUnit.style.setProperty('background-color', colors.actionBackground, 'important');
    }

    if (colors.actionText) {
      contentUnitMeta.querySelector('h4').style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.text) {
      contentUnitMeta.querySelector('p').style.setProperty('color', colors.text, 'important');
    }
  }

  if (close && colors.close) {
    close.style.setProperty('color', colors.close, 'important');
  }

  if (headline && colors.headline) {
    for (i = 0; i < headline.length; i++) {
      headline[i].style.setProperty('color', colors.headline, 'important');
    }
  }

  if (headlineLeft && colors.headline) {
    headlineLeft.style.setProperty('color', colors.headline, 'important');
  }

  if (arrow && colors.close) {
    arrow.style.setProperty('color', colors.close, 'important');
  }

  if (arrowLeft && colors.close) {
    arrowLeft.style.setProperty('color', colors.close, 'important');
  }

  if (cancelBtn) {
    for (i = 0; i < cancelBtn.length; i++) {
      if (colors.cancelText) {
        cancelBtn[i].style.setProperty('color', colors.cancelText, 'important');
      }

      if (colors.cancelBackground) {
        cancelBtn[i].style.setProperty('background-color', colors.cancelBackground, 'important');
      }
    }
  }

  if (okBtn) {
    for (i = 0; i < okBtn.length; i++) {
      if (colors.actionText) {
        okBtn[i].style.setProperty('color', colors.actionText, 'important');
      }

      if (colors.actionBackground) {
        okBtn[i].style.setProperty('background-color', colors.actionBackground, 'important');
      }
    }
  }

  if (colors.text && branding) {
    branding.style.setProperty('fill', colors.text, 'important');
  }


  socialBtns.forEach(function (btn) {
    if (colors.actionText) {
      btn.style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.actionBackground) {
      btn.style.setProperty('background-color', colors.actionBackground, 'important');
    }
  });

  if (msg && colors.text) {
    for (i = 0; i < msg.length; i++) {
      msg[i].style.setProperty('color', colors.text, 'important');
    }
  }

  if (body && colors.text) {
    body.style.setProperty('color', colors.text, 'important');
  }
}
