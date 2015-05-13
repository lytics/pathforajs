//     Widgets object structure:
//
//    {
//      common: [<widgets array>],
//
//       set of widgets for first matching segmet will be shown
//      targeted: [
//        {
//          segment: "Best segment name",
//          widgets: [<widgets array>],
//          config: {} // [optional] configuration for this segment
//        },
//        {
//          segment: "Second segment",
//          widgets: [<widgets array>],
//          config: {} // [optional] configuration for this segment
//        },
//        {
//          segment: "all",
//          widgets: [<widgets array>],
//          config: {} // [optional] configuration for this segment
//        }
//      ]
//    }


// EXAMPLE usage:


var callback1 = function() {
    alert('form 1 submitted');
}

var callback2 = function () {
    alert('form 2 submitted');
}

var form1 = new pathfora.Form({
    msg: "Example form message",
    layout: "slideout",
    action: callback1
});

var form2 = pathfora.Form({
    msg: "Another form message",
    layout: "Modal",
    action: callback2
});

var bar = new pathfora.Bar({
    msg: 'Everyone will see me'
});

var widgets = {
    common: [bar],
    targeted: [
        {
            segment: 'smt_new',
            widgets: [form1]
        }, {
            segment: 'subscriber',
            widgets: [form2]
        }
    ]
};

var lyticsID = 1762;

var config = {
    theme: light
};

pathfora.initializeWidgets(widgets, lyticsID, config);

//optionally for initializing widgets without targeting:
//pathfora.intitializeWIdgets([bar1, form1], lyticsID, config);



// EXAMPLE 2 - displaying different welcome modal message based on segment:
var message1 = new pathfora.Message({
    msg: "Welcome to our site",
    layout: 'modal'
});

var message2 = new pathfora.Message({
    msg: "Nice to see you again",
    layout: 'modal'
});

var message3 = new pathfora.Message({
    msg: "Hi, please check our new stuff",
    layout: 'modal'
});

var widgets = {
    targeted: [{
        segment: 'smt_new',
        widgets: [message1]
    },{
        segment: 'subscriber',
        widgets: [message2]
    },{
        segment: 'all',
        widgets: [message3]
    }]
};

var lyticsId = 1762;

pathfora.initalizeWidgets(widgets, lyticsId);