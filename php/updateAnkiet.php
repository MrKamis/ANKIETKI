<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{
        $db_query = $db_conn->prepare('SELECT options FROM listOfAnkiet WHERE id=:id');
        $db_query->bindParam(':id', $_POST['id']);
        $db_query->execute();
        $result = $db_query->fetchAll();
        $result = json_decode($result[0]['options']);

        for($x = 0; $x < count($result); $x++){
            if($result[$x]->title == $_POST['option']){
                $result[$x]->votes++;
                break;
            }
        }

        $db_query = $db_conn->prepare('UPDATE listOfAnkiet SET options=:options WHERE id=:id');
        $options = json_encode($result);
        $db_query->bindParam(':options', $options);
        $db_query->bindParam(':id', $_POST['id']);

        if($db_query->execute()){
            throw new Exception('Complete', 0);
        }else{
            throw new Exception('ERROR', 1);
        }
        
    }catch(Exception $e){
        print($e->getCode());
    }
?>