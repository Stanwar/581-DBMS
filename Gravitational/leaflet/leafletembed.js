var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var timestamp1, timestamp2;
var d, loc;
var dest_lat, dest_long;
var walking_distance;
var parking_time, walking_time, total_park_time;
var shortest_lat, shortest_long;
var shortest_distance;
var dist, time;
var force;
var park_lat, park_long;
var json_destination;
var available_blocks;
var shortest_timestamp;
var avail = [];
var shortest_block_id;
var templat1, templong1, templat2, templong2, tempblock_id, temp_timestamp;
var flag;
var count;
var routingcontrol;
var congestion_level;
var changedblocks = [];
var available_slots;
var shorttestDistance;
var destination_slot;
var spotted_slot;
var max_force;
var time_query;
var force_vector = [];
////////////////////////////////////////////////
//////logic for the  query to the MYSQL//////////
///////////////////////////////////////////////
//first method called
//function to fetch the input values
var find_dest = function()
{
d =  document.form1.destination.selectedIndex;
loc = document.form1.destination.options[d].value;
time_query = document.form1.text.value;
congestion_level = document.form1.congestion.value;
 //fetch the user inputs here
//alert(loc);
//findblock(loc);
timestamp1 = document.form1.text.value;
//alert(timestamp);
//got variables
console.log(loc + " " + timestamp1);
  if(flag == true)
  {
    max_force = undefined;
    shortest_distance = undefined;
    shortest_lat = undefined;
    shortest_long = undefined;
    shortest_timestamp = undefined;
    shortest_block_id = undefined;
    available_blocks = undefined;
    flag = false;
  }
findblock(loc, timestamp1);                                                 //fetches the user's intended destination location co-ordinates
console.log('find_dest');
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
                json_destination = JSON.parse(xmlhttp.responseText);    //actual value being received from the php file in JSON format
                console.log(json_destination);
                get_available_blocks.call(this, json_destination, str2);        //call to the function that identifies the available blocks
              //intended_destination(json_destination); 
            }
        }
        //request for the data from the server
        xmlhttp.open("GET","getnode.php?q="+str1+"&datetime="+str2,false);       //php call to access the db
        xmlhttp.send();
    }//str1 is node id, str2 is timestamp input by the user
    console.log('findblock');
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

              //var ja = document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
                 
              //get the json response from the php file
                available_blocks = JSON.parse(xmlhttp.responseText);
                console.log(available_blocks);
              fetch_blocks.call(this, js_finaldestination, available_blocks);

            }
        }
        //request for the data from the server
        //xmlhttp.open("GET","test.php?l1="+l1+"&l2="+l2,true);
        xmlhttp.open("GET","available_blocks_query.php?c="+congestion_level+"&t="+time_query, true);
        xmlhttp.send();
        console.log('get_available_blocks');

    };

/////////////////////////////////////////////////////////////////
///////function call to fetch the list of blocks ///////////////
////////////////////////////////////////////////////////////////
var fetch_blocks = function(js_finaldestination,available_blocks)
{
    //debugger;
try{

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
        available_slots = parseInt(available_blocks[j].available);
        if(available_slots ==0)
        {
            continue;
        }

        console.log("Available Block"+j+":"+available_blocks[j].block_id);
        templat1 = parseFloat(available_blocks[j].latitude_1);
        templong1 = parseFloat(available_blocks[j].longitude_1);
        templat2 = parseFloat(available_blocks[j].latitude_2);
        templong2 = parseFloat(available_blocks[j].longitude_2);
        
        avail.push(available_slots);
        console.log("available slots:"+available_slots);
        park_lat = (templat1 + templat2)/2;
        park_long =(templong1+ templong2)/2;

        spotted_slot = L.latLng(park_lat,park_long);
        destination_slot = L.latLng(dest_lat,dest_long);
        //shorttestDistance = destination_slot.distanceTo(spotted_slot);
        //console.log("distance calculated"+j+":"+shorttestDistance);
        //console.log("force calculated"+j+":"+force);
        //also making a copy of the current block id and the timestamp for making reset updates to the db_projection file 

        tempblock_id = parseInt(available_blocks[j].block_id);
        temp_timestamp = available_blocks[j].timestamp;


        //console.log(park_lat, park_long);
       find_parking_spot.call(this, dest_lat, dest_long, park_lat, park_long, tempblock_id, temp_timestamp,available_slots);  //function call to identify each available block and find the best
       //routesummary.call(this, dest_lat, dest_long, park_lat, park_long, tempblock_id, temp_timestamp);

 //console.log("distance = " + shortest_distance)
      
    }
      

console.log('fetch_blocks');

if(true!=true)
  {
    throw "silliest way to code";
  }
}

catch(err){console.log("Error is = "+ err); }
finally { console.log("finally");}
};


////////////////////////////////////////////////
//////logic for the map functionality//////////
///////////////////////////////////////////////

//call to find the best parking spot
//l1, l2, l3, l4 are coordinates. bid is the current block id and ts is the current timestamp

var  find_parking_spot = function(d_lat,d_long,p_lat,p_long, b_id, time_stamp,a_s){

if(map!=undefined)
 {
    map.remove();
    this.map=null;
   
 }
    map = new L.map('map');                 //map is intitiated here
    console.log("inside find_parking_spot");
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);                                  //botton part of the map to mention the contributors
    routingcontrol = L.Routing.control({
    waypoints: [
        L.latLng(d_lat, d_long),
        L.latLng(p_lat, p_long)
    ],

    routeWhileDragging: false
    }).addTo(map);                                         //add the start and the end for the route to be displayed on the map.
                                                       //l1 and l2 is the intended destination and l3, l4 are the possible parking spot
    routesummary.call(this, d_lat, d_long, p_lat, p_long, b_id, time_stamp,a_s);

    return this;
    map.removeLayer(routingcontrol);
    };


