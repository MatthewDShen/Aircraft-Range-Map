

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

var mapCenter = [-95.7129,37.0902]

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: mapCenter,
  zoom: 2,
});

map.on('load', function(){

  map.addSource('airport_data', {
    type: 'geojson',
    data: './data/us-airports.geojson'
  });

  map.addLayer({
    'id': 'airport-cirlce',
    'type': 'circle',
    'source': 'airport_data',
    'paint': {
      'circle-color': [
        'match',
        ['get', 'type'],
        'large_airport',
        '#FF0000',
        'medium_airport',
        '#FFFF00',
        'small_airport',
        '#0000FF',
        '#ccc'
      ]
    }
  });


  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'airport-cirlce', function(e) {
  // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;
    const icao_code = e.features[0].properties.ident;
    const elev = e.features[0].properties.elevation_ft;
    const iata_code = e.features[0].properties.iata_code;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var popupContent = `
    <ul>
      <li><strong>Name: </strong>${name}</li>
      <li><strong>ICAO Code :</strong>${icao_code}</li>
      <li><strong>Elevation :</strong>${elev}</li>
      <li><strong>iata_code :</strong>${iata_code}</li>
    </ul>
    `

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
    });

    map.on('mouseleave', 'airport-cirlce', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
});
