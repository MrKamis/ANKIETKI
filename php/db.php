<?php
    $db_user = 'root';
    $db_host = '127.0.0.1';
    $db_pass = '';
    $db_name = 'photoblog';

    $db_conn = new PDO("mysql:host=$db_host;dbname=$db_name;", $db_user, $db_pass);
?>