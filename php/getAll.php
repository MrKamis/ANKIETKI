<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{

        $db_query = $db_conn->prepare('SELECT * FROM listOfAnkiet ORDER BY created DESC');
        $db_query->execute();
        $result = $db_query->fetchAll();

        class Ankieta{
            public $title;
            public $options;
            public $id;
            public $date;
        };

        $table = [];
        foreach($result as $ankiet){
            $tmp = new Ankieta();
            $tmp->title = $ankiet['title'];
            $tmp->options = json_decode($ankiet['options']);
            $tmp->id = $ankiet['id'];
            $tmp->date = $ankiet['created'];
            array_push($table, $tmp);
        }

        print(json_encode($table));

    }catch(Exception $e){
        print($e->getCode());
    }
?>