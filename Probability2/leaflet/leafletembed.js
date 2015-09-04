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
var selectedblocks=[];
var selectedblockslatlong=[];
var selectedblocksforce=[];
var userinput;
var congestionfactor;
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
                // var day=getday;
                // var time =gettime;
                userinput=getday;
                var dx = new Date(userinput);
                var day=dx.getDay();
                
                var time =userinput.substring(11);
                congestionfactor =parseInt(getcong);
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
                    
                    



                    var information = JSON.parse(data);
                    


                    selectedblocks.length=0;
                    selectedblockslatlong.length=0;
                    selectedblocksforce.length=0;
                    
                    var meanblock = {};
                   

                    for (var i = 0; i < allnodes.length; i++) {
                    
                    latmid.push(((parseFloat(allnodes[i].latitude_1))+(parseFloat(allnodes[i].latitude_2)))/2.0);
                    longmid.push(((parseFloat(allnodes[i].longitude_1))+(parseFloat(allnodes[i].longitude_2)))/2.0);
                    var c=L.latLng(latmid[i],longmid[i] );
                    
                  

                     
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
                    var actualmean = [];
                    var actualvariance = [];
                    var actualdeviation = [];
                    console.log("My selected blocks"+selectedblocks);
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
                            


                        }
                        
                        for(var v=0; v<selectedblocks.length;v++)
                        {
                          
                            routingcontrol = L.Routing.control({
                                waypoints: [
                                    L.latLng(l1, l2),
                                    L.latLng(selectedblockslatlong[v])
                                ],
                                uid:selectedblocks[v]+"#"+selectedblockslatlong[v]+"*"+actualmean[v],
                                routeWhileDragging: false
                               }).addTo(map);

                            routingcontrol.on ('routeselected' ,function (e) {
                              
                                    var route = e.route;
                                        var iofhash=route.myuid.indexOf("#");
                                        var iofstar=route.myuid.indexOf("*");
                                        console.log("uid "+route.myuid);
                                        console.log("Distance  is : "+route.summary.totalDistance);
                                        console.log("Total Time   : "+route.summary.totalTime); 
                                        console.log("actualmean   : "+route.myuid.substring(iofstar+1)); 

                                        var ftemp=((route.myuid.substring(iofstar+1))/(route.summary.totalDistance*route.summary.totalDistance));
                                        console.log("ftemp   : "+ftemp); 
                                       
                                        selectedblocksforce.push(route.myuid.substring(0,iofhash)); 
                                        selectedblocksforce.push(ftemp); 
                                        selectedblocksforce.push(route.myuid.substring(iofhash+1,iofstar));
                                        console.log("selbfor"+selectedblocksforce);                  
                            });
                         
                        } 
                         

                       
                        
                      
                        

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

 function myCalFunction() {
      if(map!=undefined)
   {
      this.map.remove();
      this.map=null;
     
   }
    map = new L.map('map');
    var selbl=[];
    var selfor=[];
    var sellat=[];
        for(var q=0;q<selectedblocksforce.length-1;q=q+3)
       {
           selbl.push(selectedblocksforce[q]);
           selfor.push(selectedblocksforce[q+1]);
           sellat.push(selectedblocksforce[q+2]);
       }
        var swapped;
                        do {
                            swapped = false;
                            for (var i=0; i < selbl.length-1; i++) {
                                if (selfor[i] <selfor[i+1]) {
                                    var temp = selfor[i];
                                    selfor[i] = selfor[i+1];
                                    selfor[i+1] = temp;
                                  
                                    var temp2 = sellat[i];
                                    sellat[i] = sellat[i+1];
                                    sellat[i+1] = temp2;
                                    

                                    var temp3 = selbl[i];
                                    selbl[i] = selbl[i+1];
                                    selbl[i+1] = temp3;

                                    

                                  
                                    swapped = true;

                                }
                            }
                        } while (swapped);
                        
                        var selectedblockscurrent;
                        var okdata;
                            for(var v=0; v<selbl.length;v++)
                        {

                        if(selbl[0])
                        { 

                           $.ajax({
                             type: "POST",
                             url:'available.php',
                             data:{udate:userinput, bid:selbl[v]},
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

                            var iofstart=sellat[v].indexOf("(");
                            var iofcomma=sellat[v].indexOf(",");
                            var iofend=sellat[v].indexOf(")");
                            if(visitedblocks.length==0)
                            {
                                
                                
                                routingcontrol = L.Routing.control({
                                waypoints: [
                                    L.latLng(dest_lat, dest_long),
                                    L.latLng(sellat[v].substring(iofstart+1,iofcomma),sellat[v].substring(iofcomma+2,iofend))
                                ],
                                uid:hops,
                                routeWhileDragging: false
                               }).addTo(map);
                                routingcontrol2 = L.Routing.control({
                                waypoints: [
                                    L.latLng(sellat[v].substring(iofstart+1,iofcomma),sellat[v].substring(iofcomma+2,iofend)),
                                    L.latLng(dest_lat, dest_long)
                                    
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
                                        console.log("Wallking Time ss  : "+finalwalkingtime);                      
                                    });
                            }else{
                              var iofstart2=visitedblockslatlong[visitedblockslatlong.length-1].indexOf("(");
                            var iofcomma2=visitedblockslatlong[visitedblockslatlong.length-1].indexOf(",");
                            var iofend2=visitedblockslatlong[visitedblockslatlong.length-1].indexOf(")");
                                   finaltotaltime=0;
                                    routingcontrol = L.Routing.control({
                                    waypoints: [
                                        L.latLng(visitedblockslatlong[visitedblockslatlong.length-1].substring(iofstart2+1,iofcomma2),visitedblockslatlong[visitedblockslatlong.length-1].substring(iofcomma2+2,iofend2)),
                                        L.latLng(sellat[v].substring(iofstart+1,iofcomma),sellat[v].substring(iofcomma+2,iofend))
                                    ],  
                                    uid:hops,
                                    routeWhileDragging: false
                                }).addTo(map);
                                     routingcontrol2 = L.Routing.control({
                                waypoints: [
                                    L.latLng(sellat[v].substring(iofstart+1,iofcomma),sellat[v].substring(iofcomma+2,iofend)),
                                    L.latLng(dest_lat, dest_long)
                                    
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
                                        console.log("Wallking Time dd  : "+finalwalkingtime);                      
                                    });
                            }
                            
                            visitedblocks.push(selbl[v]);
                            visitedblockslatlong.push(sellat[v]);
                             if(selectedblockscurrent>0)
                            {
                              myroutingblock=sellat[v];
                               console.log("Hit" );
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
                                       }

                       