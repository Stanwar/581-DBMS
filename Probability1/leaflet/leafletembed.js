 var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var getday, getcong;
var d, loc;
var dest_lat, dest_long;
var shortest_destination;
var allnodes;
var USER=[];
var USER_TIME=[];
var USER_DISTANCE=[];
var visitedblocks=[];
var visitedblockslatlong=[];
var hops=1;
var finaldistance=0;
var finaltime=0;
var finalwalkingdistance=0;
var finalwalkingtime=0;
var finaltotaltime=0;


String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}


function find_parking_spot(l1,l2){

if(map!=undefined)
 {
    this.map.remove();
    this.map=null;
   
 }
    map = new L.map('map');
   

 
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

                var latmid=[];
                var longmid=[];
                
                
                //var userinput='2012-04-09 15:00:00';
                var userinput=getday;
                var dx = new Date(userinput);
                var day=dx.getDay();
                
                var time =userinput.substring(11);
                var congestionfactor =parseInt(getcong);
                var date;
                $.post('getall.php', function(anodes) {
                  allnodes = JSON.parse(anodes);
                  visitedblockslatlong=[];
                  visitedblocks=[];
                  //2012-04-06 6th april friday
                  //2012-05-05 5th may saturday
                  switch(day)
                  {
                    case 0:
                        date = "2012-04-08";
                        break;
                    case 1:
                        date = "2012-04-09";
                        break;
                    case 2:
                        date = "2012-04-10";
                        break;
                    case 3:
                        date = "2012-04-11";
                        break;
                    case 4:
                        date = "2012-04-12";
                        break;
                    case 5:
                        date = "2012-04-06";
                        break;
                    case 6:
                        date = "2012-04-07";
                        break;
                  }
                  
                  var a = parseInt(""+time.charAt(0)+time.charAt(1));
                  a=a+1;
                  if((a.toString()).length==2)
                  {
                    if(a==10||a==11)
                    {
                      var plushour=a.toString()+time.substring(2);
                      a=a-2;
                      var minushour="0"+a.toString()+time.substring(2);
                     
                    }
                    else if(a==24)
                    {
                      var plushour="00"+time.substring(2);
                      a=a-2;
                      var minushour=a.toString()+time.substring(2);
                      
                    }else
                    {
                      var plushour=a.toString()+time.substring(2);
                      a=a-2;
                      var minushour=a.toString()+time.substring(2);
                      
                    }
                    
                  }else{
                    if(a==1)
                    {
                      var plushour="0"+a.toString()+time.substring(2);
                        
                        var minushour="23"+time.substring(2);
                        
                    }else{
                        var plushour="0"+a.toString()+time.substring(2);
                        a=a-2;
                        var minushour="0"+a.toString()+time.substring(2);
                        
                    }
                    
                  }
                  var st=[];
                  var et=[];
                  var count=0;
                  while(count<4)
                  {
                    st.push(date+' '+minushour);
                    et.push(date+' '+plushour);
                    
                    var b = parseInt(""+date.charAt(8)+date.charAt(9));
                    b=b+7;
                    if(b>30)
                    {
                      b=b-30;
                      date=date.substring(0,5)+'05-0'+b.toString();
                    }else
                    {
                      date=date.substring(0,8)+b.toString();
                    }
                    count++;
                  }
                  count=0;
                  
                    
                   $.post('getdata.php', {starttime1:st[0], endtime1:et[0], starttime2:st[1], endtime2:et[1],starttime3:st[2], endtime3:et[2],starttime4:st[3], endtime4:et[3]}, function(data) {
                      
                    var RADIUS = 0;
                    var didyoufind = false;
                    do{
                    RADIUS = RADIUS + 100;
                    var d=L.latLng(l1, l2);
                    var filterCircle = L.circle(d, RADIUS, {  
                        opacity: 1,
                        weight: 1,
                        fillOpacity: 0.4
                    }).addTo(map);



                    var information = JSON.parse(data);
                    


                    var selectedblocks=[];
                    var selectedblockslatlong=[];

                    
                    var meanblock = {};
                    console.log("----------------------");
                    console.log("Blocks inside radius :" );

                    for (var i = 0; i < allnodes.length; i++) {
                    
                    latmid.push(((parseFloat(allnodes[i].latitude_1))+(parseFloat(allnodes[i].latitude_2)))/2.0);
                    longmid.push(((parseFloat(allnodes[i].longitude_1))+(parseFloat(allnodes[i].longitude_2)))/2.0);
                    var c=L.latLng(latmid[i],longmid[i] );
                    
                    if((d.distanceTo(c))<RADIUS)
                    { 

                     
                      var bid=allnodes[i].block_id;
                      L.marker([latmid[i], longmid[i] ]).addTo(map);

                     
                      selectedblocks.push(bid);
                      selectedblockslatlong.push(L.latLng(latmid[i],longmid[i] ));
                      console.log(bid+ " ---> "+ L.latLng(latmid[i],longmid[i] ) );
                     var count=0;
                    var allmean=[];
                    while(count<4)
                    {    
                     var iarray = [];
                      var darray =[];
                    var mean;
                    var info=information[count];
                    var flag=0;
                      for(var j=0;j<info.length;j++)
                      {
                        if(((info[j])[0])==bid)
                        {
                          
                          flag=1;   
                          iarray.push((info[j])[1]);
                          darray.push(Date.parse((info[j])[2]));
                          
                        }
                     }
                     if(flag==0)
                      {
                        
                        mean=0;
                      }else{
                        var sum=0;
                        var diff=0;
                        var fin=0;
                        if(iarray.length==1)
                        {
                            
                            fin=iarray[0];
                        }else
                        {
                           for (var k = 0; k < iarray.length-1; k++) {
                            diff=diff+((darray[k+1]-darray[k])*0.001);
                            sum=sum+(((darray[k+1]-darray[k])*0.001)*iarray[k]);
                            
                            
                          }
                          diff=diff+((Date.parse(et[count])-darray[length])*0.001);
                          sum=sum+(((Date.parse(et[count])-darray[length])*0.001)*iarray[k]);
                          fin=sum/diff;
                        }
                        
                        mean=fin;
                      }
                      allmean.push(mean);
                          
                          if(count==3)
                          {

                            meanblock[bid]=allmean;
                          }   
                         count++;
                      } 
                    }

                    } 
                    var actualmean = [];
                    var actualvariance = [];
                    var actualdeviation = [];
                    for(var z=0;z<selectedblocks.length;z++)
                        { 
                          console.log("----------------------");
                          console.log(" Selectedblock : "+selectedblocks[z]);
                          
                          console.log(" Weighted Avgs for 4 "+day+"'s : "+meanblock[selectedblocks[z]]);
                          var sum=0;

                          for(var k=0;k<meanblock[selectedblocks[z]].length;k++)
                            { 
                               
                              sum=sum+parseFloat((meanblock[selectedblocks[z]])[k]);
                              
                            }
                            actualmean.push(sum/4);
                            console.log("Mean : "+ actualmean[z]);
                            
                           
                         
                            
                            var sum2=0;
                            for(var k=0;k<meanblock[selectedblocks[z]].length;k++)
                            { 
                               
                              sum2=sum2+Math.pow(parseFloat((meanblock[selectedblocks[z]])[k])-actualmean[z],2);
                              
                            }
                            actualvariance.push(sum2/4);
                            console.log( "Variance : "+actualvariance[z]);
                            actualdeviation.push(Math.sqrt(actualvariance[z]));
                            console.log( "Deviation : "+actualdeviation[z]);


                        }
                         var swapped;
                        do {
                            swapped = false;
                            for (var i=0; i < selectedblocks.length-1; i++) {
                                if (actualmean[i] <actualmean[i+1]) {
                                    var temp = actualmean[i];
                                    actualmean[i] = actualmean[i+1];
                                    actualmean[i+1] = temp;
                                  
                                    var temp2 = selectedblocks[i];
                                    selectedblocks[i] = selectedblocks[i+1];
                                    selectedblocks[i+1] = temp2;
                                    

                                    var temp3 = selectedblockslatlong[i];
                                    selectedblockslatlong[i] = selectedblockslatlong[i+1];
                                    selectedblockslatlong[i+1] = temp3;

                                    var temp4 = actualvariance[i];
                                    actualvariance[i] = actualvariance[i+1];
                                    actualvariance[i+1] = temp4;

                                    var temp5 = actualdeviation[i];
                                    actualdeviation[i] = actualdeviation[i+1];
                                    actualdeviation[i+1] = temp5;

                                  
                                    swapped = true;

                                }
                            }
                        } while (swapped);
                        

                        console.log("----------------------");
                        console.log("Sorting blocks ..");
                         for(var z=0;z<selectedblocks.length;z++)
                        { 
                          console.log("Selectedblock : "+selectedblocks[z]);
                          console.log(" Sorted Mean : "+ actualmean[z]);
                        }
                        //Lesser deviation
                        //Lesser deviation
                       
                        var myf = 0;
                        var myfdev=[];
                        var myfselblocks=[];
                        var myfselblockslatlong=[];

                         var swapped1;
                        do {
                            swapped1 = false;
                            for (var i=0; i < selectedblocks.length-1; i++) {
                               

                            if((actualmean[i]-actualmean[i+1])<((20/100)*actualmean[i]))
                            {
                                if (actualdeviation[i] >actualdeviation[i+1]) {
                                    myf=1;
                                    var temp = actualmean[i];
                                    actualmean[i] = actualmean[i+1];
                                    actualmean[i+1] = temp;
                                  
                                    var temp2 = selectedblocks[i];
                                    selectedblocks[i] = selectedblocks[i+1];
                                    selectedblocks[i+1] = temp2;
                                    

                                    var temp3 = selectedblockslatlong[i];
                                    selectedblockslatlong[i] = selectedblockslatlong[i+1];
                                    selectedblockslatlong[i+1] = temp3;

                                    var temp4 = actualvariance[i];
                                    actualvariance[i] = actualvariance[i+1];
                                    actualvariance[i+1] = temp4;

                                    var temp5 = actualdeviation[i];
                                    actualdeviation[i] = actualdeviation[i+1];
                                    actualdeviation[i+1] = temp5;

                                    
                                    swapped1 = true;

                                }
                              }
                            
                            }
                        } while (swapped1);

                       
                        if(myf==1)
                        {
                          console.log("----------------------");
                          console.log("Top means vary less than 20%, resorting blocks with least deviation among them");
                           for(var z=0;z<selectedblocks.length;z++)
                          { 
                            console.log(" Selectedblock : "+selectedblocks[z]);
                            console.log(" Sorted Mean : "+ actualmean[z]);
                            
                          }
                        }
                       

                        var selectedblockscurrent;
                        var okdata;
                          for(var v=0; v<selectedblocks.length;v++)
                        {

                        if(selectedblocks[0])
                        { 

                           $.ajax({
                             type: "POST",
                             url:'available.php',
                             data:{udate:userinput, bid:selectedblocks[v]},
                             async: false, 
                             success: function f1(data){
                               okdata = JSON.parse(data);

                              console.log(okdata[0] );
                              switch(congestionfactor)
                                {
                                  case 0:
                                  selectedblockscurrent=okdata[0].available_current ;
                                  break;
                                  case 20:
                                  selectedblockscurrent=okdata[0].available_current_20 ;
                                  break;
                                  case 40:
                                  selectedblockscurrent=okdata[0].available_current_40 ;
                                  break;
                                  case 60:
                                  selectedblockscurrent=okdata[0].available_current_60 ;
                                  break;
                                  
                                }
                              }
                          });
                            if((visitedblocks.indexOf(selectedblocks[v]))==-1)
                          {

                            
                            if(visitedblocks.length==0)
                            {
                                
                                routingcontrol = L.Routing.control({
                                waypoints: [
                                    L.latLng(l1, l2),
                                    L.latLng(selectedblockslatlong[v])
                                ],
                                uid:hops,
                                routeWhileDragging: false
                               }).addTo(map);
                                routingcontrol2 = L.Routing.control({
                                waypoints: [
                                    L.latLng(selectedblockslatlong[v]),
                                    L.latLng(l1, l2)
                                    
                                ],
                                uid:hops,
                                routeWhileDragging: false
                               }).addTo(map);

                                routingcontrol.on ('routeselected' ,function (e) {
                              
                                    var route = e.route;
                                        finaldistance=finaldistance+route.summary.totalDistance;
                                        finaltime=finaltime+route.summary.totalTime;
                                        finaltotaltime=finaltotaltime+finaltime
                                        console.log("uid "+route.myuid);
                                        console.log("Distance  is : "+route.summary.totalDistance);
                                        console.log("Total Time   : "+route.summary.totalTime);                      
                                    });

                                 routingcontrol2.on ('routeselected' ,function (e) {
                              
                                    var route = e.route;
                                  
                                      //  finaltime=finaltime+route.summary.totalTime;
                                        finalwalkingdistance=route.summary.totalDistance;
                                        finalwalkingtime=Math.ceil(finalwalkingdistance/1.38582);
                                        finaltotaltime=finaltotaltime+finalwalkingtime;
                                        console.log("uid "+route.myuid);
                                        console.log("Wallking Distance  is : "+route.summary.totalDistance);
                                        console.log("Wallking Time   : "+finalwalkingtime);                      
                                    });
                            }else{
                                   finaltotaltime=0;
                                    routingcontrol = L.Routing.control({
                                    waypoints: [
                                        L.latLng(visitedblockslatlong[visitedblockslatlong.length-1]),
                                        L.latLng(selectedblockslatlong[v])
                                    ],  
                                    uid:hops,
                                    routeWhileDragging: false
                                }).addTo(map);
                                     routingcontrol2 = L.Routing.control({
                                waypoints: [
                                    L.latLng(selectedblockslatlong[v]),
                                    L.latLng(l1, l2)
                                    
                                ],
                                uid:hops,
                                routeWhileDragging: false
                               }).addTo(map);

                                    routingcontrol.on ('routeselected' ,function (e) {
                              
                                    var route = e.route;
                                        finaldistance=finaldistance+route.summary.totalDistance;
                                        finaltime=finaltime+route.summary.totalTime;
                                        console.log("uid "+route.myuid);
                                        console.log("Distance  is : "+route.summary.totalDistance);
                                        console.log(" Time   : "+route.summary.totalTime);
                                        console.log("Total Distance  is : "+finaldistance); 
                                        console.log("Total Time   is: "+finaltime);  
                                        finaltotaltime= finaltotaltime+finaltime;
                                                       
                                    });
                                    routingcontrol2.on ('routeselected' ,function (e) {
                              
                                    var route = e.route;
                                  
                                      
                                        finalwalkingdistance=route.summary.totalDistance;
                                        finalwalkingtime=Math.ceil(finalwalkingdistance/1.38582);
                                        finaltotaltime=finaltotaltime+finalwalkingtime;
                                        console.log("uid "+route.myuid);
                                        console.log("Wallking Distance  is : "+route.summary.totalDistance);
                                        console.log("Wallking Time   : "+finalwalkingtime);                      
                                    });
                            }
                            
                            visitedblocks.push(selectedblocks[v]);
                            visitedblockslatlong.push(selectedblockslatlong[v]);
                             if(selectedblockscurrent>0)
                            {
                              myroutingblock=selectedblockslatlong[v];
                               console.log("Hit" );
                              didyoufind = true;
                              break;
                            }else
                            {
                              hops++;
                              console.log("Miss" );
                            }
                          }else
                          {
                            
                          }
                        }
                        
                      }
                        
                       }while(didyoufind==false);
                        

                    });

                    
                    
                    
                   
                  });
                  
                

        
       
        
}