var routesummary = function(l1, l2, l3, l4, bid, ts,slot_avail)
{

 var router = L.Routing.osrm();
  router.route([
              {latLng: L.latLng(l1, l2)},
                  {latLng: L.latLng(l3, l4)}], function(err, routes) {
        
              if (err) {
                  console.log(err);
              } 
              else 
              {
                console.log("route found");
                console.log(routes[0].summary.totalDistance);                       //function to access the route summary
                console.log(routes[0].summary.totalTime);     
                dist = routes[0].summary.totalDistance;
                time = routes[0].summary.totalTime;

                adjacentBlocks.call(this,l1,l2,l3,l4,bid,ts,dist,slot_avail);
        }
    });
};

var adjacentBlocks = function(l1, l2, l3, l4, bid, ts,dist,slot_avail)
{
    var available_slots1 = 0;
    for(var j=0; j<available_blocks.length;j++)
    {
        //fetch the list of the available coordinates 
        available_slots1 = parseInt(available_blocks[j].available);
        if(available_slots1 ==0)
        {
            continue;
        }
        console.log("Available Block"+j+":"+available_blocks[j].block_id);
        templat1 = parseFloat(available_blocks[j].latitude_1);
        templong1 = parseFloat(available_blocks[j].longitude_1);
        templat2 = parseFloat(available_blocks[j].latitude_2);
        templong2 = parseFloat(available_blocks[j].longitude_2);
        
        avail.push(available_slots1);
        console.log("available slots:"+available_slots1);
        park_lat = (templat1 + templat2)/2;
        park_long =(templong1+ templong2)/2;

        spotted_slot = L.latLng(park_lat,park_long);
        destination_slot = L.latLng(l3,l4);
        if(destination_slot.distanceTo(spotted_slot) < 200)
        {
            available_slots1 += available_slots1;
        }            
    }

    force = ((slot_avail+available_slots1)/(dist*dist))*100000;
        console.log("Block id: "+bid);
        console.log("Distance: "+dist);
        console.log("available: "+slot_avail);
        console.log("Force: "+force);
check_maximum_forcevector.call(this, l1, l2, l3, l4, bid, ts,force,dist,slot_avail); 
};
////////////////////////////////////////////////////////////////////////
//function to check whether the selected route has maximum force or not///
////////////////////////////////////////////////////////////////////////
var  check_maximum_forcevector = function(l1, l2, l3, l4, bid, ts,mforce,distfound,slot_avail)
{
     console.log('check_maximum_forcevector');
    if(max_force==undefined || mforce > max_force)             
    {   

            max_force = mforce;
            shortest_lat = l3;
            shortest_long = l4;
            shortest_block_id = bid;
            shortest_timestamp = ts;
            shortest_distance = distfound;
            flag = true;
            update_shortest_route.call(this, l1, l2, shortest_lat, shortest_long, shortest_block_id, shortest_timestamp,max_force,slot_avail);                   //update the map with the shortest distance at the last

    }
    if(mforce == max_force)
    {
        if(distfound<shortest_distance || shortest_distance==undefined)
        {console.log("inside equal");
            max_force = mforce;
            shortest_lat = l3;
            shortest_long = l4;
            shortest_block_id = bid;
            shortest_timestamp = ts;
            shortest_distance = distfound;
            flag = true;
            update_shortest_route.call(this, l1, l2, shortest_lat, shortest_long, shortest_block_id, shortest_timestamp,max_force,slot_avail);  
        }
    }
    else 
    {
      return this;
    }

    console.log("Maximum force_vector="+max_force + "   " + "shortest block id =" + shortest_block_id);
    return this;
  



};

var fetch_route_summary = function()
{
    
    walking_distance = shortest_distance;
    parking_time = (shortest_distance)/10;
    walking_time = (walking_distance)/1.4;
    total_park_time = parking_time + walking_time;
    
    console.log("Distance to park =" + shortest_distance);
    console.log("Time to park =" + parking_time);
    console.log("Distance to walk =" + walking_distance);
    console.log("Time to walk back to the destination from the parking spot = "+ walking_time);
    console.log("Total Time ="+ total_park_time);


    /* var js;
        if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        } else 

        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
      
        xmlhttp.onreadystatechange = function() 
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                js = JSON.parse(xmlhttp.responseText);
                console.log(js);
                block_maintanance();                
            }
        }
        xmlhttp.open("GET","dbupdate.php?q="+shortest_block_id+"&ts="+shortest_timestamp,true);
        xmlhttp.send();
    
    */

};

var block_maintanance = function()
{
  changedblocks.push(shortest_block_id);
  changedblocks.push(shortest_timestamp);
  //console.log(changedblocks);   
  //reset.call(this);
};


var reset = function()
{
   for( var i=0; i<(changedblocks.length)-1; i=i+2)
   {
    console.log(changedblocks[i]);
    console.log(changedblocks[i+1]);
    //call the reset logic from here 
    reset_db.call(this, changedblocks[i], changedblocks[i+1]);
   }
   changedblocks.length = 0;
};

var reset_db = function(bid, ts)
{

var js;
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
                js = JSON.parse(xmlhttp.responseText);
                console.log(js);
            }
        }
        xmlhttp.open("GET","db_reset.php?q="+bid+"&ts="+ts,true);
        xmlhttp.send();
    

};

/////////////////////////////////////////////////////////////////////////////////
/////////////function to update the best route//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var update_shortest_route = function(l1,l2,l3,l4, bid, ts,f_v,s_v)
{
    console.log('update_maximumforce_route');
    //changedblocks.pus()
    return( find_parking_spot.call(this, l1, l2, l3, l4, bid, ts,s_v) );

    //return this;
};


