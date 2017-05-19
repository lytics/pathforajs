/** @module pathfora/widgets/prepare-widget */

/**
 * Validate that a widget is correctly set up
 *
 * @exports prepareWidget
 * @params {string} type
 * @params {object} config
 * @returns {object}
 */
export default function prepareWidget (type, config) {
  var props, random,
      widget = {
        valid: true
      };

  if (!config) {
    throw new Error('Config object is missing');
  }

  if (config.layout === 'random') {
    props = {
      layout: ['modal', 'slideout', 'bar', 'folding'],
      variant: ['1', '2'],
      slideout: ['bottom-left', 'bottom-right'],
      bar: ['top-absolute', 'top-fixed', 'bottom-fixed'],
      folding: ['left', 'bottom-left', 'bottom-right']
    };

    // FIXME Hard coded magical numbers, hard coded magical numbers everywhere :))
    switch (type) {
    case 'message':
      random = Math.floor(Math.random() * 4);
      config.layout = props.layout[random];
      break;
    case 'subscription':
      random = Math.floor(Math.random() * 5);
      while (random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
      break;
    case 'form':
      random = Math.floor(Math.random() * 5);
      while (random === 2 || random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
    }
    switch (config.layout) {
    case 'folding':
      config.position = props.folding[Math.floor(Math.random() * 3)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'slideout':
      config.position = props.slideout[Math.floor(Math.random() * 2)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'modal':
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      config.position = '';
      break;
    case 'bar':
      config.position = props.bar[Math.floor(Math.random() * 3)];
      break;
    case 'inline':
      config.position = 'body';
      break;
    }
  }
  widget.type = type;
  widget.config = config;

  if (!config.id) {
    throw new Error('All widgets must have an id value');
  }

  widget.id = config.id;

  return widget;
}
