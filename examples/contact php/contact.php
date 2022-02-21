<?php

include("validate_form.php"); /* use our own php form validation script here */

if(isset($_POST['email'])) {
    /* You should include your own email connection code here. */
    
    /* Filter each of the input fields */
    $nameField = confirmString('name');
    $checkEmail = confirmEmail('email');
    $checkPhone = confirmTelNo('telno');
    $ext = isset($_POST['ext']) ? ', ext: '.$_POST['ext'] : '';
    $region = $_POST['region'];
    $subjectField = confirmString('subject');
    $messageField = confirmString('message');

?>

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
        <div style="margin-bottom: 8px; width: 100%;"><input type="tel" name="telno" id="telno" data-invalid-msg="Please enter a valid phone number" data-error-msg="Please enter your phone number"></div> 
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