<?php
$date=date_create_from_format("Y-m-d H:i:s","2012-04-05 21:10:51");
$q = intval($_GET['q']);
$ts1 = $_GET['ts'];

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

$sql ="UPDATE db_projection SET db_projection.available=db_projection.available+1 WHERE db_projection.block_id='$q' and db_projection.timestamp ='$ts1'";

if (mysqli_query($conn, $sql)) {
    print json_encode(true);
} else {
    print json_encode(false);
}

mysqli_close($conn);
?>