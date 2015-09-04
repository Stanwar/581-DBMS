var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var timestamp1, timestamp2;
var d, loc;
var dest_lat, dest_long;
var shortest_lat, shortest_long;
var shortest_distance;
var walking_distance;
var parking_time, walking_time, total_park_time;
var dist, time;
var park_lat, park_long;
var json_destination;
//var available_blocks;
var shortest_timestamp;
var shortest_block_id;
var templat1, templong1, templat2, templong2, tempblock_id, temp_timestamp;
var flag;
var count;
var routingcontrol;
var changedblocks = [];
var congestion_level = 0;
var js_reset;
var time_query; 
var blocks_for_searching = [];

////////////////////////////////////////////////
//////logic for the map functionality//////////
///////////////////////////////////////////////

//call to find the best parking spot
//l1, l2, l3, l4 are coordinates. bid is the current block id and ts is the current timestamp
var  find_parking_spot = function(l1,l2,l3,l4, bid, ts){

if(map!=undefined)
 {
    map.remove();
    this.map=null;
   
 }
    map = new L.map('map');                 //map is intitiated here

 //   console.log("inside find_parking_spot");
 
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);                                  //botton part of the map to mention the contributors

 
 
//L.latLng(37.804821, -122.420194)
routingcontrol = L.Routing.control({
    waypoints: [
        L.latLng(l1, l2),
        L.latLng(l3, l4)
    ],

    routeWhileDragging: false
}).addTo(map);                                         //add the start and the end for the route to be displayed on the map.
                                                       //l1 and l2 is the intended destination and l3, l4 are the possible parking spot
//Be careful. this part is going to be executed at a later point of time. 
//context could possibly change.

routesummary.call(this, l1, l2, l3, l4, bid, ts);

return this;
map.removeLayer(routingcontrol);
//return;
};


var routesummary = function(l1, l2, l3, l4, bid, ts)
{
 var router = L.Routing.osrm();
router.route([
        {latLng: L.latLng(l1, l2)},
        {latLng: L.latLng(l3, l4)}
    ], function(err, routes) {
        if (err) {
            console.log(err);
        } else {
               // console.log("route found");
                console.log(routes[0].summary.totalDistance);                       //function to access the route summary
                console.log(routes[0].summary.totalTime);   

                //the below function gives the first segment distance towards the parking spot
                console.log("inst distance = "+routes[0].instructions[0].distance);  
                //the below function gives the time to travel the distance in the first segment
                console.log("inst time = "+routes[0].instructions[0].time); 
                //the below function gives the instruction type. like ->straight, left, right, etc...
                console.log("inst type = "+routes[0].instructions[0].type); 
                //the function below gives the direction of the instructions like ->N, NE, SW, etc..
                console.log("inst direction = "+routes[0].instructions[0].direction);  
                dist = routes[0].summary.totalDistance;
                time = routes[0].summary.totalTime;
                check_shortest_destination.call(this, l1, l2, l3, l4, bid, ts);              
                //console.log(routes[0].summary.totalDistance);
        }
    });
};


////////////////////////////////////////////////////////////////////////
//function to check whether the selected route is the shortest or not///
////////////////////////////////////////////////////////////////////////
var  check_shortest_destination = function(l1, l2, l3, l4, bid, ts)
{
   // console.log('check_shortest_destination');



   if(shortest_distance==undefined || dist < shortest_distance)             
    {   

        shortest_distance = dist;
        shortest_lat = l3;
        shortest_long = l4;
        shortest_block_id = bid;
        shortest_timestamp = ts;
        flag = true;
        update_shortest_route.call(this, l1, l2, shortest_lat, shortest_long, shortest_block_id, shortest_timestamp);                   //update the map with the shortest distance at the last

    }
    else
        {
         return this;
        }

 // console.log("shortest="+shortest_distance + "   " + "shortest block id =" + shortest_block_id);
  return this;
};

/////////////////////////////////////////////////////////////////////////////////
/////////////function to update the best route//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var update_shortest_route = function(l1,l2,l3,l4, bid, ts)
{
  //  console.log('update_shortest_route');
    //changedblocks.pus()
    return( find_parking_spot.call(this, l1, l2, l3, l4, bid, ts) );

    //return this;
};

////////////////////////////////////////////////
//////logic for the  query to the MYSQL/////////
///////////////////////////////////////////////

//function to fetch the input values
var find_dest = function()
{
d =  document.form1.destination.selectedIndex;
loc = document.form1.destination.options[d].value;                                  //fetch the user inputs here
timestamp1 = document.form1.text.value;
time_query = document.form1.text.value;
congestion_level = document.form1.congestion.value;
//console.log(congestion_level);
//got variables
//console.log(loc + " " + timestamp1);
        if(flag == true)
        {
            shortest_distance = undefined;
            shortest_lat = undefined;
            shortest_long = undefined;
            shortest_timestamp = undefined;
            shortest_block_id = undefined;
            available_blocks = undefined;
            flag = false;
        }


findblock(loc, timestamp1);                                                 //fetches the user's intended destination location co-ordinates
//console.log('find_dest');
//console.log(blocks_for_searching);

};

