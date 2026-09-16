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

  function typeIn(list) {
    return function (ctx) {
      return list.indexOf(ctx.type) !== -1;
    };
  }

  // The Lytics managed audiences on the demo account the stage's tag points
  // at (aid 6262), hardcoded because reading them live would mean keeping an
  // API key somewhere. Free text is still accepted, for a custom audience or
  // any other account.
  var MANAGED_AUDIENCES = [
    { value: 'all', label: 'All' },
    { value: 'anonymous_profiles', label: 'Anonymous Profiles' },
    { value: 'anonymous_profiles_30_days', label: 'Anonymous Profiles - 30 days' },
    { value: 'anonymous_profiles_60_days', label: 'Anonymous Profiles - 60 days' },
    { value: 'anonymous_profiles_90_days', label: 'Anonymous Profiles - 90 days' },
    { value: 'default_unhealthy_profiles', label: 'Unhealthy Profiles' },
    { value: 'smt_new', label: 'Lytics New' },
    { value: 'smt_active', label: 'Lytics Currently Engaged' },
    { value: 'smt_power', label: 'Lytics Highly Engaged' },
    { value: 'smt_inactive', label: 'Lytics Previously Engaged' },
    { value: 'smt_dormant', label: 'Lytics Disengaged' },
    { value: 'smt_unscored', label: 'Lytics Unscored' },
    { value: 'ly_has_visited_web', label: 'Web Activity: Has Visited Web' },
    { value: 'ly_has_visited_mobile_web', label: 'Web Activity: Has Visited Mobile Web' },
    { value: 'ly_single_page_visitor', label: 'Web Activity: Single Page Visitor' },
    { value: 'ly_multi_session_visitor', label: 'Web Activity: Multi Session Visitor' },
    { value: 'ly_from_email', label: 'Campaign Referral Interactions: Email' },
    { value: 'ly_from_paid', label: 'Campaign Referral Interactions: Paid' },
    { value: 'ly_from_social', label: 'Campaign Referral Interactions: Social' },
    { value: 'ly_uses_desktop', label: 'Browser / OS: Desktop' },
    { value: 'ly_uses_mobile', label: 'Browser / OS: Mobile' },
    { value: 'ly_uses_ios', label: 'Browser / OS: iOS' },
    { value: 'ly_uses_android', label: 'Browser / OS: Android' },
    { value: 'ly_uses_other', label: 'Browser / OS: Other' },
    { value: 'ly_us_visitor', label: 'Location: US Visitors' },
    { value: 'ly_international_visitor', label: 'Location: International Visitors' },
    { value: 'ly_first_time_visitor', label: 'Engagement: First-time Visitors' },
    { value: 'ly_repeat_visitor', label: 'Engagement: Repeat Visitors' },
    { value: 'ly_casual_visitor', label: 'Engagement: Casual Visitors' },
    { value: 'ly_moderately_engaged_visitor', label: 'Engagement: Moderately Engaged Visitors' },
    { value: 'ly_deeply_engaged_users', label: 'Engagement: Deeply Engaged Users' },
    { value: 'ly_known_email', label: 'Email Capture Status: Known Email' },
    { value: 'ly_unknown_email', label: 'Email Capture Status: Unknown Email' },
    { value: 'ly_peruser', label: 'Behavior: Perusers' },
    { value: 'ly_binge_user', label: 'Behavior: Binge Users' },
    { value: 'ly_at_risk', label: 'Behavior: At Risk Users' },
    { value: 'ly_infrequent_user', label: 'Behavior: Infrequent Users' },
    { value: 'ly_moderately_frequent_user', label: 'Behavior: Moderately Frequent Users' },
    { value: 'ly_frequent_user', label: 'Behavior: Frequent Users' },
    { value: 'ly_reporting_last_visit_within_day', label: 'Last Visit Within A Day' },
    { value: 'ly_reporting_last_visit_within_week', label: 'Last Visit Within A Week' },
    { value: 'ly_reporting_last_visit_within_month', label: 'Last Visit Within A Month' },
    { value: 'ly_reporting_last_visit_within_3_months', label: 'Last Visit Within 3 Months' },
    { value: 'ly_reporting_single_page_visitor', label: 'Single Page Visitor' },
    { value: 'ly_reporting_multi_session_visitor', label: 'Multi Session Visitor' },
    { value: 'ly_reporting_has_visited_web', label: 'Has Visited Web' },
    { value: 'ly_reporting_has_visited_mobile_web', label: 'Has Visited Mobile Web' },
    { value: 'ly_reporting_from_facebook', label: 'Facebook' },
    { value: 'ly_reporting_from_google', label: 'Google' },
    { value: 'ly_reporting_from_email', label: 'Email' },
    { value: 'ly_reporting_from_paid', label: 'Paid' },
    { value: 'ly_reporting_from_social', label: 'Social' },
    { value: 'ly_reporting_casual_visitors', label: 'Casual Visitors' },
    { value: 'ly_reporting_deeply_engaged_users', label: 'Deeply Engaged Users' },
    { value: 'ly_reporting_infrequent_users', label: 'Infrequent Users' },
    { value: 'ly_reporting_frequent_users', label: 'Frequent Users' },
  ];

  // The Lytics managed content collections on the same demo account. Hardcoded
  // for the same reason as the audiences above - reading them live would mean
  // keeping an API key somewhere. Free text is still accepted.
  var MANAGED_COLLECTIONS = [
    {
      value: 'default_recommendations',
      label: 'Default Recommendation Collection',
    },
    { value: 'all_documents', label: 'All Documents' },
    { value: 'all_documents_with_images', label: 'Documents With Images' },
    {
      value: 'recently_classified_documents',
      label: 'Recently Classified Documents',
    },
  ];

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

  function formStateFields(state, defaults) {
    return [
      {
        key: 'formStates.' + state + '.headline',
        label: state + ' headline',
        type: 'text',
        note: 'defaults to "' + defaults.headline + '"',
      },
      {
        key: 'formStates.' + state + '.msg',
        label: state + ' msg',
        type: 'textarea',
      },
      {
        key: 'formStates.' + state + '.delay',
        label: state + ' delay (s)',
        type: 'number',
        note: 'defaults to 3; use 0 to keep it open',
      },
      {
        key: 'formStates.' + state + '.okShow',
        label: state + ' okShow',
        type: 'bool',
      },
      {
        key: 'formStates.' + state + '.okMessage',
        label: state + ' okMessage',
        type: 'text',
      },
      {
        key: 'formStates.' + state + '.cancelShow',
        label: state + ' cancelShow',
        type: 'bool',
      },
      {
        key: 'formStates.' + state + '.cancelMessage',
        label: state + ' cancelMessage',
        type: 'text',
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
      requiresTag: true,
      applies: every([
        typeIs('message'),
        layoutIn(['modal', 'slideout', 'inline']),
      ]),
      intro:
        'Set at least one recommend option below - setupWidgetContentUnit only ' +
        'runs when recommend and content are both present, so a default ' +
        'document on its own renders nothing. Without the Lytics tag switched ' +
        'on there is no account to call, so the default document is what ' +
        'renders; with the tag on, the recommendation API is called for real ' +
        'and the default is the fallback.',
      fields: [
        {
          key: 'recommend.collection',
          label: 'collection',
          type: 'datalist',
          optionsFor: function () {
            return MANAGED_COLLECTIONS;
          },
          note: "the account's Lytics managed collections, or type any slug",
        },
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
    {
      title: 'Form states',
      applies: every([
        typeIn(['form', 'subscription']),
        layoutIn(['modal', 'slideout', 'gate', 'inline']),
      ]),
      intro:
        'Shown after a submit. Bar layouts are excluded because ' +
        'constructWidgetLayout never builds the state elements for them, so a ' +
        'bar with formStates just blanks for a few seconds. The error state ' +
        'only ever fires for a confirmAction with waitForAsyncResponse, which ' +
        'needs a callback - use the simulate control to see it.',
      fields: [
        {
          key: 'simulateSubmit',
          label: 'simulate submit outcome',
          type: 'select',
          options: ['', 'success', 'error'],
          note: 'adds a waitForAsyncResponse confirmAction to the config',
        },
      ]
        .concat(
          formStateFields('success', { headline: 'Thank You' })
        )
        .concat(formStateFields('error', { headline: 'Error' })),
    },
    {
      title: 'Audience',
      requiresTag: true,
      intro:
        'Targeted widgets go in through the object form of initializeWidgets, ' +
        'and the segment is matched against the visitor\'s own memberships - ' +
        'so this only does anything with the Lytics tag switched on. Without ' +
        'it the only segment that matches is "all". Targeting a segment the ' +
        'visitor is not in is sometimes the point: the widget then correctly ' +
        'renders nothing.',
      fields: [
        {
          key: 'targetSegment',
          label: 'show to segment',
          type: 'datalist',
          // reveals the exclude field below. Only rebuilds the form once the
          // value settles on change, not on every keystroke.
          structural: true,
          optionsFor: function () {
            return [{ value: '*', label: 'everyone' }].concat(
              MANAGED_AUDIENCES
            );
          },
          note: 'the account\'s Lytics managed audiences, or type any slug',
        },
        {
          key: 'excludeSegment',
          label: 'but not to segment',
          type: 'datalist',
          optionsFor: function () {
            return MANAGED_AUDIENCES;
          },
          // Hidden until there is something to subtract from:
          // initTargetedWidgets only removes exclusions from the widgets a
          // target already matched, so on its own an exclusion matches nothing
          // and the widget never renders. Confirmed against the SDK, not
          // assumed.
          applies: function (ctx) {
            return Boolean(ctx.config.targetSegment);
          },
          note: 'subtracts from the segment above',
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
