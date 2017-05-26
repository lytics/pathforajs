/** @module pathfora/globals/reset-default-props */

/**
 * Reset the values of the default widget configs
 *
 * @exports resetDefaultProps
 * @params {object} obj
 * @returns {object} obj
 */
export default function resetDefaultProps (obj) {
  obj.generic = {
    className: 'pathfora',
    branding: true,
    responsive: true,
    headline: '',
    themes: {
      dark: {
        background: '#333',
        headline: '#fefefe',
        text: '#aaa',
        close: '#888',
        actionText: '#fff',
        actionBackground: '#444',
        cancelText: '#888',
        cancelBackground: '#333'
      },
      light: {
        background: '#f1f1f1',
        headline: '#444',
        text: '#888',
        close: '#bbb',
        actionText: '#444',
        actionBackground: '#fff',
        cancelText: '#bbb',
        cancelBackground: '#f1f1f1'
      }
    },
    displayConditions: {
      showOnInit: true,
      showOnExitIntent: false,
      showDelay: 0,
      hideAfter: 0,
      displayWhenElementVisible: '',
      scrollPercentageToDisplay: 0
    }
  };

  obj.message = {
    layout: 'modal',
    position: '',
    variant: '1',
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  };

  obj.subscription = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      email: 'Email'
    },
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  };

  obj.form = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      company: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Send',
    okShow: true,
    cancelMessage: 'Cancel',
    cancelShow: true,
    showSocialLogin: false
  };


  obj.sitegate = {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      message: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Submit',
    okShow: true,
    cancelShow: false,
    showSocialLogin: false,
    showForm: true
  };

  return obj;
}
