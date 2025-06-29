function upload() {
  const input = document.getElementById("fileInput");
  const file = input.files[0];
  if (!file) {
    alert("Please choose a file first.");
    return;
  }

  const status = document.getElementById("status");
  status.textContent = "Uploading and processing...";

  const formData = new FormData();
  formData.append("file", file);

  fetch("https://mutation-mapper-2.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        status.textContent = "Unexpected server response.";
        document.getElementById("resultTable").style.display = "none";
        return;
      }

      if (data.length === 0) {
        status.textContent = "No matches found.";
        document.getElementById("resultTable").style.display = "none";
        clearChart();
        return;
      }

      status.textContent = `Found ${data.length} annotated mutation${data.length > 1 ? "s" : ""}.`;

      const table = document.getElementById("resultTable");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.forEach((row) => {
        const tr = document.createElement("tr");
        const isPathogenic = row.significance.toLowerCase().includes("pathogenic");
        tr.classList.add(isPathogenic ? "pathogenic" : "benign");

        tr.innerHTML = `
          <td>${row.gene}</td>
          <td>${row.mutation}</td>
          <td>${row.type}</td>
          <td>${row.significance}</td>
          <td>${row.disease}</td>
        `;
        tbody.appendChild(tr);
      });

      table.style.display = "table";
      renderGeneChart(data); // new visualization!
    })
    .catch((err) => {
      console.error(err);
      status.textContent = "An error occurred. Please try again.";
      document.getElementById("resultTable").style.display = "none";
      clearChart();
    });
}

function clearAll() {
  document.getElementById("fileInput").value = "";
  document.getElementById("status").textContent = "";
  document.getElementById("resultTable").style.display = "none";
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";
  const filter = document.getElementById("significanceFilter");
  if (filter) filter.value = "all";
  clearChart();
}

function renderGeneChart(data) {
  const geneCounts = {};

  data.forEach((row) => {
    const gene = row.gene;
    geneCounts[gene] = (geneCounts[gene] || 0) + 1;
  });

  const sortedGenes = Object.entries(geneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = sortedGenes.map(([gene]) => gene);
  const counts = sortedGenes.map(([_, count]) => count);

  const canvas = document.getElementById("geneChart");
  const ctx = canvas.getContext("2d");

  // ✅ Safely destroy the previous chart
  if (window.geneChart instanceof Chart) {
    window.geneChart.destroy();
  }

  window.geneChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Mutation Count by Gene",
        data: counts,
        backgroundColor: "#4e79a7",
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Top 10 Most Frequent Mutated Genes",
        },
      },
    },
  });
}

function clearChart() {
  if (window.geneChart instanceof Chart) {
    window.geneChart.destroy();
    window.geneChart = null;
  }
}


window.clearAll = clearAll;
window.upload = upload;
