

//Create inital variables
var mapCenter = [-96,37]
var aircraft_range = 500


const bounds = [
  [-130,20],
  [-65,50]
];

//Setting up Mabox GL & map//
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'
var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: mapCenter,
  zoom: 2,
  maxBounds: bounds
});

var airport_data = $.getJSON('/data/all-airport-data.json', function(airport_data){
    for (var i = 0; i < airport_data.length; i++) {
        let latlng = [airport_data[i]['Latitude'],airport_data[i]['Longitude']]
        $('#sel').append('<option value=' + latlng + '>'
         + airport_data[i]['LocID'] + '</option>');
    }
    return airport_data
});


$('#sel').change(function(){
    var coords = $('#sel').val().split(',').map(Number);
    coords = coords.reverse();



    const start_marker = new mapboxgl.Marker()
        .setLngLat(coords)
        .addTo(map);

    map.addSource("polygon", createGeoJSONCircle(coords, aircraft_range));

    map.addLayer({
        "id": "polygon",
        "type": "fill",
        "source": "polygon",
        "layout": {},
        "paint": {
            "fill-color": "blue",
            "fill-opacity": 0.6
        }
    });

});

var createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};

