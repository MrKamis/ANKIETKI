<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{

        $db_query = $db_conn->prepare('DELETE FROM listOfAnkiet WHERE id=:id');
        $db_query->bindParam(':id', $_POST['id']);
        if($db_query->execute()){
            throw new Exception('Complete', 0);
        }else{
            throw new Exception('Some error', 1);
        }

    }catch(Exception $e){
        print($e->getCode());
    }
?>