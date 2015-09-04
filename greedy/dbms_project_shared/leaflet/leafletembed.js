var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap() {
	// set up the map
	var map = L.map('map');

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var routingcontrol = L.Routing.control({
    waypoints: [
        L.latLng(37.806249, -122.423884),
        L.latLng(37.804821, -122.420194)
    ],

    routeWhileDragging: false
}).addTo(map);



//var router = L.Routing.osrm ();
//wpt1 = L.latLng(37.806249, -122.423884);
//wpt2 =  L.latLng(37.804821, -122.420194);
//routewpts = [wpt1, wpt2];
//		console.log(routewpts);



routingcontrol.on ('routeselected', function (e) {


var route = e.route;
    console.log("route found");
    console.log(route.summary.totalDistance);
    console.log(route.summary.totalTime);




});

}