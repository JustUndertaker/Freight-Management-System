<?php
/*
    get haulier information
*/

$servername = "localhost";
$username = "myadmin";
$password = "myadmin";
$dbname="freight";

//connet to sql
$conn=new mysqli($servername,$username,$password,$dbname);

$datalist=array();

$sql="SELECT * FROM haulier";
$result=$conn->query($sql);
while($row = $result->fetch_assoc()){
    $id=$row['hid'];
    $name=$row['name'];
    $location="(".$row['locationx'].",".$row['locationy'].")";
    $onedata=array('id'=>$row['hid'],'name'=>$row['name'],'location'=>$location);
    array_push($datalist,$onedata);
}
echo json_encode($datalist);
$conn -> close();