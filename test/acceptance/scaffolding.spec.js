import globalReset from '../utils/global-reset';

// -------------------------
// SCAFFOLDING
// -------------------------
describe('when building a scaffolding component', function () {
  beforeEach(function () {
    globalReset();
  });

  it('should create an empty widget config with empty target and inverse arrays ready for construction', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.exclude.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert widget into config after building and inserting into scaffold', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester = new pathfora.Message({
      id: 'tester123',
      headline: 'Sample Insert',
      msg: 'Sample insert message.',
      layout: 'slideout',
      position: 'bottom-right',
      variant: '1',
      okShow: true,
      cancelShow: true,
      theme: 'dark',
      titleField: false,
      nameField: false,
      emailField: false,
      msgField: false
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester, scaffold);

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe('smt_new');
    expect(scaffold.target[0].widgets.length).toBe(1);
    expect(scaffold.target[0].widgets[0].type).toBe('message');
    expect(scaffold.target[0].widgets[0].config.headline).toBe('Sample Insert');
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = new pathfora.Message({
      id: 'tester123',
      headline: 'Sample Insert',
      msg: 'Sample insert message.',
      layout: 'slideout',
      position: 'bottom-right',
      variant: '1',
      okShow: true,
      theme: 'dark'
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester1, scaffold);

    var tester2 = new pathfora.Form({
      id: 'tester456',
      headline: 'Sample Insert Two',
      msg: 'Sample insert message two.',
      layout: 'slideout',
      position: 'bottom-right',
      variant: '1',
      theme: 'dark',
      titleField: true,
      nameField: true,
      emailField: true
    });
    pathfora.utils.insertWidget('target', 'smt_new', tester2, scaffold);

    expect(scaffold.target.length).toBe(1);
    expect(scaffold.target[0].segment).toBe('smt_new');
    expect(scaffold.target[0].widgets.length).toBe(2);
    expect(scaffold.target[0].widgets[0].type).toBe('message');
    expect(scaffold.target[0].widgets[0].config.headline).toBe('Sample Insert');
    expect(scaffold.target[0].widgets[1].type).toBe('form');
    expect(scaffold.target[0].widgets[1].config.headline).toBe(
      'Sample Insert Two'
    );
    expect(scaffold.target[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.inverse.length).toBe(0);
  });

  it('should insert multiple widgets into config binding to the same segment but excluding', function () {
    var scaffold = pathfora.utils.initWidgetScaffold();

    var tester1 = new pathfora.Message({
      id: 'tester123',
      headline: 'Sample Insert',
      msg: 'Sample insert message.',
      layout: 'slideout',
      position: 'bottom-right',
      variant: 1,
      okShow: true,
      theme: 'dark'
    });

    pathfora.utils.insertWidget('exclude', 'smt_new', tester1, scaffold);

    var tester2 = new pathfora.Form({
      id: 'tester456',
      headline: 'Sample Insert Two',
      msg: 'Sample insert message two.',
      layout: 'slideout',
      position: 'bottom-right',
      variant: 1,
      theme: 'dark',
      titleField: true,
      nameField: true,
      emailField: true
    });

    pathfora.utils.insertWidget('exclude', 'smt_new', tester2, scaffold);

    expect(scaffold.exclude.length).toBe(1);
    expect(scaffold.exclude[0].segment).toBe('smt_new');
    expect(scaffold.exclude[0].widgets.length).toBe(2);
    expect(scaffold.exclude[0].widgets[0].type).toBe('message');
    expect(scaffold.exclude[0].widgets[0].config.headline).toBe(
      'Sample Insert'
    );
    expect(scaffold.exclude[0].widgets[1].type).toBe('form');
    expect(scaffold.exclude[0].widgets[1].config.headline).toBe(
      'Sample Insert Two'
    );
    expect(scaffold.exclude[0].widgets[1].config.titleField).toBe(true);
    expect(scaffold.target.length).toBe(0);
    expect(scaffold.inverse.length).toBe(0);
  });
});
