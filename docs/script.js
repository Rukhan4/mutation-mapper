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
        return;
      }

      status.textContent = `Found ${data.length} annotated mutation${data.length > 1 ? "s" : ""}.`;

      const table = document.getElementById("resultTable");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.forEach((row) => {
        const tr = document.createElement("tr");
        // Color rows red if significance includes "pathogenic", else green
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
    })
    .catch((err) => {
      console.error(err);
      status.textContent = "An error occurred. Please try again.";
      document.getElementById("resultTable").style.display = "none";
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
}



window.clearAll = clearAll;
window.upload = upload;