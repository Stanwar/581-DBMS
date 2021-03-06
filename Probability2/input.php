<!DOCTYPE html>
<head>
<script>

//variables for the user's final destination and the timestamp
var d, loc;


//finds the node info as of now
function findblock(str1, str2) {
    
    if (str1 == "" || str2 =="") {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else
       { 
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {


              //var ja = document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
                
              //get the json response from the php file
                var js = JSON.parse(xmlhttp.responseText);
                //console.log(js.length);
                
                console.log(js);
              displayjson(js);

            }
        }
        //request for the data from the server
        xmlhttp.open("GET","getnode.php?q="+str1+"&datetime="+str2,true);
        xmlhttp.send();
    }

    document.getElementById("demo").innerHTML = "Selected Item is: "+ str1;
}


//display the fetched data from the database getnode.php
function displayjson(jsonstring)
{

  var out; 
  var i;
  for (var i = 0; i < jsonstring.length; i++) {
    out = jsonstring[i].node_id + "   " + jsonstring[i].node_name +  "   " +jsonstring[i].latitude +  "   " + jsonstring[i].longitude;

  }
document.getElementById("txtHint").innerHTML = out;

}

//function to fetch the input values
function finddest()
{
d =  document.form1.destination.selectedIndex;
loc = document.form1.destination.options[d].value;
//alert(loc);

//findblock(loc);
var timestamp = document.form1.text.value;
//alert(timestamp);
//got variables
console.log(loc + " " + timestamp);

findblock(loc, timestamp);

}


</script>
</head>
<body>

<p id="demo">Selected Item is:</p>
<p> Enter the timestamp:</p>
<form name="form1">

<input type = "text" name="text" id="datefield">
<br>
<br>
<select name="destination" onchange="finddest()">
  <option value="">Select a Destination:</option>
  <option value="7001">Beach and Polk</option>
  <option value="7002">North Point and Polk</option>
  <option value="7003">Bay and Polk</option>
  <option value="7004">W. end of Jefferson</option>
  <option value="7005">Beach and Larkin</option>
  <option value="7006">North Point and Larkin</option>
  <option value="7007">Bay and Larkin</option>
  <option value="7008">N. end of Hyde</option>
  <option value="7009">Jefferson and Hyde</option>
  <option value="7010">Beach and Hyde</option>
  <option value="7011">North Point and Hyde</option>
  <option value="7012">Bay and Hyde</option>
  <option value="7013">N. end of Leavenworth</option>
  <option value="7014">Jefferson and Leavenworth</option>
  <option value="7015">Beach and Leavenworth</option>
  <option value="7016">North Point and Leavenworth</option>
  <option value="7017">Midway 2700 block of Leavenworth</option>
  <option value="7018">Bay and Leavenworth</option>
  <option value="7019">Jefferson and Jones</option>
  <option value="7020">Beach and Jones</option>
  <option value="7021">North Point and Jones</option>
  <option value="7022">Bay and Jones</option>
  <option value="7023">Jefferson and Taylor</option>
  <option value="7024">Beach and Taylor</option>
  <option value="7025">North Point and Taylor</option>
  <option value="7026">Bay and Taylor</option>
  <option value="7027">Jefferson and Mason</option>
  <option value="7028">Beach and Mason</option>
  <option value="7029">North Point and Mason</option>
  <option value="7030">Bay and Mason</option>
  <option value="7031">Vandewater and Mason</option>
  <option value="7032">Jefferson and Powell</option>
  <option value="7033">Beach and Powell</option>
  <option value="7034">North Point and Powell</option>
  <option value="7035">Bay and Powell</option>
  <option value="7036">Beach and Stockton</option>
  <option value="7037">North Point and Stockton</option>
  <option value="7038">Bay and Stockton</option>
  <option value="7039">Beach and Grant</option>
  <option value="7040">North Point and Grant</option>

  </select>

 
</form>

<br>
<div id="txtHint"><b>Fetch the node information</b></div>

</body>
</html>