/////////////////////////////////////////////////////////////////////////
//////Database connectivity and json string results from query//////////
////////////////////////////////////////////////////////////////////////

//finds the node info as of now
var findblock = function(str1, str2) {
//complex code here. check kunal's code for easier and cleaner ajax call    
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
                json_destination = JSON.parse(xmlhttp.responseText);    //actual value being received from the php file in JSON format
                //console.log(js.length);
                
               // console.log(json_destination);
                get_available_blocks.call(this, json_destination, str2);        //call to the function that identifies the available blocks
              //intended_destination(json_destination); 

            }
        }
        //request for the data from the server
        xmlhttp.open("GET","getnode.php?q="+str1+"&datetime="+str2,true);       //php call to access the db
        xmlhttp.send();
    }
  //  console.log('findblock');
    document.getElementById("demo").innerHTML = "Selected Item is: "+ str1;
};

/////////////////////////////////////////////////////////////////////
////////find the list of available blocks at a given time stamp/////
////////////////////////////////////////////////////////////////////

var  get_available_blocks = function(js_finaldestination, timestamp)
{
console.log("inside get_available_blocks");
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else 

        {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
      
        xmlhttp.onreadystatechange = function() 
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
           var available_blocks = JSON.parse(xmlhttp.responseText);
                //console.log(js.length);
             //    console.log(available_blocks);
          //    console.log(available_blocks.length);
              fetch_blocks.call(this, js_finaldestination, available_blocks);

            }
        }
        //request for the data from the server
        //xmlhttp.open("GET","test.php?l1="+l1+"&l2="+l2,true);
       // console.log(congestion_level);
        xmlhttp.open("GET","available_blocks_query.php?c="+congestion_level+"&t="+time_query, true);
        xmlhttp.send();
//console.log('get_available_blocks');

    };

/////////////////////////////////////////////////////////////////
///////function call to fetch the list of blocks ////////////////
/////////////////////////////////////////////////////////////////
var fetch_blocks = function(js_finaldestination,available_blocks)
{
    //debugger;

for(var i=0; i<js_finaldestination.length;i++)
    {
//fetch the destination coordinates
        dest_lat = js_finaldestination[i].latitude;
        dest_long = js_finaldestination[i].longitude;
     // console.log(dest_lat, dest_long);
    }

    for(var j=0; j<available_blocks.length;j++)
    {
        //fetch the list of the available coordinates 
       var avail_slot = parseInt(available_blocks[j].available);
        if(avail_slot == 0)
        {
            continue;
        }
       
        templat1 = parseFloat(available_blocks[j].latitude_1);
        templong1 = parseFloat(available_blocks[j].longitude_1);
        templat2 = parseFloat(available_blocks[j].latitude_2);
        templong2 = parseFloat(available_blocks[j].longitude_2);
    
        park_lat = (templat1 + templat2)/2;
        park_long =(templong1+ templong2)/2;

        //also making a copy of the current block id and the timestamp for making reset updates to the db_projection file 

        tempblock_id = parseInt(available_blocks[j].block_id);
        temp_timestamp = available_blocks[j].timestamp;

        //console.log(park_lat, park_long);
       //temp time logic here
//       var block_info = {block_id:tempblock_id, lat:park_lat, lon:park_long, timestamp:temp_timestamp};
  //     blocks_for_searching.push(block_info);
       //console.log(block_info);



       find_parking_spot.call(this, dest_lat, dest_long, park_lat, park_long, tempblock_id, temp_timestamp);  //function call to identify each available block and find the best
       //routesummary.call(this, dest_lat, dest_long, park_lat, park_long, tempblock_id, temp_timestamp);

 //console.log("distance = " + shortest_distance)
      
    }
      

//console.log('fetch_blocks');
};

//////////////////////////////////////////////////////////////////////////
//////fetch the updated information when the update route infomration/////
//////////////////////////////////////////////////////////////////////////
var fetch_route_summary = function()
{
    //fetch the information 
  //  console.log("Distance to parking spot = "+shortest_distance);
  //  console.log("shortest_timestamp = "+shortest_timestamp);
  //  console.log("shortest_block_id = "+shortest_block_id);

    walking_distance = shortest_distance;
    parking_time = (shortest_distance)/10;
    walking_time = (walking_distance)/1.4;
    total_park_time = parking_time + walking_time;
    
    console.log("Distance to park =" + shortest_distance);
    console.log("Time to park =" + parking_time);
    console.log("Distance to walk =" + walking_distance);
    console.log("Time to walk back to the destination from the parking spot = "+ walking_time);
    console.log("Total Time ="+ total_park_time);
  
};
