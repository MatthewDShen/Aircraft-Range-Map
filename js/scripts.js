

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

var mapCenter = [-95.7129,37.0902]

const bounds = [
  [-130,20],
  [-65,50]
];

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: mapCenter,
  zoom: 2,
  maxBounds: bounds
});

map.on('load', function(){
  // const marker = new mapboxgl.Marker()
  //   .setLngLat([Longitude,Latitude])
  //   .addTo(map);

  map.addSource('airports', {
    type: 'geojson',
    data: './data/all-airport-data.geojson'
  });
});
