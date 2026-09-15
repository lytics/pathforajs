/**
 * Field schema for the playground's form mode.
 *
 * Every control is described as data rather than markup so the rules about
 * where an option applies live in one place. Those rules are not cosmetic - a
 * few of them stop the form producing a config that throws:
 *
 *   footerText  - construct-widget-layout.js sets widgetFooter.innerHTML with no
 *                 null guard, and bar/button/inline templates have no footer
 *   pushDown    - init-widget.js throws unless the layout is a top-positioned bar
 *   position    - validate-widget-position.js has no case for gate, so it
 *                 dereferences an undefined `choices`
 *   recommend   - validate-recommendation-widget.js throws for any type but
 *                 message, or any layout but modal/slideout/inline
 *
 * The rest describe options the library accepts but silently ignores, which is
 * worth hiding for a different reason: a control that does nothing is worse
 * than no control.
 */
(function () {
  'use strict';

  function layoutIn(list) {
    return function (ctx) {
      return list.indexOf(ctx.layout) !== -1;
    };
  }

  function layoutNotIn(list) {
    return function (ctx) {
      return list.indexOf(ctx.layout) === -1;
    };
  }

  function every(tests) {
    return function (ctx) {
      return tests.every(function (test) {
        return test(ctx);
      });
    };
  }

  function typeIs(type) {
    return function (ctx) {
      return ctx.type === type;
    };
  }

  // Valid positions per layout, from validate-widget-position.js. Gate and
  // inline are absent on purpose - gate throws, inline uses positionSelector.
  var POSITIONS = {
    modal: ['', 'middle-center'],
    slideout: [
      'bottom-left',
      'bottom-right',
      'left',
      'right',
      'top-left',
      'top-right',
    ],
    bar: [
      'top-absolute',
      'top-fixed',
      'bottom-fixed',
      'top-center',
      'bottom-center',
    ],
    button: [
      'left',
      'right',
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ],
  };

  // The colour keys set-custom-colors.js understands, only used with theme custom
  var COLOR_KEYS = [
    'background',
    'text',
    'headline',
    'close',
    'actionText',
    'actionBackground',
    'cancelText',
    'cancelBackground',
    'fieldBackground',
    'required',
    'requiredText',
  ];

  function colorFields() {
    return COLOR_KEYS.map(function (key) {
      return {
        key: 'colors.' + key,
        label: key,
        type: 'color',
        applies: function (ctx) {
          return ctx.config.theme === 'custom';
        },
      };
    });
  }

  function impressionFields(scope) {
    return [
      {
        key: 'displayConditions.impressions.' + scope + '.session',
        label: scope + ' session',
        type: 'number',
      },
      {
        key: 'displayConditions.impressions.' + scope + '.total',
        label: scope + ' total',
        type: 'number',
      },
      {
        key: 'displayConditions.impressions.' + scope + '.buffer',
        label: scope + ' buffer (s)',
        type: 'number',
      },
      {
        key: 'displayConditions.impressions.' + scope + '.duration',
        label: scope + ' duration (s)',
        type: 'number',
      },
    ];
  }

  function hideAfterActionFields(action) {
    return [
      {
        key: 'displayConditions.hideAfterAction.' + action + '.hideCount',
        label: action + ' hideCount',
        type: 'number',
      },
      {
        key: 'displayConditions.hideAfterAction.' + action + '.duration',
        label: action + ' duration (s)',
        type: 'number',
      },
    ];
  }

  var SECTIONS = [
    {
      title: 'Content',
      fields: [
        {
          key: 'headline',
          label: 'headline',
          type: 'text',
          applies: layoutNotIn(['bar', 'button']),
          note: 'bar and button templates have no headline element',
        },
        { key: 'msg', label: 'msg', type: 'textarea' },
        {
          key: 'image',
          label: 'image (url)',
          type: 'text',
          applies: layoutNotIn(['button']),
        },
        {
          key: 'footerText',
          label: 'footerText',
          type: 'text',
          applies: layoutIn(['modal', 'slideout', 'gate']),
          note: 'throws on bar, button and inline - no footer element',
        },
        { key: 'className', label: 'className', type: 'text' },
        { key: 'responsive', label: 'responsive', type: 'bool' },
      ],
    },

    {
      title: 'Buttons',
      fields: [
        { key: 'okShow', label: 'okShow', type: 'bool' },
        { key: 'okMessage', label: 'okMessage', type: 'text' },
        {
          key: 'cancelShow',
          label: 'cancelShow',
          type: 'bool',
          applies: function (ctx) {
            if (ctx.type === 'subscription') {
              return false;
            }
            return ['inline', 'button'].indexOf(ctx.layout) === -1;
          },
          note: 'no cancel button in subscription, inline or button templates',
        },
        {
          key: 'cancelMessage',
          label: 'cancelMessage',
          type: 'text',
          applies: function (ctx) {
            if (ctx.type === 'subscription') {
              return false;
            }
            return ['inline', 'button'].indexOf(ctx.layout) === -1;
          },
        },
      ],
    },

    {
      title: 'Placement',
      fields: [
        {
          key: 'position',
          label: 'position',
          type: 'select',
          optionsFor: function (ctx) {
            return POSITIONS[ctx.layout] || [];
          },
          applies: function (ctx) {
            return Boolean(POSITIONS[ctx.layout]);
          },
          note: 'gate has no positions - setting one throws',
        },
        {
          key: 'origin',
          label: 'origin',
          type: 'select',
          options: ['', 'bottom'],
          applies: layoutIn(['slideout']),
          note: 'only pf-origin-bottom has styles',
        },
        {
          key: 'positionSelector',
          label: 'positionSelector',
          type: 'text',
          note: 'required for inline layouts',
        },
        {
          key: 'pushDown',
          label: 'pushDown',
          type: 'text',
          applies: every([
            layoutIn(['bar']),
            function (ctx) {
              var pos = ctx.config.position;
              return pos === 'top-fixed' || pos === 'top-absolute';
            },
          ]),
          note: 'top-positioned bars only - throws otherwise',
        },
      ],
    },

    {
      title: 'Theme',
      fields: [
        {
          key: 'theme',
          label: 'theme',
          type: 'select',
          options: ['', 'light', 'dark', 'custom', 'none'],
        },
      ].concat(colorFields()),
    },

    {
      title: 'Display conditions',
      fields: [
        {
          key: 'displayConditions.showOnInit',
          label: 'showOnInit',
          type: 'bool',
        },
        {
          key: 'displayConditions.showDelay',
          label: 'showDelay (s)',
          type: 'number',
        },
        {
          key: 'displayConditions.hideAfter',
          label: 'hideAfter (s)',
          type: 'number',
        },
        {
          key: 'displayConditions.showOnExitIntent',
          label: 'showOnExitIntent',
          type: 'bool',
        },
        {
          key: 'displayConditions.displayWhenElementVisible',
          label: 'displayWhenElementVisible',
          type: 'text',
          note: 'a selector in the stage page',
        },
        {
          key: 'displayConditions.scrollPercentageToDisplay',
          label: 'scrollPercentageToDisplay',
          type: 'number',
        },
        {
          key: 'displayConditions.pageVisits',
          label: 'pageVisits',
          type: 'number',
          note: 'counts up in PathforaPageView, which Reset clears',
        },
        {
          key: 'displayConditions.manualTrigger',
          label: 'manualTrigger',
          type: 'bool',
          note: 'use the Trigger button to release it',
        },
        {
          key: 'displayConditions.showOnMissingFields',
          label: 'showOnMissingFields',
          type: 'bool',
        },
        {
          key: 'displayConditions.date.start_at',
          label: 'date start_at',
          type: 'datetime',
        },
        {
          key: 'displayConditions.date.end_at',
          label: 'date end_at',
          type: 'datetime',
        },
      ]
        .concat(impressionFields('widget'))
        .concat(impressionFields('global'))
        .concat(hideAfterActionFields('confirm'))
        .concat(hideAfterActionFields('cancel'))
        .concat(hideAfterActionFields('closed'))
        .concat([
          {
            key: 'displayConditions.urlContains',
            label: 'urlContains',
            type: 'list',
            row: [
              {
                key: 'match',
                label: 'match',
                type: 'select',
                options: ['simple', 'exact', 'string', 'regex'],
              },
              { key: 'value', label: 'value', type: 'text' },
              { key: 'exclude', label: 'exclude', type: 'bool' },
            ],
          },
          {
            key: 'displayConditions.metaContains',
            label: 'metaContains',
            type: 'list',
            row: [
              { key: 'property', label: 'property', type: 'text' },
              { key: 'name', label: 'name', type: 'text' },
              { key: 'content', label: 'content', type: 'text' },
            ],
          },
        ]),
    },

    {
      title: 'Content recommendation',
      applies: every([
        typeIs('message'),
        layoutIn(['modal', 'slideout', 'inline']),
      ]),
      intro:
        'Set at least one recommend option below - setupWidgetContentUnit only ' +
        'runs when recommend and content are both present, so a default ' +
        'document on its own renders nothing. The playground stubs the Lytics ' +
        'account, so the API returns no recommendation and the default ' +
        'document is what you will see. The docs note their own examples ' +
        'behave the same way.',
      fields: [
        { key: 'recommend.collection', label: 'collection', type: 'text' },
        {
          key: 'recommend.rollups',
          label: 'rollups',
          type: 'csv',
          note: 'comma separated',
        },
        { key: 'recommend.visited', label: 'visited', type: 'bool' },
        { key: 'recommend.shuffle', label: 'shuffle', type: 'bool' },
        {
          key: 'recommend.rank',
          label: 'rank',
          type: 'select',
          options: ['', 'popular', 'recent', 'affinity'],
        },
        { key: 'recommend.display.title', label: 'show title', type: 'bool' },
        { key: 'recommend.display.image', label: 'show image', type: 'bool' },
        {
          key: 'recommend.display.description',
          label: 'show description',
          type: 'bool',
        },
        { key: 'recommend.display.author', label: 'show author', type: 'bool' },
        { key: 'recommend.display.date', label: 'show date', type: 'bool' },
        {
          key: 'recommend.display.descriptionLimit',
          label: 'descriptionLimit',
          type: 'number',
        },
        { key: 'content.0.title', label: 'default title', type: 'text' },
        { key: 'content.0.url', label: 'default url', type: 'text' },
        {
          key: 'content.0.description',
          label: 'default description',
          type: 'textarea',
        },
        { key: 'content.0.image', label: 'default image', type: 'text' },
        { key: 'content.0.author', label: 'default author', type: 'text' },
      ],
    },

    {
      title: 'Custom form fields',
      applies: typeIs('form'),
      intro:
        'Adding any field here replaces the default form entirely - ' +
        'formElements takes over from the legacy fields, required and ' +
        'placeholders options.',
      fields: [
        {
          key: 'formElements',
          label: 'formElements',
          type: 'list',
          row: [
            {
              key: 'type',
              label: 'type',
              type: 'select',
              options: [
                'input',
                'text',
                'email',
                'date',
                'us-postal-code',
                'textarea',
                'select',
                'radio-group',
                'checkbox-group',
              ],
            },
            { key: 'name', label: 'name', type: 'text' },
            { key: 'label', label: 'label', type: 'text' },
            { key: 'placeholder', label: 'placeholder', type: 'text' },
            { key: 'required', label: 'required', type: 'bool' },
            {
              key: 'values',
              label: 'values',
              type: 'options',
              note: 'comma separated, for select and group types',
            },
          ],
        },
      ],
    },
  ];

  window.PlaygroundFields = {
    sections: SECTIONS,
    positionsFor: function (layout) {
      return POSITIONS[layout] || [];
    },
  };
}());
