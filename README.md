# CRE8 FORM

A contact form powered by jQuery, built to dynamically handle all forms on any given page.

## Usage

There is a general form structure you should keep with this plugin.

### Forms

Each form element should have a `POST` method, and also contain it's post `action`, even if the action is in the same script (i.e. writing `action="contact.php"` in the `contact.php` script). It should also have an `id` and a `name` value.

### Inputs

[Every input should have a label](https://www.w3.org/TR/html401/interact/forms.html#h-17.9), all except for the submit button.

### Validation

To show validation messages, you should put a `p` element with the class `status-message`, with an id of the input it's validation is for.

The entire form should also have a `status-message`, with an id of `complete` and a value of `data-form` set to the name of the form.

The input itself should have a `data-error-msg` value that shows what the validation message should be. Some inputs, like emails, should also contain a `data-invalid-msg` value.

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

---

## Dependencies

### jQuery

jQuery is a requirement for this build. The current version being used is `3.3.1`, but there shouldn't be any issues with you using a more updated `3.x` or `3.3.x` version.

### intlTelInput

Within this build, there is functionality for [intlTelInput](https://github.com/jackocnr/intl-tel-input), which is used to handle telephone inputs. You'll need to download the [minified version](https://github.com/jackocnr/intl-tel-input/blob/master/build/js/intlTelInput.min.js) of this code in order for the telephone handling to work.