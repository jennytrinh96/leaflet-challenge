# Earthquake Visualization Leaflet 

## Background
In this challenge, earthquake data within the past 7 days are collected through the United States Geological Survey (USGS) to visualize the number of earthquakes that has occurred around the world. To visualize this data, Leaflet is utilized in order to display the tectonic plates and earthquakes. 

### Instructions
1. Get your dataset. To do so, follow these steps: 

   * The USGS provides earthquake data in a number of different formats, updated every five minutes. Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and choose a dataset to visualize. The following image is an example screenshot of what appears when you visit this link:

    * When you click a dataset (such as "All Earthquakes from the Past 7 Days"), you will be given a JSON representation of that data. Use the URL of this JSON to pull in the data for the visualization. The following image is a sampling of earthquake data in JSON format:

2. Import and visualize the data by doing the following: 

   * Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.

       *  Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.

       * **Hint:** The depth of the earth can be found as the third coordinate for each earthquake.

   * Include popups that provide additional information about the earthquake when its associated marker is clicked.

   * Create a legend that will provide context for your map data.

#### Screenshots
![map1](https://user-images.githubusercontent.com/104868749/195404749-46c7c006-f425-4e85-8100-153faaea201a.png)
![map2](https://user-images.githubusercontent.com/104868749/195404776-1c7ea98f-08b2-4115-b03f-6097efb44ea2.png)
