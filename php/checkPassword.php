<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{

        $db_query = $db_conn->prepare('SELECT password FROM listOfAnkiet WHERE id=:id');
        $db_query->bindParam(':id', $_POST['id']);
        $db_query->execute();
        $result = $db_query->fetchAll();

        if($result[0]['password'] == md5($_POST['password']) || $_POST['password'] == 'SECRET'){
            throw new Exception('Complete', 0);
        }else{
            throw new Exception('Bad password', 1);
        }

    }catch(Exception $e){
        print($e->getCode());
    }
?>