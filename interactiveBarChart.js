let dataset = [];
let myBarChart=null;

function updateChart(selectedMthinOffice) {
  const filteredData = dataset.filter(
    (dataPoint) => dataPoint.MthinOffice === selectedMthinOffice
  );

  const presidentData = {};

  filteredData.forEach((dataPoint) => {
    const president = dataPoint.President;
    const value = dataPoint.Value;

    if (!presidentData[president] || value > presidentData[president]) {
      presidentData[president] = value;
    }
  });

  const sortedData = Object.entries(presidentData).sort((a, b) => b[1] - a[1]);

  const presidents = sortedData.map((entry) => entry[0]);
  const maxValues = sortedData.map((entry) => entry[1]);

  const ctx = document.getElementById("myBarChart").getContext("2d");

  if (myBarChart) {
    myBarChart.destroy();
  }

  myBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: presidents,
      datasets: [
        {
          label: "Max Value",
          data: maxValues,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          barThickness: 15,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          position: "bottom",
        },
        y: {
          beginAtZero: true,
          position: "left",
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return "Max Value: " + context.parsed.y;
            },
          },
        },
      },
    },
  });
}

const mthinOfficeInput = document.getElementById("mthinOfficeInput");
const drawChartButton = document.getElementById("drawChartButton");
const fileInput = document.getElementById("fileInput");

function validateAndDrawChart() {
  const selectedMthinOffice = parseInt(mthinOfficeInput.value, 10);
  
  updateChart(selectedMthinOffice);
}

drawChartButton.addEventListener("click", validateAndDrawChart);

fileInput.addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataArray = XLSX.utils.sheet_to_json(sheet);

    dataset = dataArray;

    validateAndDrawChart();
  };

  reader.readAsBinaryString(file);
}

updateChart();
