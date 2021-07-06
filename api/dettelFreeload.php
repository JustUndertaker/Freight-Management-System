<?php
/*
    Detetle freeload for customer.
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

    $code="4";
    $err_text="Sql Server Connet Failed,Can't Load the Customer.";
    $json=array('code'=>$code,'err_text'=>$err_text);
    echo json_encode($json);
    exit();
}


//get post value
$loid=$_POST['user_id'];
$flid=$_POST['freeload_id'];
$booked=$_POST['booked'];
$haulier=$_POST['haulier'];

//is booked?
if ($booked=="yes"){

    //detele accept
    $sql="DELETE FROM acceptedmatch WHERE freeloadid=".$flid;
    if ($conn->query($sql) === TRUE){
        
    }else{
        $code="1";
        $err_text="delete accept error!";
    }

}

//delete freeload
$sql="DELETE FROM freeload WHERE flid=".$flid;

if ($conn->query($sql) === TRUE){
        
}else{
    $code="2";
    $err_text="delete freeload error!";
}

$json=array('code'=>$code,'err_text'=>$err_text);
echo json_encode($json);
$conn -> close();
