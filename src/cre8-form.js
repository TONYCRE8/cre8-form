window.onload = () => {
    if (window.jQuery) {
        var forms = []

        $('form').each(function () { // For some reason, () => {} doesn't work as a function here?
            
            if (config.privacy.enabled) {
                var form = {
                    'id': $(this).attr('id'),
                    'type': $(this).attr('name'),
                    'object': {
                        'jquery': $(this),
                        'dom': this
                    },
                    'fields': [],
                    'privacy': {
                        'input': $(`#${$(this).attr('id')} input[data-privacy="true"]#${config.privacy.elementID}`),
                        'valid': false,
                    },
                    'valid': false,
                    'message': $(`.${config.messages.elementClass}#complete[data-form='${$(this).attr('id')}']`),
                    'action': $(this).attr('action')
                }
            } else {
                var form = {
                    'id': $(this).attr('id'),
                    'type': $(this).attr('name'),
                    'object': {
                        'jquery': $(this),
                        'dom': this
                    },
                    'fields': [], 
                    'valid': false,
                    'message': $(`.${config.messages.elementClass}#complete[data-form='${$(this).attr('id')}']`),
                    'action': $(this).attr('action')
                }
            }
        
            forms.push(form)
            
        });
        
        var phoneInputs = [];

        /* Email send */

        const email = (form, data, php) => {
            if (phoneInputs.length < 1) {
                phoneInputs.forEach(phone => {

                    /* Format the telephone number, giving information about where the phone number is from and whether there's an extension or not. */
                    if (config.intlTelInput.enabled) {

                        var phoneData = phone.getNumber(intlTelInputUtils.numberFormat.RFC3966).slice(4)

                        if (phoneData.includes(';')) {
                            data.set(phone.a.id, phoneData.substring(0, phoneData.lastIndexOf(';')))
                        } else {
                            data.set(phone.a.id, phoneData)
                        }
                        var ext = phone.getExtension() ? phone.getExtension() : '';
                        if (ext != '') {
                            data.set('ext', ext)
                        }
                        data.set('region', phone.getSelectedCountryData().name)
                    }

                    else {

                        /* do the above, but without the intTelInput stuff */

                        data.set(input.phone.id, input.phone.value)

                    }

                })
            }

            fetch(php, {
                    method: "POST",
                    body: data,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => {
                    form.message.animate({
                        opacity: 1
                    }, 1000)
                    form.message.text(config.messages.success)
                    $('#' + form.id + ' input#submit').attr('disabled', true) /* Enable the submit button again */
                    console.log('Complete: ', response)
                    resetForm(form) /* Reset the form */
                    setTimeout(() => {
                        /* Timeout the submit message */
                        form.message.animate({
                            opacity: 0
                        }, {
                            duration: 1000,
                            complete: () => {
                                /* form.message.html('') */
                            }
                        })
                    }, 5000)
                })
                .catch(error => {
                    form.message.animate({
                        opacity: 1
                    }, 1000)
                    console.log('Error: ', error)
                    form.message.text(config.messages.error)
                    form.message.animate({
                        opacity: 0
                    }, {
                        duration: 3000,
                        complete: () => {
                            /* form.message.html('') */
                        }
                    })
                })
        }

        /* Check Valid */

        const checkValid = (form) => {
            var isTrue = form.fields.every((v) => {
                /* Set to true if every input is true */
                return v.valid === true;
            })
            if (isTrue) {
                /* and if it all is true... */
                if (config.privacy) {
                    if (form.privacy.valid || !config.privacy) {
                        /* ... and if the privacy is valid as well */
                        form.valid = true; /* then the whole form is valid */
                        $(`#${form.id} #submit`).val('Send') /* enable the send button */
                        $(`#${form.id} #submit`).attr('disabled', false)
                    } else {
                        /* ... but the privacy hasn't been accepted */
                        form.valid = false; /* form isn't valid */
                        $(`#${form.id} #submit`).val('Enter details')
                        $(`#${form.id} #submit`).attr('disabled', true)
                        $(`#${form.id} .${config.messages.elementClass}#${form.privacy.input.attr('id')}`).html('Please accept privacy terms') /* prompt to accept privacy terms */
                    }
                } else {
                    form.valid = true; /* then the whole form is valid */
                    $(`#${form.id} #submit`).val('Send') /* enable the send button */
                    $(`#${form.id} #submit`).attr('disabled', false)
                }
            } else {
                form.valid = false; /* form isn't valid */
                $(`#${form.id} #submit`).val('Enter details')
                $(`#${form.id} #submit`).attr('disabled', true)
            }
        }

        forms.forEach((form) => {

            /* Create each object */

            $('#' + form.id + ' textarea, #' + form.id + ' :text, #' + form.id + ' input[type="tel"], #' + form.id + ' input[type="date"], #' + form.id + ' :checkbox, #' + form.id + ' :radio').each(function () {
                if ($(this).attr('id') != config.privacy.elementID) {
                    /* We don't want to add the privacy input, as that input is checked after everything else is */
                    if ($(this).attr('type') == 'tel') {
                        /* telno needs to be a document element so that we can assign intlTelInput to it */
                        var object = {
                            'type': $(this).attr('type'),
                            /* i.e. text, tel, textarea, radio */
                            'id': $(this).attr('id'),
                            /* i.e. name, email, telno, subject, message */
                            'formType': form.type,
                            'element': this,
                            /* get the related javascript element */
                            'valid': null,
                            /* set to null to avoid triggering error message early */
                            'focus': false,
                            /* hasn't been focused yet */
                            'message': $(`.${config.messages.elementClass}#${$(this).attr('id')}`), /* the status message for the element. */
                            'phone': null
                        };
                    } else {
                        var object = {
                            'type': $(this).attr('type'),
                            'id': $(this).attr('id'),
                            'formType': form.type,
                            'element': $(this),
                            /* get related jquery element */
                            'valid': null,
                            'focus': false,
                            'message': $(`.${config.messages.elementClass}#${$(this).attr('id')}`)
                            /* 'errorMsg': '' */
                        };
                    }
                    form.fields.push(object) /* Push each object to the array */
                }
            });

            /* console.log(form.fields) */

            /* for each input, check if they're of particular types that only need to change on form change */
            form.fields.forEach((input) => {
                if (input.type=='tel') { /* add a phone value in it's constructor? */
                    if (config.intlTelInput.enabled) {
                        if (config.intlTelInput.geoIpLookup.enabled) {
                            input.phone = window.intlTelInput(input.element, { /* create intlTelInput on our phone input */
                                preferredCountries: config.intlTelInput.preferredCountries ? config.intlTelInput.preferredCountries : ['us', 'gb'], 
                                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                                separateDialCode: true,
                                initialCountry: "auto",
                                geoIpLookup: function(success, failure) {
                                    if (config.intlTelInput.geoIpLookup.cookie.enabled) {
                                        let country = getCookie(config.intlTelInput.geoIpLookup.cookie.name);
                                        if (country != "") {
                                            var countryCode = country
                                            success(countryCode);
                                        } else {
                                            $.get(config.intlTelInput.geoIpLookup.url, function() {}, "jsonp").always(function(resp) {
                                                var countryCode = (resp && resp.country) ? resp.country : "gb";
                                                document.cookie = config.intlTelInput.geoIpLookup.cookie.name + '=' + countryCode + ';expires'+ config.intlTelInput.geoIpLookup.cookie.duration + ';path=/'
                                                success(countryCode);
                                            });
                                        }
                                    } else {
                                        $.get(config.intlTelInput.geoIpLookup.url, function() {}, "jsonp").always(function(resp) {
                                            var countryCode = (resp && resp.country) ? resp.country : "gb";
                                            success(countryCode);
                                        });
                                    }
                                },
                            })
                        } else {
                            input.phone = window.intlTelInput(input.element, { /* create intlTelInput on our phone input */
                                preferredCountries: config.intlTelInput.preferredCountries ? config.intlTelInput.preferredCountries : ['us', 'gb'],
                                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                                separateDialCode: true,
                            })
                        }

                        phoneInputs.push(input.phone)
                    } else {
                        phoneInputs.push(input.element)
                    }
                }
                /* On change radio */
                else if (input.type == 'radio') {
                    /* Create a different validation, one that validates on change rather than on key down */
                    const validateRadio = $('input#' + input.id).on("change", (e) => {
                        e.preventDefault()

                        var radioValue = $('input#' + input.id + ':checked').val()
                        if (radioValue) {
                            /* console.log(`${input.id}: ${radioValue}`) */
                            input.element.removeClass('error')
                            input.message.css('display', 'none')
                            input.valid = true;
                        } else {
                            input.element.addClass('error')
                            input.message.css('display', 'flex')
                            input.valid = false;
                        }

                        checkValid(form)
                    })
                }
                /* On change date */
                else if (input.type == 'date') {
                    /* Create a different validation, one that validates on change rather than on key down */
                    const validateDate = $('input#' + input.id).on("change", (e) => {
                        e.preventDefault()

                        if ($('#' + input.id).is(':focus')) {
                            input.focus = true;
                        }
                        if (input.focus) {
                            var date = $(input.element).val();
                            if (date != '') {
                                input.element.removeClass('error')
                                /* Please don't ask why [0] makes it work. Although this could become a bug later. */
                                input.message.css('display', 'none')
                                input.valid = true;
                            } else {
                                input.valid = false;
                                input.message.css('display', 'flex')
                                /* input.element[0].classList.add('error') */
                                input.element.addClass('error')
                            }
                        }
                    })
                }
            })

            /* Dynamically assess each text input field */
            const validateFields = form.object.jquery.on("keyup", (e) => {
                e.preventDefault()

                /* RFC 5322 standard email regex */
                const emailRegX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

                /* RFC 3966 standard telno regex */

                const telnoRegX = /^(?=(?:\+|0{2})?(?:(?:[\(\-\)\.\/ \t\f]*\d){7,10})?(?:[\-\.\/ \t\f]?\d{2,3})(?:[\-\s]?[ext]{1,3}[\-\.\/ \t\f]?\d{1,4})?$)((?:\+|0{2})\d{0,3})?(?:[\-\.\/ \t\f]?)(\(0\d[ ]?\d{0,4}\)|\(\d{0,4}\)|\d{0,4})(?:[\-\.\/ \t\f]{0,2}\d){3,8}(?:[\-\s]?(?:x|ext)[\-\t\f ]?(\d{1,4}))?$/
                /* Name InputField */

                form.fields.forEach((input) => {
                    if ($('#' + input.id).is(':focus')) {
                        /* Check if a form item has been focused on before checking for validation */
                        input.focus = true;
                    }
                    if (input.focus) {
                        if (input.type == 'tel') {
                            /* Check if the intlTelInput is valid */
                            if (config.intlTelInput.enabled) {
                                if (input.phone.isValidNumber() /* && input.element.val() != '' */ ) {
                                    input.element.classList.remove('error')
                                    input.message.css('display', 'none')
                                    input.valid = true;
                                } else {
                                    input.valid = false;
                                    input.message.text($(input.element).data('error-msg'))
                                    input.element.classList.add('error')
                                    input.message.css('display', 'flex')
                                }
                            } else {
                                if (input.element.value != '' && telnoRegX.test(input.element.value)) {
                                    input.element.classList.remove('error')
                                    input.message.css('display', 'none')
                                    input.valid = true;
                                } else {
                                    input.valid = false;
                                    input.message.text($(input.element).data('error-msg'))
                                    input.element.classList.add('error')
                                    input.message.css('display', 'flex')
                                }
                            }
                        } else if (input.id == 'email') {
                            /* Check if it matches the RFC 5322 regex */
                            var emailFormatted = input.element.val().toLowerCase()
                            input.element.val(emailFormatted)
                            if (input.element.val() != '' && emailRegX.test(input.element.val())) {
                                input.element.removeClass('error')
                                input.message.css('display', 'none')
                                input.valid = true;
                            } else if (input.element.val() != '' && !emailRegX.test(input.element.val())) {
                                input.element.addClass('error')
                                input.message.text($(input.element).data('invalid-msg'))
                                input.message.css('display', 'flex')
                                input.valid = false;
                            } else {
                                input.element.addClass('error')
                                input.message.text($(input.element).data('error-msg'))
                                input.message.css('display', 'flex')
                                input.valid = false;
                            }
                        } else {
                            /* The general validation */
                            if (input.element.val() != '') {
                                /* if something has been entered */
                                input.element.removeClass('error') /* Get rid of the error */
                                input.message.css('display', 'none')
                                input.valid = true; /* Set that input's valid to true */
                            } else {
                                /* if nothing has been entered and it has been focused */
                                input.element.addClass('error') /* display error */
                                input.message.text($(input.element).data('error-msg'))
                                input.message.css('display', 'flex')
                                input.valid = false; /* set the valid to false */
                            }
                        }
                    }
                })

                checkValid(form) /* Run checks for the whole form */
            })

            /* Check privacy */

            const privacyCheck = form.object.jquery.on('change', (e) => {
                e.preventDefault()

                var privacyFocus = false;

                if (form.privacy.input.is(':focus')) {
                    privacyFocus = true;
                }
                if (privacyFocus) {
                    if (form.privacy.input.is(':checked')) {
                        form.privacy.input.removeClass('error')
                        $(`#${form.id} .${config.messages.elementClass}#${form.privacy.input.attr('id')}`).css('display', 'none')
                        form.privacy.valid = true;
                    } else {
                        form.privacy.input.addClass('error')
                        $(`#${form.id} .${config.messages.elementClass}#${form.privacy.input.attr('id')}`).text(form.privacy.input.data('error-msg'))
                        $(`#${form.id} .${config.messages.elementClass}#${form.privacy.input.attr('id')}`).css('display', 'flex')
                        form.privacy.valid = false;
                    }
                }

                checkValid(form)
            })

            /* When we submit the form */
            const submitEvent = form.object.jquery.on("submit", (e) => {
                e.preventDefault();

                $('#' + form.id + ' #submit').attr('disabled', true)
                /* Disable the button whilst we process the form */

                const formData = new FormData(form.object.dom)
                /* Convert the form to data */

                email(form, formData, form.action)
                /* Send the form to our email function */
            })

            form.object.jquery.on('open:countrydropdown', () => {
                $(`form#${form.id} input[type="tel"]`).addClass('active')
            })
            form.object.jquery.on('close:countrydropdown', () => {
                $(`form#${form.id} input[type="tel"]`).removeClass('active')
            })
        });

        //
        // End of for each form
        //

        /* Testing only. Remove when done. */
        $('#reset').on('click', () => {
            resetForm()
            message.html('')
        })

        const resetForm = (form) => {
            form.object.jquery.find('textarea, :text, input[type="tel"], input[type="date"], input[type="month"]').val('')
            form.object.jquery.find(':checkbox, :radio').prop('checked', false)

            /* Reset button and status message text */
            $('#' + form.id + ' #submit').val('Enter details')

            form.fields.forEach(input => {
                input.valid = false;
            });

            /* animate back up to submission message */
            if (config.messages.scrollTo) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: form.object.jquery.offset().top - 280
                }, 1000);
            }
        }

        // misc cookie stuff

        function getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }

    } else {
        console.error('cre8 form: jQuery hasn\'nt been loaded')
    }
}