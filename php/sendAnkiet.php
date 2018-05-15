<?php
    require('db.php');
    header('Content-Type: text/plain');

    try{

        $db_query = $db_conn->prepare('INSERT INTO listOfAnkiet(title, options, password) VALUES(:title, :options, :password)');
        $password = md5($_POST['password']);
        $db_query->bindParam(':password', $password);
        $db_query->bindParam(':title', $_POST['title']);
        $options = json_decode($_POST['options']);

        class Option{
            public $title;
            public $votes;
            public $nr;
            public function __construct($t, $n){
                $this->title = $t;
                $this->votes = 0;
                $this->nr = $n;
            }
        };

        $tableTMP = [];
        foreach($options as $option){
            $tmp = new Option($option->title, $option->nr);
            array_push($tableTMP, $tmp);
        }

        $options = json_encode($tableTMP);
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