////////////////////////////////////////////////
//////logic for the  query to the MYSQL//////////
///////////////////////////////////////////////

//function to fetch the input values
function find_dest()
{
d =  document.form1.destination.selectedIndex;
loc = document.form1.destination.options[d].value;
//alert(loc);

//findblock(loc);
getday = document.form1.dayfield.value;
getcong = document.form1.congfield.value;
//alert(timestamp);
//got variables




findblock(loc);

}

//finds the node info as of now
function findblock(str1) {
    
    if (str1 == "" ) {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else
       { 


        $.post('getnode.php', {q:str1}, function(data) {
          var js = JSON.parse(data);
                //console.log(js.length);
                
                
              intended_destination(js);
        });
      }  
}






//get the geo spatial information for the user's inteded destination
function intended_destination(jsonstring)
{

  var out; 
  var i;
  for (var i = 0; i < jsonstring.length; i++) {

    out = jsonstring[i].node_id + "   " + jsonstring[i].node_name +  "   " +jsonstring[i].latitude +  "   " + jsonstring[i].longitude;
   
    dest_lat = jsonstring[i].latitude;
    dest_long = jsonstring[i].longitude;
   
    
  //initmap();
  //initiate a call to the map to find the best route
   find_parking_spot.call(this, dest_lat, dest_long);
  }
document.getElementById("txtHint").innerHTML = out;

}

                       