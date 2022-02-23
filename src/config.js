var config = {
    // defaults
    privacy: {
        enabled: true,
        elementID: 'privacy'
    },
    messages: {
        elementClass: 'status-message',
        success: 'Thank you very much! We\'ve got your message and will be in touch with you soon.',
        error: 'Sorry, something went wrong. Try refreshing and filling out the form again.',
        scrollTo: false // If you want the page to scroll up after submission
    },
    intlTelInput: {
        enabled: true, // disabling this will default to using RFC 3966 as validation.
        preferredCountries: ['gb', 'us', 'ca'], // used with intlTelInput
        geoIpLookup: { // find out more here: https://github.com/jackocnr/intl-tel-input#initialisation-options
            enabled: false,
            cookie: {
                enabled: true,
                name: 'country',
                duration: 7
            },
            url: ''
        }
    },

}