# CRE8 FORM

A contact form powered by jQuery, built to dynamically handle all forms on any given page.

## Usage

This tool as it stands is only compatible with submission forms (contact forms, newsletter registrations, etc) and is not built to work with systems like account logins.

With each form, there is a general form structure you should keep with this plugin to ensure you don't run into any problems. A tool is being worked on for you to create forms online and export them as html code.

### Config

There is a default [`config.js`](https://github.com/TONYCRE8/cre8-form/blob/main/src/config.js) file that you can make changes to, in order to make adjustment to the way that the tool functions. Each of the props does the following:

#### Privacy

Enables the forcing of the privacy check value. If done, you will need to create a checkbox input with the id `privacy`, and add `data-privacy="true"` to the input element as well. You can see an example of this done in the [examples](https://github.com/TONYCRE8/cre8-form/tree/main/examples).

#### Messages

Messages contains all of the default strings and other message related values. The `elementClass` prop within this object will be the default message class for validation messages. The `success` and `error` props are for success and error messages respectively. And finally, the `scrollTo` prop will simply define if you want the page to scroll to the top of the form when the form has been submitted.

#### intTelInput

This object contains all related configurables for the intlTelInput plugin made by [@jackocnr](https://github.com/jackocnr). Enabling it will add the intellisense onto any tel inputs. The `preferredCountries` prop is an array, containing area codes for which countries should appear at the top of the drop-down list. And the `geoIpLookup` object contains two props relating to the geoIpLookup option provided in intlTelInput. One of these is `enabled`, which will enable the option for looking up IPs. The other is `url`, which is the fetch url for whatever api you are using to grab their IP. For more info, take a look at the [intlTelInput documention](https://github.com/jackocnr/intl-tel-input#initialisation-options).

### Forms

Each form element should have a `POST` method, and also contain it's post `action`, even if the action is in the same script (i.e. writing `action="contact.php"` in the `contact.php` script). It should also have an `id` and a `name` value.

For GDPR and privacy reasons, forms should have an input to ask for permission from users to store information entered into the form. This is where the privacy check comes in. If an input is labelled with the name or id of `privacy`, it will register as a privacy input, and not be stored in the forms fields. It will be used as a check after every other field in the form has been validated. After privacy is then checked, the submit button will be re-enabled. In case someone removes the disabled attribute on the submit button via inspect element, you should always:

1. Add styles to prevent submission (i.e. [pointer events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)).
2. Validate data during post (see [src/validate_form.php](https://github.com/TONYCRE8/cre8-form/blob/main/src/validate_form.php) as an example).
3. Any other methods you can think of to prevent manipulation of data.

You can disable the privacy option in the config. But it's recommended that you only do this for unimportant forms where you are not taking any personal information from someone.

### Inputs

If you do add multiple forms onto a page, try to diversify the names and ids on the inputs. Each input needs a name and id that are preferrably the same. The plugin should be able to handle multiple forms, but if you have two instances of the id "name" for example, you might run into issues when validating the form. Using prefixes like `contact_name` vs `newsletter_name` might be a good way of separating the two and ensuring the forms are handled correctly.

[Every input should have a label](https://www.w3.org/WAI/tutorials/forms/labels/), all except for the submit button. Each input should also have a name and an id, prefferably ones that are the same (i.e. `name="email" id="email"`).

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" placeholder="My name is..." data-error-msg="Please enter your name">
```

Each input, aside from Telephone numbers, are stored in the following manner:

```js

{
    'type': $(this).attr('type'),
    'id': $(this).attr('id'),
    'formType': form.type,
    'element': $(this),
    'valid': null,
    'focus': false,
    'message': $(`.${config.messages.elementClass}#${$(this).attr('id')}`)
}

```

Telephone numbers are stored differently than any other value. There are slight changes to help handle the [intlTelInput](https://github.com/TONYCRE8/cre8-form#intltelinput) plugin work correctly. They store the element as a dom element rather than a jquery element for compatability's sake, and also have a phone object that the intlTelInput will be attached to.

```js

{
    // ... other default values
    'element': this,
    'phone': null
}

```

The privacy input has a quirk with it's formatting in terms of HTML structure. It's best to surround the input with it's label, otherwise you might click on the label for one form's privacy input, and be taken to a privacy input further up the page. By wrapping the input in a label, this issue is avoided.

```html
<label id="privacy"><input type='checkbox' name="privacy" id="privacy" data-privacy="true" data-error-msg="Please accept our privacy terms">
    I am happy for [insert company] to use the personal data provided above to contact me regarding my query.</label>        
</div>
```

### Validation

#### Messages

To show validation messages, you should put a `p` element with the class name found in `config.message.elementClass`, with an id of the input it's validation is for.

The entire form should also have a `config.message.elementClass`, with an id of `complete` and a value of `data-form` set to the name of the form.

The input itself should have a `data-error-msg` value that shows what the validation message should be. Some inputs, like emails, should also contain a `data-invalid-msg` value.

Whilst inputs like text, dates and radios are all handled very basically. Inputs like emails and telephone numbers are handled in a better way to remove any and all exploits.

#### Email

Email addresses are checked against [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) standards. This is to make sure that the address is an actual valid email address. 

```js
"RFC 5322": /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
```

#### Tel

Tel inputs use [intlTelInput](https://github.com/TONYCRE8/cre8-form#intltelinput), which has it's own validation method. If you'd prefer, you can always check against [RFC 3966](https://datatracker.ietf.org/doc/html/rfc3966) regex. 

Depending on the [config](https://github.com/TONYCRE8/cre8-form#config) settings, the telephone number will either be handled by [intlTelInput](https://github.com/TONYCRE8/cre8-form#intltelinput) validation, or it will be checked against [RFC 3966](https://datatracker.ietf.org/doc/html/rfc3966) regex. The first is arguably the stronger of the two, since it is built to handle all types of phone numbers, and will change it's validation based on what area code is selected. The latter is just a standard regex check, as you can see below.

```js
"RFC 3966": /^(?=(?:\+|0{2})?(?:(?:[\(\-\)\.\/ \t\f]*\d){7,10})?(?:[\-\.\/ \t\f]?\d{2,3})(?:[\-\s]?[ext]{1,3}[\-\.\/ \t\f]?\d{1,4})?$)((?:\+|0{2})\d{0,3})?(?:[\-\.\/ \t\f]?)(\(0\d[ ]?\d{0,4}\)|\(\d{0,4}\)|\d{0,4})(?:[\-\.\/ \t\f]{0,2}\d){3,8}(?:[\-\s]?(?:x|ext)[\-\t\f ]?(\d{1,4}))?$/
```

### Example

An example of a contact form for example, would look like this:

```html
<h2 class="status-message" id="complete" data-form="contact"></h2>
<section class="section end">
    <form method='POST' name='contact' id="contact" action="contact-us.php">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" placeholder="My name is..." data-error-msg="Please enter your name">
        <p class="status-message" id="name"></p>
        <label for="email">Email</label>
        <input type="text" name="email" id="email" placeholder="my_email@address.com..." data-invalid-msg="Please enter a valid email address" data-error-msg="Please enter your email"> 
        <p class="status-message" id="email"></p>
        <label for="telno">Phone Number</label>
        <div style="margin-bottom: 8px; width: 100%;"><input type="tel" name="telno" id="telno" data-error-msg="Please enter your phone number"></div> 
        <p class="status-message" id="telno"></p>
        <label for="subject">Subject</label>
        <input type="text" name="subject" id="subject" placeholder="What are you getting in touch about?.." data-error-msg="Please enter a subject line"> 
        <p class="status-message" id="subject"></p>
        <label for="message">Message</label>
        <textarea type="text" name="message" id="message" placeholder="Tell us in a little more detail..." data-error-msg="Please enter a detailed message"></textarea>
        <p class="status-message" id="message"></p>
        <div style="margin: 16px 0 8px 0;">        
        <label id="privacy"><input type='checkbox' name="privacy" id="privacy" data-privacy="true" data-error-msg="Please accept our privacy terms">
            I am happy for [insert company] to use the personal data provided above to contact me regarding my query.</label>        
        </div>
        <p class="status-message" id="privacy"></p>
        <p>Please note: This is a privacy notice, just to give the user more information about how you store their data. You should direct them to some form of privacy policy after which.</p>
        <input type="submit" id="submit" disabled>
    </form>
</section>
```

The rest of this example can be found in the [contact php example folder](https://github.com/TONYCRE8/cre8-form/tree/main/examples/contact%20php), which includes some php code as well.

There is also a PHP script included in the src, called `validate_form.php`. This script is an example script that you can use to help verify all of your data on the backend too, before processing any of it.

---

## Dependencies

Dependencies are not stored in this package like a npm project. Rather, you will need to reference the required dependencies somewhere within your files, either through CDN or through installing the files you need. Links to some of the needed files have been provided below.

### jQuery

jQuery is a requirement for this build. The current version being used is `3.3.1`, but there shouldn't be any issues with you using a more updated `3.x` or `3.3.x` version. If there are, please [create an issue](https://github.com/TONYCRE8/cre8-form/issues).

### intlTelInput

Within this build, there is functionality for [intlTelInput](https://github.com/jackocnr/intl-tel-input), which is used to handle telephone inputs. You'll need to download the [minified version](https://github.com/jackocnr/intl-tel-input/blob/master/build/js/intlTelInput.min.js) of this code in order for the telephone handling to work.