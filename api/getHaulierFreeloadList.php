<?php
/*
    get freeload market list for haulier
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

$datalist=array();

$sql="SELECT * FROM freeload";
$result=$conn->query($sql);

if ($result->num_rows > 0){
    while($row = $result->fetch_assoc())
    {
        //freeload
        $flid=$row['flid'];
        $origination="(".$row['originationx'].",".$row['originationy'].")";
        $destination="(".$row['destinationx'].",".$row['destinationy'].")";

        //loadtype
        $loadtypeid=$row['loadtypeid'];
        $sql3="SELECT * FROM vehicle where loadTypeID=".$loadtypeid;
        $result3=$conn->query($sql3);
        $row3=$result3->fetch_assoc();
        $loadtype=$row3['name'];

        //loadowner
        $loid=$row['loid'];
        $sql4="SELECT * FROM loadowner where loid=".$loid;
        $result4=$conn->query($sql4);
        $row4=$result4->fetch_assoc();
        $loadowner=$row4['name'];

        //if accept
        $sql5="SELECT * FROM acceptedmatch where freeloadid=".$flid;
        $result5=$conn->query($sql5);

        if ($result5->num_rows > 0){

            $row5=$result5->fetch_assoc();
            $hid=$row5['hid'];

            $sql6="SELECT * FROM haulier where hid=".$hid;
            $result6=$conn->query($sql6);
            $row6=$result6->fetch_assoc();
            $accepthaulier=$row6['name'];
        } else {
            $accepthaulier="none";
        }

        $data=array('id'=>$flid,'origination'=>$origination,'destination'=>$destination,'loadtypeid'=>$loadtypeid,'loadtype'=>$loadtype,'loadowner'=>$loadowner,'accepthaulier'=>$accepthaulier);
        array_push($datalist,$data);
    }
    echo json_encode($datalist);

}else{
    echo "{}";
}
$conn -> close();