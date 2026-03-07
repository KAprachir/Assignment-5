let currentTab = "all";

let globalIssues = [];

const countElement = document.getElementById("count");

const activeTab = ["btn-primary"];
const inactiveTab = ["btn-outline"];

// switing tab
const switchTab = (tab) => {
  currentTab = tab;
  const tabs = ["all", "open", "closed"];
  for (let t of tabs) {
    const tabName = document.getElementById(t + "Tab");
    if (t === tab) {
      tabName.classList.remove(...inactiveTab);
      tabName.classList.add(...activeTab);
    } else {
      tabName.classList.add(...inactiveTab);
      tabName.classList.remove(...activeTab);
    }
  }
  if (tab === "all") {
    displayIssues(globalIssues);
    countElement.innerText = globalIssues.length + " Issues";
  } else {
    const filtered = globalIssues.filter((issue) => issue.status === tab);
    displayIssues(filtered);
    countElement.innerText = filtered.length + " Issues";
  }
};
// loading spinner
const showLoader = () => {
  document.getElementById("allIssuesContainer").innerHTML =
    `<span class="loading loading-bars loading-xl col-span-4 mx-auto p-10"></span>`;
};
// loading all issues
const allIssues = async () => {
  showLoader();
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const data = await res.json();
  globalIssues = data.data;
  displayIssues(globalIssues);
  switchTab(currentTab);
};

const searchIssues = () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    const filtered = globalIssues
      .filter((issue) => currentTab === "all" || issue.status === currentTab)
      .filter((issue) => issue.title.toLowerCase().includes(searchValue));

    displayIssues(filtered);
    countElement.innerText = filtered.length + " Issues";
  });
};

const displayIssues = (issues) => {
  const allIssuesContainer = document.getElementById("allIssuesContainer");
  allIssuesContainer.innerHTML = "";
  if (issues.length === 0) {
    allIssuesContainer.innerHTML = `<p class="text-center col-span-4 text-gray-500">No issues found</p>`;
    return;
  }
  issues.forEach((issue) => {
    const issueCard = document.createElement("div");
    issueCard.className = `card bg-base-100 shadow-sm p-5 space-y-3 border-t-2 ${issue.status === "open" ? "border-green-600" : "border-purple-600"}`;

    issueCard.innerHTML = `                
      <div class="flex justify-between">
        ${issue.status === "open" ? '<img src="./assets/Open-Status.png" alt=""></img>' : '<img src="./assets/Closed- Status .png" alt="">'}
        <div class="badge badge-soft ${issue.priority === "high" ? "badge-error" : issue.priority === "medium" ? "badge-warning" : "badge-primary"} ">${issue.priority}</div>
      </div>
      <div class="mb-5">
        <h3 onclick = 'fetchissueDetails(${issue.id})' class="text-lg font-semibold">${issue.title}</h3>
        <p class="text-[#64748B] text-sm my-3 line-clamp-2">${issue.description}</p>
        <div class="labels-container">
          ${issue.labels
            .map((label) => {
              const isBug = label === "bug";
              const badgeClass = isBug ? "badge-error" : "badge-warning";
              const iconClass = isBug ? "fa-bug" : "fa-life-ring";

              return `
                <div class="badge badge-soft ${badgeClass}">
                  <i class="fa-solid ${iconClass}"></i>
                  ${label}
                </div>`;
            })
            .join("")}
         </div>
      </div>
      <div class="border-t-2 border-[#E4E4E7] p-5">
        <p class="text-[#64748B] text-sm">${issue.author}</p>
        <p class="text-[#64748B] text-sm">${new Date(issue.createdAt).toLocaleDateString()}</p>

      </div>`;
    allIssuesContainer.append(issueCard);
  });
};

const fetchissueDetails = (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showModal(data.data);
    });
};

const showModal = (details) => {
  const modalContainer = document.getElementById("my_modal");
  modalContainer.innerHTML = "";
  const modalBox = document.createElement("div");
  modalBox.className = "modal-box space-y-3";
  modalBox.innerHTML = `
  <h2 class="text-2xl font-bold">${details.title}</h2>
    <div class="flex gap-2">
        ${details.status === "open" ? '<div class="badge badge-success">Open</div>' : '<div class="badge badge-error">Closed</div>'}
        <ul class="flex gap-2 text-[#64748B] text-sm">
            <li>Opened by ${details.assignee}</li>
            <li>${new Date(details.updatedAt).toLocaleDateString()}</li>
        </ul>
    </div>
    <div class="labels-container">
        ${details.labels
          .map((label) => {
            const isBug = label === "bug";
            const badgeClass = isBug ? "badge-error" : "badge-warning";
            const iconClass = isBug ? "fa-bug" : "fa-life-ring";

            return `
        <div class="badge badge-soft ${badgeClass}">
            <i class="fa-solid ${iconClass}"></i>
            ${label}
        </div>`;
          })
          .join("")}
    </div>
    <p class="text-[#64748B]">${details.description}</p>
    <div class="grid grid-cols-2 p-5 bg-base-200 rounded-sm">
        <div>
            <p>Assignee:</p>
            <h3>${details.assignee}</h3>
        </div>
        <div>
            <p>Priority:</p>
            <div class="badge badge-soft ${details.priority === "high" ? "badge-error" : details.priority === "medium" ? "badge-warning" : "badge-primary"} ">${details.priority}</div>
        </div>
    </div>
    <div class="modal-action">
        <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
        </form>
    </div>
  `;
  modalContainer.append(modalBox);
  modalContainer.showModal();
};
allIssues();
searchIssues();
