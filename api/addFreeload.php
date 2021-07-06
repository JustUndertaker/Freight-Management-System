<?php
/*
    add freeload in customer
*/

$servername = "localhost";
$username = "myadmin";
$password = "myadmin";
$dbname="freight";

//connet to sql
$conn=new mysqli($servername,$username,$password,$dbname);

$code="0";
$err_text="";

if ($conn -> connect_errno){
    $code="1";
    $err_text="Sql Server Connet Failed,Can't Load the Customer.";
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
    exit();
}

//get post value
$loid=$_POST['user_id'];
$originationx=$_POST['originationx'];
$originationy=$_POST['originationy'];
$destinationx=$_POST['destinationx'];
$destinationy=$_POST['destinationy'];
$ltid=$_POST['load_typeid'];

$value="(".$originationx.",".$originationy.",".$destinationx.",".$destinationy.",".$ltid.",".$loid.")";
$sql="INSERT INTO freeload(originationx,originationy,destinationx,destinationy,loadtypeid,loid) VALUES".$value;

if ($conn->query($sql) === TRUE){

} else {
    $code="1";
    $err_text="insert error!";
}
$json=array('code'=>$code,'err_text'=>$err_text);
echo json_encode($json);
$conn -> close();


