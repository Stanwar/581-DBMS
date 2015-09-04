<?php
$date=date_create_from_format("Y-m-d H:i:s","2012-04-05 21:10:51");
//echo date_format($date,"Y-m-d H:i:s");
$congestion = intval($_GET['c']);
$time_query = $_GET['t'];


$user = 'stanwa2';
$pass = 'password1';
$db = 'bicyclerace6';



//connection string
$conn = new mysqli('bicyclerace6.mysql.uic.edu',$user, $pass, $db);

if (!$conn) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($conn,"Node Info");

$sql="SELECT a.block_id, MAX( a.ltimeneded ) AS xxtimestamp, edges.latitude_1, edges.longitude_1, edges.latitude_2, edges.longitude_2
			FROM available_data a
			JOIN edges ON a.block_id = edges.block_id
			WHERE a.ltimeneded < '2012-04-06 00:10:59'
			AND a.available >0
			GROUP BY a.block_id";



$result = mysqli_query($conn,$sql) or die("Query Failed");


$rows = array();

while($row = mysqli_fetch_array($result)) {
  
//$data[] = $row['node_name'];

//fetch the data into an array 
$rows[] = $row;
}

// convert the data to a json object.
print json_encode($rows);

mysqli_close($conn);

?>