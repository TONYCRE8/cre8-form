<?php

/* 

This script is used to handle any and all form inputs, through a series of return functions that will validate all of the fields.
This can be used on the server side to make absolutely sure that nothing malicious is going to be sent through.

*/

/* validate string */

function confirmString($field) {

    return filter_input(INPUT_POST, $field, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);

}

/* validate email */

function confirmEmail($field) {
    $emailField = filter_input(INPUT_POST, $field, FILTER_VALIDATE_EMAIL);

    $isValid = false;
    /* rfc 5322 regex */
    $rfc5322 = '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD';

    /* Check email */

    if($emailField === null) {
        $msg = 'A value for emailField was not found';
    } else if ($emailField === false) {
        $msg = 'An invalid value for emailField was detected.';
    } else {
        if(!preg_match($rfc5322, $_POST['fname'])) {
            $msg = 'The emailField was entered without proper formatting';
        } else {
            $isValid = true;
        }
    }

    return array('valid'=>$isValid, 'value'=>$emailField);

}

/* validate telephone number */

function confirmTelNo($field) {
    $telnoField = filter_input(INPUT_POST, $field, FILTER_SANITIZE_STRING);

    /* validation stuff */
    $isValid = false;
    /* rfc 3966 regex */
    $rfc3966 = '/^(?=(?:\+|0{2})?(?:(?:[\(\-\)\.\/ \t\f]*\d){7,10})?(?:[\-\.\/ \t\f]?\d{2,3})(?:[\-\s]?[ext]{1,3}[\-\.\/ \t\f]?\d{1,4})?$)((?:\+|0{2})\d{0,3})?(?:[\-\.\/ \t\f]?)(\(0\d[ ]?\d{0,4}\)|\(\d{0,4}\)|\d{0,4})(?:[\-\.\/ \t\f]{0,2}\d){3,8}(?:[\-\s]?(?:x|ext)[\-\t\f ]?(\d{1,4}))?$/';

    if($telnoField === null) {
        $msg = 'A value for telnoField was not found';
    } else if ($telnoField === false) {
        $msg = 'An invalid value for telnoField was detected.';
    } else {
        if (!preg_match($rfc3966, $telnoField)) {
            $msg = 'The telnoField was entered without proper formatting.';
        } else {
            $isValid = true;
        }
    }
    return array('valid'=>$isValid, 'value'=>$telnoField);
}

/* validate date */

function confirmDate($date) {

    return date('Y-m-d', strtotime(preg_replace("([^0-9 -])", "", $date)));;

}

?>