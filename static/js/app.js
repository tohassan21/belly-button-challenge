// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(meta => meta.id == sample)[0];
    console.log("Filtered result:", result);

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      sampleMetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(meta => meta.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    let bubbleData = [bubbleTrace];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      showlegend: false
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    let barData = [barTrace];

    // Render the Bar Chart
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option")
              .text(sample)
              .property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];


    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log("New sample selected:", newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
