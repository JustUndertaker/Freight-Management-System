<?php
/*
    get one haulier's load
*/

$servername = "localhost";
$username = "myadmin";
$password = "myadmin";
$dbname="freight";

//connet to sql
$conn=new mysqli($servername,$username,$password,$dbname);

if ($conn -> connect_errno){

    echo '{"Sql Server Connet Failed,Can\'t Load the Haulier."}';
    exit();
}

$hid=$_GET['hid'];

$datalist=array();

$sql="SELECT * FROM acceptedmatch where hid=".$hid;
$result=$conn->query($sql);

if ($result->num_rows > 0){
    while($row = $result->fetch_assoc())
    {
        $accettime=$row['datetime'];
        $freeloadid=$row['freeloadid'];

        //load freeload
        $sql2="SELECT * FROM freeload where flid=".$freeloadid;
        $result2=$conn->query($sql2);
        $row2=$result2->fetch_assoc();
        $origination="(".$row2['originationx'].",".$row2['originationy'].")";
        $destination="(".$row2['destinationx'].",".$row2['destinationy'].")";
        
        //loadtype
        $loadtypeid=$row2['loadtypeid'];
        $sql3="SELECT * FROM vehicle where loadTypeID=".$loadtypeid;
        $result3=$conn->query($sql3);
        $row3=$result3->fetch_assoc();
        $loadtype=$row3['name'];

        //loadowner
        $loid=$row2['loid'];
        $sql4="SELECT * FROM loadowner where loid=".$loid;
        $result4=$conn->query($sql4);
        $row4=$result4->fetch_assoc();
        $loadowner=$row4['name'];

        $data=array('id'=>$freeloadid,'origination'=>$origination,'destination'=>$destination,'loadtypeid'=>$loadtypeid,'loadtype'=>$loadtype,'loadowner'=>$loadowner,'accepttime'=>$accettime);
        array_push($datalist,$data);
    }
    echo json_encode($datalist);

}else{
    echo "{}";
}
$conn -> close();