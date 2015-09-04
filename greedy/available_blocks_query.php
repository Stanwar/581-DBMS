<?php
$date=date_create_from_format("Y-m-d H:i:s","2012-04-05 21:10:51");
//echo date_format($date,"Y-m-d H:i:s");
$congestion = intval($_GET['c']);
$time_query = $_GET['t'];
//$bid = intval($_GET['e']);
$bid = array(612312,612311,585092,326081,326082,542301,542302,326071,326072,472281,847052,847042,847041,326062,326061,546281,546282,363132,363131,546271,546272,546273,363122,363121,585061,502262,326052,502271,502282,847032,847031,847021,326042,681271,681272,681262,681261,585051,585052,681251,681252,325052,847011,326032,562262,562261,562252,585042,585041,325042,325041,562241,562242,562231,847001,326022,616242,616241,585031,585032,325032,325031,616231,585022,664232,585012);
$user = 'root';
$pass = '';
$db = 'dbms_db';
$getdata = array();
$rows = array();

//connection string
$conn = new mysqli('localhost',$user, $pass, $db);

if (!$conn) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($conn,"Node Info");
for($i=0; $i<66;$i++)
{
if($congestion == 0)
{
$sql="SELECT db_projection.block_id,db_projection.timestamp, edges.latitude_1, edges.longitude_1, edges.latitude_2, edges.longitude_2, db_projection.available_current as available FROM db_projection INNER JOIN edges on db_projection.block_id = edges.block_id where db_projection.timestamp< '$time_query'  and db_projection.block_id='$bid[$i]' ORDER BY timestamp desc limit 1";
$result = mysqli_query($conn,$sql) or die("Query Failed");
while($row = mysqli_fetch_array($result)) {
  //$rows[] = $row;
	array_push($rows, $row);
}

}

elseif ($congestion == 20) {
$sql="SELECT db_projection.block_id,db_projection.timestamp, edges.latitude_1, edges.longitude_1, edges.latitude_2, edges.longitude_2, db_projection.available_20 as available FROM db_projection INNER JOIN edges on db_projection.block_id = edges.block_id where db_projection.timestamp< '$time_query'  and db_projection.block_id='$bid[$i]' ORDER BY timestamp desc limit 1";
$result = mysqli_query($conn,$sql) or die("Query Failed");
while($row = mysqli_fetch_array($result)) {
  //$rows[] = $row;
	array_push($rows, $row);
}
}


elseif ($congestion == 40) {
$sql="SELECT db_projection.block_id,db_projection.timestamp, edges.latitude_1, edges.longitude_1, edges.latitude_2, edges.longitude_2, db_projection.available_40 as available FROM db_projection INNER JOIN edges on db_projection.block_id = edges.block_id where db_projection.timestamp< '$time_query'  and db_projection.block_id='$bid[$i]' ORDER BY timestamp desc limit 1";
$result = mysqli_query($conn,$sql) or die("Query Failed");
while($row = mysqli_fetch_array($result)) {
  //$rows[] = $row;
	array_push($rows, $row);
}
}
elseif ($congestion == 60) {
$sql="SELECT db_projection.block_id,db_projection.timestamp, edges.latitude_1, edges.longitude_1, edges.latitude_2, edges.longitude_2, db_projection.available_60 as available FROM db_projection INNER JOIN edges on db_projection.block_id = edges.block_id where db_projection.timestamp< '$time_query'  and db_projection.block_id='$bid[$i]' ORDER BY timestamp desc limit 1";
$result = mysqli_query($conn,$sql) or die("Query Failed");
while($row = mysqli_fetch_array($result)) {
  //$rows[] = $row;
	array_push($rows, $row);
}

}

}


// convert the data to a json object.
print json_encode($rows);

mysqli_close($conn);

?>