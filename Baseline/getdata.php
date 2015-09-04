
<?php

$starttime1 =  $_POST['starttime1'];
$endtime1 =  $_POST['endtime1'];
$starttime2 =  $_POST['starttime2'];
$endtime2 =  $_POST['endtime2'];
$starttime3 =  $_POST['starttime3'];
$endtime3 =  $_POST['endtime3'];
$starttime4 =  $_POST['starttime4'];
$endtime4 =  $_POST['endtime4'];

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
$sql="SELECT * FROM db_projection WHERE (timestamp Between '".$starttime1."' and '".$endtime1."'); ";
$sql .="SELECT * FROM db_projection WHERE (timestamp Between '".$starttime2."' and '".$endtime2."'); ";
$sql .="SELECT * FROM db_projection WHERE (timestamp Between '".$starttime3."' and '".$endtime3."'); ";
$sql .="SELECT * FROM db_projection WHERE (timestamp Between '".$starttime4."' and '".$endtime4."') ";

$rows = array();

$count =0;
// Execute multi query
if (mysqli_multi_query($conn,$sql))
{
  do
    {
    // Store first result set

    if ($result=mysqli_store_result($conn))
      {
      	$temp = array();
      while ($row=mysqli_fetch_row($result))
        {
        	$temp[] = $row;
        }
        $rows[$count] = $temp;
      	mysqli_free_result($result);
      	$count++;
      }
      
    }
  while (mysqli_next_result($conn));
}



print json_encode($rows);

mysqli_close($conn);
?>

















