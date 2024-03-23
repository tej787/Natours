

export const displayMap = ()=>{

document.addEventListener('DOMContentLoaded', function() {
  var mapElement = document.getElementById('map');
  var locationsData = mapElement.getAttribute('data-locations');
  var locations = JSON.parse(locationsData.replace(/"/g, '\"'));

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 4
    }),
    interactions: ol.interaction.defaults({mouseWheelZoom:false, dragPan:false, doubleClickZoom:false}) // Disable zooming on scroll, moving the map, and double click zoom
  });

  var extent = ol.extent.createEmpty();

  locations.forEach(function(loc) {
    var element = document.createElement('div');
    element.className = 'marker';

    var marker = new ol.Overlay({
      position: ol.proj.fromLonLat(loc.coordinates),
      positioning: 'bottom-center',
      element: element,
      stopEvent: false
    });

    map.addOverlay(marker);

    // Create a tooltip element
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `Day ${loc.day}: ${loc.description}`;
    element.appendChild(tooltip);

    // Extend the extent to include the location
    ol.extent.extend(extent, ol.proj.transformExtent([loc.coordinates[0], loc.coordinates[1], loc.coordinates[0], loc.coordinates[1]], 'EPSG:4326', 'EPSG:3857'));

    // Add a click event listener to the marker
    element.addEventListener('click', function() {
      // Redirect to Google Maps
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${loc.coordinates[1]},${loc.coordinates[0]}`;
    });
  });

  // Fit the map view to the extent of all locations with some padding
  map.getView().fit(extent, {padding: [200, 150, 100, 100], duration: 2000});
});
}
