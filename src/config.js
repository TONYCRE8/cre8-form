var config = {
    // defaults
    privacy: true,
    messages: {
        elementClass: 'status-message',
        success: 'Thank you very much! We\'ve got your message and will be in touch with you soon.',
        reject: 'Sorry, something went wrong. Try refreshing and filling out the form again.'
    },
    intlTelInput: {
        enabled: true, // disabling this will default to using RFC 3966 as validation.
        preferred_countries: ['gb', 'us', 'ca'], // used with intlTelInput
        autolocation: { // find out more here: https://github.com/jackocnr/intl-tel-input#initialisation-options
            enabled: false,
            url: ''
        }
    },

}