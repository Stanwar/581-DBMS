<html>
<head>
<script>
function findblock(str) {
    if (str == "") {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET","getnode.php?q="+str,true);
        xmlhttp.send();
    }

    document.getElementById("demo").innerHTML = "Selected Item is: "+ str;
}
</script>
</head>
<body>

<p id="demo">Selected Item is:</p>

<form>
<select name="destination" onchange="findblock(this.value)">
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
<div id="txtHint"><b>Fetch the node information</b></div>-->

</body>
</html>