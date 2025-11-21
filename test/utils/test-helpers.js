// ============================================================================
// Test Helpers for PathforaJS
// ============================================================================
// This file contains helper functions to reduce repetition in tests by
// providing common patterns for widget creation, setup, assertions, and more.
// ============================================================================
// Note: pathfora is available as a global variable in the test environment

// ============================================================================
// WIDGET FACTORY HELPERS
// ============================================================================

/**
 * Create a Message widget with default test configuration
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Message widget instance
 */
export function createMessageWidget(overrides = {}) {
  const defaults = {
    id: 'test-message-' + Date.now() + Math.random(),
    msg: 'Test message',
    layout: 'modal',
    headline: 'Test Headline'
  };
  return new pathfora.Message({ ...defaults, ...overrides });
}

/**
 * Create a Form widget with default test configuration
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Form widget instance
 */
export function createFormWidget(overrides = {}) {
  const defaults = {
    id: 'test-form-' + Date.now() + Math.random(),
    msg: 'Test form message',
    layout: 'modal',
    headline: 'Test Form'
  };
  return new pathfora.Form({ ...defaults, ...overrides });
}

/**
 * Create a Subscription widget with default test configuration
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Subscription widget instance
 */
export function createSubscriptionWidget(overrides = {}) {
  const defaults = {
    id: 'test-subscription-' + Date.now() + Math.random(),
    msg: 'Subscribe to our newsletter',
    layout: 'slideout',
    headline: 'Stay Updated'
  };
  return new pathfora.Subscription({ ...defaults, ...overrides });
}

/**
 * Create a SiteGate widget with default test configuration
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} SiteGate widget instance
 */
export function createSiteGateWidget(overrides = {}) {
  const defaults = {
    id: 'test-gate-' + Date.now() + Math.random(),
    headline: 'Welcome!',
    msg: 'Please provide your email to continue'
  };
  return new pathfora.SiteGate({ ...defaults, ...overrides });
}

/**
 * Create form elements array with common test fields
 * @param {string} type - Type of form elements ('basic', 'complex', 'custom')
 * @param {Array} customFields - Custom fields to add
 * @returns {Array} Form elements configuration
 */
export function createFormElements(type = 'basic', customFields = []) {
  const formElements = {
    basic: [
      {
        type: 'input',
        name: 'name',
        placeholder: 'Your Name',
        required: true
      },
      {
        type: 'email',
        name: 'email',
        placeholder: 'Email Address',
        required: true
      }
    ],
    complex: [
      {
        type: 'input',
        name: 'name',
        placeholder: 'Your Name',
        required: true
      },
      {
        type: 'email',
        name: 'email',
        placeholder: 'Email Address',
        required: true
      },
      {
        type: 'radio-group',
        label: "What's your favorite color?",
        name: 'favorite_color',
        required: true,
        values: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' }
        ]
      },
      {
        type: 'checkbox-group',
        label: 'Select your interests',
        name: 'interests',
        values: [
          { label: 'Technology', value: 'tech' },
          { label: 'Design', value: 'design' },
          { label: 'Marketing', value: 'marketing' }
        ]
      }
    ],
    custom: customFields
  };

  return formElements[type] || formElements.basic;
}

/**
 * Create widget with callback actions
 * @param {Function} WidgetConstructor - Widget constructor (e.g., pathfora.Message)
 * @param {Function} confirmCallback - Confirm action callback
 * @param {Function} cancelCallback - Cancel action callback
 * @param {Object} overrides - Additional widget properties
 * @returns {Object} Widget instance with callbacks
 */
export function createWidgetWithCallbacks(WidgetConstructor, confirmCallback, cancelCallback, overrides = {}) {
  const config = {
    id: 'test-widget-callbacks-' + Date.now() + Math.random(),
    msg: 'Test message with callbacks',
    layout: 'modal',
    ...overrides
  };

  if (confirmCallback) {
    config.confirmAction = {
      name: 'Test confirm action',
      callback: confirmCallback
    };
  }

  if (cancelCallback) {
    config.cancelAction = {
      name: 'Test cancel action',
      callback: cancelCallback
    };
  }

  return new WidgetConstructor(config);
}

// ============================================================================
// SETUP AND MOCKING HELPERS
// ============================================================================

/**
 * Setup Lytics lio object with test data
 * @param {Array} segments - Array of segment names
 * @param {string} accountId - Account ID
 * @param {Object} additionalData - Additional data to merge into lio.data
 */
export function setupLioMock(segments = ['all'], accountId = '0', additionalData = {}) {
  window.lio = {
    data: {
      segments: segments,
      ...additionalData
    },
    account: {
      id: accountId
    },
    loaded: true
  };
}

