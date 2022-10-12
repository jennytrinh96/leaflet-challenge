// Create tile layer
var defaultMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});



// Grayscale layer
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// Watercolor layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

// Terrain layer
var terrainMap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

// Topo layer
var topoMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

// Make a basemaps object
let basemaps = {
    GrayScale: grayscale,
    WaterColor: waterColor, 
    Terrain: terrainMap, 
    Topography: topoMap,
    Default: defaultMap
};

// Make map object
var myMap = L.map("map", {
    center: [40.52, 5.34],
    zoom: 2.5, 
    layers: [grayscale, waterColor, terrainMap, topoMap,defaultMap]
});

// Add the defult map to the map
defaultMap.addTo(myMap);


// Add the layer control
// L.control
//     .layers(basemaps)
//     .addTo(myMap);


// Get data for tectonic plates and draw on map
// variable to hold the tectonic plates layer
let tecPlates = new L.layerGroup();

// Call api to get info for plates
// https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData){
    // Check  data
    // console.log(plateData);

    // Load data using geoJson and add to the plates layer group
    L.geoJson(plateData,{
        // Add styling to make lines visible
        color: "yellow", 
        weight: 2
    }).addTo(tecPlates);
});

// Add tectonic plates to the map
tecPlates.addTo(myMap);

// Variable to hold earthquake data layer
let earthquakes = new L.layerGroup();

// Get data for earthquakes and populater layer
// Call api to get data - Past 7 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    function(earthquakeData){

        // Test Data
        console.log(earthquakeData);

        // Plot circles, where radius is dependent on mag
        // and color is dependent on size

        // Make a function that chooses the color of data point
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if (depth > 70)
                return "#fc4903";
            else if (depth > 50)
                return "#fc8403";
            else if (depth > 30)
                return "#fcad03";
            else if (depth > 10)
                return "#cafc03";
            else 
                return "green";
        }

        // Make a function to determine size of radius
        function radiusSize(mag){
            if (mag == 0)
                return 1; // makes sure an earthquake of 0 mag is visible
            else
                return mag * 5; // makes sure circle is amplified by mag size
        }

        // Add on to the style for each data point
        function dataStyle(feature) // 'feature' references earthquakeData 
        {
            return {
                opacity: .5, 
                fillOpacity: .65, 
                fillColor: dataColor(feature.geometry.coordinates[2]), //fill color is referenced to 'depth' in data
                color: "000000", // black outline
                radius: radiusSize(feature.properties.mag), // references the mag
                weight: .5, 
                stroke: true
            }
        }

        // Add the geoJson data to earthquakes layer group 
        L.geoJson(earthquakeData, {
            // Make each feature a marker that is on the map, each marker is a circle
            pointToLayer: function(feature, latLng) {
                return L.circleMarker(latLng);
            },

            // Set the style for each marker
            style: dataStyle, // Calls the data style function and passes in the earthquake data
            // add popups
            onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude: <b>${feature.properties.mag}</b><br>
                                Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                                Location: <b>${feature.properties.place}</b>`);
            }
        }).addTo(earthquakes);
    }

);

// Add earthquake layer to the map
earthquakes.addTo(myMap);

// Add the overlay layer for tectonic plates
let overlays = {
    "Tectonic Plates": tecPlates, 
    "Earthquake Data": earthquakes
};

// Add the layer control - add overlay layer so that we can toggle plates on/off
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);

// Add overlay to map for legend
let legend = L.control({
    position: "bottomright"
});

// Add properties for legend
legend.onAdd = function() {
    // Create a div for legend to appear on page
    let div = L.DomUtil.create("div", "info legend");

    // Set up the interals
    let intervals = [-10, 10, 30, 50, 70, 90];

    // Set the colors for the intervals
    let colors = [
        "green", 
        "#cafc03", 
        "#fcad03",
        "#fc8403", 
        "#fc4903", 
        "red"
    ];

    // Loop thru the intervals and the colors and generate a label
    // with a colored square for each interval
    for(var i = 0; i < intervals.length; i++)
    {
        // inner html that sets the square for each interval and label
        div.innerHTML += "<i style= 'background: "
        + colors[i]
        + "'></i> "
        + intervals[i]
        + (intervals[i + 1] ? "km - " + intervals[i + 1] + "km <br>" : "+"); // adds a dash
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);


/* 
Create tile layer

Make map object

Add in default map

function addTo to add defaultmap to the map objects

Add in grayscale map and other types of maps then add to map objects

Add layer control - link the basemaps and then addTo myMap

Create overlays for tectonic plate lines and load data in for the plates then addTo myMap

Create variable to hold earthquake data layer

Gather data for earthquakes from api 

Under d3 api call for earthquake data do the following: 
    Make a function to choose the color of datapoint using if statements

    Make a function to determine the size of circle marker dependent on magnitude using if statments

    Make a function to style the circle markers 

    Add geoJson data to earthquakes layer group
        Add  each feature ( earthquakes) and create a circle marker using the lat/lng coords

        Style each data points

        Add popups

Add earthquakes to myMap
Add earthquakes to overlays 

Create an overlay for legend 
    Create a div so legend can appear on page

    Add in info for legend (colors and intervals)

    Create loop for innerHTML

Add legend to myMap

*/