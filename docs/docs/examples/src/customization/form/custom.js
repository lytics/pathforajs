var form = new pathfora.Form({
  id: 'survey',
  layout: 'slideout',
  position: 'left',
  headline: 'Please complete this survey',
  msg: 'Tell us about yourself and some of your favorite things.',
  theme: 'custom',
  formElements: [
    {
      'type': 'input',
      'name': 'name',
      'label': 'Your Name',
      'placeholder': 'Your Name',
      'required': true
    },
    {
      'type': 'select',
      'label': 'What\'s your favorite animal?',
      'placeholder': 'Select an animal...',
      'name': 'favorite_animal',
      'required': true,
      'values': [
        {
          label: 'Cat',
          value: 'cat'
        },
        {
          label: 'Dog',
          value: 'dog'
        },
        {
          label: 'Horse',
          value: 'horse'
        }
      ]
    },
    {
      type: 'radio-group',
      label: 'What\'s your favorite color?',
      name: 'favorite_color',
      required: true,
      values: [
        {
          label: 'Red',
          value: 'red'
        },
        {
          label: 'Blue',
          value: 'blue'
        },
        {
          label: 'Green',
          value: 'green'
        }
      ]
    },
    {
      type: 'checkbox-group',
      label: 'What are your favorite flavors of ice cream?',
      name: 'ice_cream_flavors',
      required: true,
      values: [
        {
          label: 'Vanilla',
          value: 'vanilla'
        },
        {
          label: 'Chocolate',
          value: 'chocolate'
        },
        {
          label: 'Strawberry',
          value: 'strawberry'
        }
      ]
    },
    {
      type: 'textarea',
      label: 'Comments',
      name: 'comments',
      placeholder: 'Any more comments?'
    }
  ]
});

var form2 = new pathfora.Form({
  id: 'terms',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Please agree to our terms',
  theme: 'custom',
  formElements: [
    {
      type: 'input',
      name: 'name',
      placeholder: 'Your Name',
      required: true
    },
    {
      type: 'checkbox-group',
      name: 'ice_cream_flavors',
      required: true,
      values: [
        {
          label: 'I agree',
          value: 'agree'
        }
      ]
    }
  ]
});

window.pathfora.initializeWidgets([form, form2]);