/**
 * Setup jstag mock with user entity data
 * @param {Object} userData - User data object
 * @param {string} cid - Client ID
 */
export function setupJstagMock(userData = {}, cid = '123') {
  window.jstag.getEntity = function () {
    return {
      data: {
        user: userData
      }
    };
  };
  window.jstag.config.cid = cid;
}

/**
 * Setup jstag tracking spy
 * @returns {Object} Jasmine spy object
 */
export function setupTrackingSpy() {
  return spyOn(window.jstag, 'send');
}

/**
 * Mock AJAX response for recommendation widgets
 * @param {Array} recommendations - Array of recommendation objects
 * @returns {Object} Mock response object
 */
export function mockRecommendationResponse(recommendations = []) {
  const defaultRecommendation = {
    url: 'www.example.com/1',
    title: 'Example Title',
    description: 'An example description',
    primary_image: 'http://images.all-free-download.com/images/graphiclarge/blue_envelope_icon_vector_281117.jpg',
    confidence: 0.499,
    visited: false
  };

  const data = recommendations.length > 0 ? recommendations : [defaultRecommendation];

  return {
    status: 200,
    contentType: 'application/json',
    responseText: JSON.stringify({ data: data })
  };
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Assert that a widget is visible in the DOM
 * @param {string} widgetId - Widget ID
 */
export function expectWidgetVisible(widgetId) {
  const widget = $('#' + widgetId);
  expect(widget.length).toBe(1);
  expect(widget.hasClass('opened')).toBeTruthy();
}

/**
 * Assert that a widget is not visible in the DOM
 * @param {string} widgetId - Widget ID
 */
export function expectWidgetHidden(widgetId) {
  const widget = $('#' + widgetId);
  expect(widget.length).toBe(0);
}

/**
 * Assert that a widget is not currently shown (closed)
 * @param {string} widgetId - Widget ID
 */
export function expectWidgetClosed(widgetId) {
  const widget = $('#' + widgetId);
  expect(widget.hasClass('opened')).toBeFalsy();
}

/**
 * Assert that a tracking event was sent
 * @param {string} widgetId - Widget ID
 * @param {string} eventType - Event type (show, confirm, cancel, close)
 * @param {string} eventName - Optional action name
 * @param {Object} additionalProps - Additional properties to check
 */
export function expectTrackingEvent(widgetId, eventType, eventName = null, additionalProps = {}) {
  const expected = {
    'pf-widget-id': widgetId,
    'pf-widget-event': eventType,
    ...additionalProps
  };

  if (eventName) {
    expected['pf-widget-action'] = eventName;
  }

  expect(window.jstag.send).toHaveBeenCalledWith(
    jasmine.objectContaining(expected)
  );
}

/**
 * Assert widget content matches expected values
 * @param {string} widgetId - Widget ID
 * @param {Object} content - Object with headline and/or msg properties
 */
export function expectWidgetContent(widgetId, content) {
  const widget = $('#' + widgetId);

  if (content.headline !== undefined) {
    const headline = widget.find('.pf-widget-headline');
    expect(headline.html()).toBe(content.headline);
  }

  if (content.msg !== undefined) {
    const message = widget.find('.pf-widget-message');
    expect(message.html()).toBe(content.msg);
  }
}

/**
 * Assert widget has expected theme class
 * @param {string} widgetId - Widget ID
 * @param {string} theme - Theme name (dark, light, custom)
 */
export function expectWidgetTheme(widgetId, theme) {
  const widget = $('#' + widgetId);
  expect(widget.hasClass('pf-theme-' + theme)).toBeTruthy();
}

/**
 * Assert widget has expected layout class
 * @param {string} widgetId - Widget ID
 * @param {string} layout - Layout name (modal, slideout, bar, button, inline)
 */
export function expectWidgetLayout(widgetId, layout) {
  const widget = $('#' + widgetId);
  expect(widget.hasClass('pf-widget-' + layout)).toBeTruthy();
}

/**
 * Assert form validation errors are displayed
 * @param {string} widgetId - Widget ID
 * @param {number} expectedErrorCount - Expected number of required fields with errors
 */
export function expectFormValidationErrors(widgetId, expectedErrorCount) {
  const widget = $('#' + widgetId);
  const required = widget.find('[data-required=true]');
  expect(required.length).toBe(expectedErrorCount);

  for (let i = 0; i < required.length; i++) {
    const parent = required[i].parentNode;
    expect(parent.className.indexOf('pf-form-required') !== -1).toBeTruthy();
    expect(parent.className.indexOf('invalid') !== -1).toBeTruthy();
  }
}

/**
 * Assert form has expected number of fields
 * @param {string} widgetId - Widget ID
 * @param {Object} fieldCounts - Object with counts for different field types
 */
export function expectFormFields(widgetId, fieldCounts) {
  const widget = $('#' + widgetId);
  const form = widget.find('form');

  if (fieldCounts.inputs !== undefined) {
    expect(form.find('input[type="text"]').length).toBe(fieldCounts.inputs);
  }

  if (fieldCounts.emails !== undefined) {
    expect(form.find('input[type="email"]').length).toBe(fieldCounts.emails);
  }

  if (fieldCounts.radios !== undefined) {
    expect(form.find('input[type="radio"]').length).toBeGreaterThanOrEqual(fieldCounts.radios);
  }

  if (fieldCounts.checkboxes !== undefined) {
    expect(form.find('input[type="checkbox"]').length).toBeGreaterThanOrEqual(fieldCounts.checkboxes);
  }
}

// ============================================================================
// ASYNC TESTING HELPERS
// ============================================================================

/**
 * Wait for widget to be rendered in the DOM
 * @param {string} widgetId - Widget ID
 * @param {number} delay - Delay in milliseconds (default: 200)
 * @returns {Promise} Promise that resolves with jQuery element
 */
export function waitForWidget(widgetId, delay = 200) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve($('#' + widgetId));
    }, delay);
  });
}

