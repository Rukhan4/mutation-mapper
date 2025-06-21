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
  body: formData
})

    .then(res => res.json())
    .then(data => {
      status.textContent = `Found ${data.length} annotated mutations.`;
      const table = document.getElementById("resultTable");
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";

      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.gene}</td>
          <td>${row.mutation}</td>
          <td>${row.type}</td>
          <td>${row.significance}</td>
          <td>${row.disease}</td>
        `;
        tbody.appendChild(tr);
      });

      table.style.display = data.length ? "table" : "none";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "An error occurred. Please try again.";
    });
}
