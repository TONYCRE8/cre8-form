var config = {
    // defaults
    privacy: {
        enabled: true, // whether you want the privacy check to be enabled or not, this is useful for complying with gdpr
        elementID: 'privacy' // id for any privacy checkbox related elements.
    },
    messages: {
        elementClass: 'status-message', // the id for any validation messages on your forms
        success: 'Thank you very much! We\'ve got your message and will be in touch with you soon.', // a success message for the end of the form
        error: 'Sorry, something went wrong. Try refreshing and filling out the form again.', // a failure message for the end of the form
        scrollTo: false // If you want the page to scroll up after submission
    },
    intlTelInput: {
        enabled: true, // disabling this will default to using RFC 3966 as validation.
        preferredCountries: ['gb', 'us', 'ca'], // used with intlTelInput
        geoIpLookup: { // find out more here: https://github.com/jackocnr/intl-tel-input#initialisation-options
            enabled: false,
            cookie: { // if geoIpLookup is enabled, you also have the option to store the geoiplookup response in a cookie, so avoid making further calls later.
                enabled: false,
                name: 'country',
                duration: 7
            },
            url: ''
        }
    },

}