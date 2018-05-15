<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{

        $edited = json_decode($_POST['ankiet']);
        
        if(isset($edited->newTitle) && $edited->newTitle != ''){
            $newTitle = $edited->newTitle;
        }else{
            $newTitle = $edited->title;
        }

        for($x = 0; $x < count($edited->options); $x++){
            if(isset($edited->options[$x]->newTitle) && $edited->options[$x]->newTitle != ''){
                $edited->options[$x]->title = $edited->options[$x]->newTitle;
            }
        }
        $options = json_encode($edited->options);

        $db_query = $db_conn->prepare('UPDATE listOfAnkiet SET title=:title, options=:options WHERE id=:id');
        $db_query->bindParam(':id', $edited->id);
        $db_query->bindParam(':title', $newTitle);
        $db_query->bindParam(':options', $options);

        if($db_query->execute()){
            throw new Exception('Complete', 0);
        }else{
            throw new Exception('Some error', 1);
        }
        

    }catch(Exception $e){
        print($e->getCode());
    }
?>