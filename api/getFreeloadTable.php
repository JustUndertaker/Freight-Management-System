<?php

/*
    return customer freeload table data
*/


$servername = "localhost";
$username = "myadmin";
$password = "myadmin";
$dbname="freight";

//connet to sql
$conn=new mysqli($servername,$username,$password,$dbname);

if ($conn -> connect_errno){

    echo '{"Sql Server Connet Failed,Can\'t Load the Customer."}';
    exit();
}

$userid=$_GET['userid'];

$datalist=array();

$sql="SELECT * FROM freeload where loid=".$userid;
$result=$conn->query($sql);

if ($result->num_rows > 0){

    while($row = $result->fetch_assoc())
    {

        //if booked
        $flid=$row['flid'];

        $newsql="SELECT * FROM acceptedmatch WHERE freeloadid=".$flid;
        $newresult=$conn->query($newsql);
        if ($newresult->num_rows > 0){
            //get hid
            $booked="yes";
            $newrow = $newresult->fetch_assoc();
            $hid=$newrow['hid'];

            //get haulier
            $sql2="SELECT * FROM haulier WHERE hid=".$hid;
            $result2=$conn->query($sql2);
            $row2 = $result2->fetch_assoc();
            $haulier=$row2['name'];
        } else {
            $booked="no";
            $haulier="";
        }
        $origination="(".$row['originationx'].",".$row['originationy'].")";
        $destination="(".$row['destinationx'].",".$row['destinationy'].")";

        //loadtype
        $loadtypeid=$row['loadtypeid'];
        $newsql="SELECT * FROM vehicle WHERE loadTypeID=".$loadtypeid;
        $newresult=$conn->query($newsql);
        $newrow = $newresult->fetch_assoc();
        $loadtype=$newrow['name'];

        $data=array('id'=>$row['flid'],'origination'=>$origination,'destination'=>$destination,'loadtypeid'=>$loadtypeid,'loadtype'=>$loadtype,'booked'=>$booked,'haulier'=>$haulier);
        array_push($datalist,$data);
    }
    echo json_encode($datalist);
}
else 
{
    echo "{}";
}
$conn -> close();

