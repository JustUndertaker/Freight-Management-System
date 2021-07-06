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

$code="0";
$err_text="";
$datalist=array();

if ($conn -> connect_errno){
    $code="1";
    $err_text="Sql Server Connet Failed,Can't Load the Hauiler message.";
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
    exit();
}

//hauilerinfo
$user=$_GET['user'];
$sql="SELECT * FROM haulier where name='".$user."'";

$result=$conn->query($sql);

if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){
        $location="(".$row['locationx'].",".$row['locationy'].")";
        $onedata=array('id'=>$row['hid'],'name'=>$row['name'],'address'=>$row['address'],'phone'=>$row['phone'],'location'=>$location);
        $hauilerinfo=$onedata;
    }
} else{
    $code="2";
    $err_text="Database has no data in this hauliername.";
    $json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
    echo json_encode($json);
    $conn -> close();
    exit();
}

$ojid=$hauilerinfo['id'];

//Vehicleinfo
$sql="SELECT * FROM vehicle WHERE vehicle_owner=".$ojid;
$result=$conn->query($sql);
$vehicleinfo=array();
if ($result->num_rows > 0){
while($row = $result->fetch_assoc()){
    //get loadtype
    $loadtypeid=$row['loadTypeID'];
    $sql="SELECT * FROM loadtype WHERE ltid=".$loadtypeid;
    $loadresult=$conn->query($sql);
    while($loadrow = $loadresult->fetch_assoc()){
        $loadtype=$loadrow['description'];
        if ($loadrow['hazrdous']==0){
            $hazrdous='no';
        } else {
            $hazrdous='yes';
        }
    }
    $onedata=array('id'=>$row['vid'],'name'=>$row['name'],'loadtypeid'=>$loadtypeid,'tonnage'=>$row['tonnage'],'loadtype'=>$loadtype,'hazrdous'=>$hazrdous);
    array_push($vehicleinfo,$onedata);
}}

//getdata
$datalist=array('hauilerinfo'=>$hauilerinfo,'vehicleinfo'=>$vehicleinfo);
$json=array('code'=>$code,'err_text'=>$err_text,'datalist'=>$datalist);
echo json_encode($json);

$conn -> close();

