<?php
$date=date_create_from_format("Y-m-d H:i:s","2012-04-05 21:10:51");
$q = intval($_GET['q']);
$ts1 = $_GET['ts'];
$congestion = intval($_GET['c']);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dbms_db";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if($congestion == 0)
{
$sql ="UPDATE db_projection SET db_projection.available_current=db_projection.available_current+1 WHERE db_projection.block_id='$q' and db_projection.timestamp ='$ts1'";
	//echo "hi there";	
}
elseif ($congestion == 20) {
$sql ="UPDATE db_projection SET db_projection.available_20=db_projection.available_20+1 WHERE db_projection.block_id='$q' and db_projection.timestamp ='$ts1'";
}
elseif ($congestion == 40) {
$sql ="UPDATE db_projection SET db_projection.available_40=db_projection.available_40+1 WHERE db_projection.block_id='$q' and db_projection.timestamp ='$ts1'";
}
elseif ($congestion == 60) {
$sql ="UPDATE db_projection SET db_projection.available_60=db_projection.available_60+1 WHERE db_projection.block_id='$q' and db_projection.timestamp ='$ts1'";
}


if (mysqli_query($conn, $sql)) {
  print json_encode(true);
} else {
  print json_encode(false);
}

mysqli_close($conn);
?>