/**
 * Wait for a condition to be true
 * @param {Function} condition - Function that returns true when condition is met
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 1000)
 * @param {number} interval - Check interval in milliseconds (default: 50)
 * @returns {Promise} Promise that resolves when condition is met
 */
export function waitFor(condition, timeout = 1000, interval = 50) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

/**
 * Initialize widgets and wait for them to render (for async/await tests)
 * @param {Array|Object} widgets - Widget(s) to initialize
 * @param {Object} config - Optional config object
 * @param {number} delay - Delay to wait after initialization (default: 200)
 * @returns {Promise} Promise that resolves after delay
 */
export function initializeAndWait(widgets, config = null, delay = 200) {
  return new Promise(resolve => {
    if (config) {
      pathfora.initializeWidgets(widgets, config);
    } else {
      pathfora.initializeWidgets(widgets);
    }

    setTimeout(resolve, delay);
  });
}

// ============================================================================
// FORM INTERACTION HELPERS
// ============================================================================

/**
 * Fill form fields with provided data
 * @param {string} widgetId - Widget ID
 * @param {Object} formData - Object with field names as keys and values
 */
export function fillForm(widgetId, formData) {
  const widget = $('#' + widgetId);
  const form = widget.find('form');

  Object.keys(formData).forEach(name => {
    const field = form.find('[name="' + name + '"]');
    if (field.attr('type') === 'checkbox' || field.attr('type') === 'radio') {
      // For radio/checkbox, check the one with matching value
      form.find('[name="' + name + '"][value="' + formData[name] + '"]').prop('checked', true);
    } else {
      field.val(formData[name]);
    }
  });
}

/**
 * Fill and submit a form
 * @param {string} widgetId - Widget ID
 * @param {Object} formData - Object with field names as keys and values
 */
export function fillAndSubmitForm(widgetId, formData) {
  fillForm(widgetId, formData);

  const widget = $('#' + widgetId);
  widget.find('.pf-widget-ok').click();
}

/**
 * Get widget jQuery element
 * @param {string} widgetId - Widget ID
 * @returns {Object} jQuery element
 */
export function getWidget(widgetId) {
  return $('#' + widgetId);
}

/**
 * Click widget button by class
 * @param {string} widgetId - Widget ID
 * @param {string} buttonClass - Button class (e.g., 'pf-widget-ok', 'pf-widget-cancel', 'pf-widget-close')
 */
export function clickWidgetButton(widgetId, buttonClass) {
  const widget = $('#' + widgetId);
  widget.find('.' + buttonClass).click();
}

// ============================================================================
// WIDGET INTERACTION SHORTCUTS
// ============================================================================

/**
 * Click the confirm/OK button on a widget
 * @param {string} widgetId - Widget ID
 */
export function confirmWidget(widgetId) {
  clickWidgetButton(widgetId, 'pf-widget-ok');
}

/**
 * Click the cancel button on a widget
 * @param {string} widgetId - Widget ID
 */
export function cancelWidget(widgetId) {
  clickWidgetButton(widgetId, 'pf-widget-cancel');
}

/**
 * Click the close button on a widget
 * @param {string} widgetId - Widget ID
 */
export function closeWidget(widgetId) {
  clickWidgetButton(widgetId, 'pf-widget-close');
}
