<?php
/*
    get customer information
*/

$servername = "localhost";
$username = "myadmin";
$password = "myadmin";
$dbname="freight";

//connet to sql
$conn=new mysqli($servername,$username,$password,$dbname);

$code="0";
$err_text="";
$datalist=array();

if ($conn -> connect_errno){
    $code="1";
    $err_text="Sql Server Connet Failed,Can't Load the Customer.";
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
    $conn -> close();
    exit();
}

$user=$_GET['user'];

$sql="SELECT * FROM loadowner where name='".$user."'";


$result=$conn->query($sql);


if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){

        $onedata=array('id'=>$row['loid'],'name'=>$row['name']);
        array_push($datalist,$onedata);
    }
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
} else{
    $code="2";
    $err_text="Database has no data in this username.";
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
}

$conn -> close();