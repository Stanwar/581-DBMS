
<?php

//echo $q +" ";
//echo "  ";
//echo $datetime;

//db credentials 
$user = 'root';
$pass = '';
$db = 'dbms_db';

//connection string
$conn = new mysqli('localhost',$user, $pass, $db);

if (!$conn) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($conn,"Node Info");
$sql="SELECT * FROM edges ";
$result = mysqli_query($conn,$sql) or die("Query Failed");

//echo "<table>
//<tr>
//<th>Node ID</th>
//<th>Latitude</th>
//<th>Longitude</th>
//<th>Node Name</th>
//</tr>";
//$data = array();

$rows = array();

while($row = mysqli_fetch_array($result)) {
  //  echo "<tr>";
   // echo "<td>" . $row['node_id'] . "</td>";
    //echo "<td>" . $row['latitude'] . "</td>";
   // echo "<td>" . $row['longitude'] . "</td>";
   // echo "<td>" . $row['node_name'] . "</td>";
   // echo "</tr>";

//$data[] = $row['node_name'];

//fetch the data into an array 
$rows[] = $row;
}

// convert the data to a json object.
print json_encode($rows);

//echo "</table>";

//echo json_encode($data) ;
//$data = implode(",", $data);
//mysqli_close($conn);


?>

