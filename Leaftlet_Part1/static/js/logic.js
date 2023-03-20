/// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
  
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
  
// Only one base layer can be shown at a time.
// Create a baseMaps object to contain the streetmap and the darkmap.
var baseMaps = {
    Street: street,
    Topography: topo
};
  
// Overlays that can be toggled on or off
// Create a map object, and set the default layers.c
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: street
  });
// Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
L.control.layers(baseMaps).addTo(myMap);


d3.json(link).then(function(data) {
    function styleInfo(feature) {
        return {
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
      //the color of the marker (circles on the map) based on the magnitude of the earthquake.
    function getColor(depth) {
        if (depth >= 90) return "#e92684"; 
        else if(depth >= 70) return "#e95d26"; 
        else if(depth >= 50) return "#ee9c00"; 
        else if (depth >= 30) return "#eecc00"; 
        else if (depth >= 10) return "#d4ee00"; 
        else if (depth >= -10) return "#00ee8f"; 
        else return "#FFEDA0";
    }
    function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
    }

    // Creating a GeoJSON layer with the retrieved data).addTo(myMap); 
    L.geoJson(data, 
        {
            // We turn each feature into a circleMarker on the map.
            pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng);
            },
            style: styleInfo, 
            // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
            onEachFeature: function(feature, layer) {
              layer.bindPopup(
                "Magnitude: "
                  + feature.properties.mag
                  + "<br>Depth: "
                  + feature.geometry.coordinates[2]
                  + "<br>Location: "
                  + feature.properties.place
              );
            }
        }).addTo(myMap)
    // Here we create a legend control object.
   
  
  // Here we create a legend control object.
  var legend = L.control({position: "bottomright"});
  // Then add all the details for the legend
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
    // legend discription
    grades = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h4>Depth of the Earthquakes</h4>";
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      
  
    }
  return div;
}
  // put legend to the map.
  legend.addTo(myMap);
});