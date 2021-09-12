const generateButton = document.getElementById("generate-ticket-button");
const openDirectlyButton = document.getElementById("login-new-tab-button");
const ticketInput = document.getElementById("ticket");

if (ticketInput) setEvents();
else
  generateButton.addEventListener("click", () =>
    alert("Algum cabeção sumiu com o id do input.")
  );

function handleGenerateTicketClick() {
  ticketInput.value = "Gerando...";

  chrome.storage.sync.get("requestData", async (storedData) => {
    const requestData = storedData?.requestData || {};

    console.log(requestData);

    try {
      const response = await fetch(
        "https://api.github.com/users/angeloevangelista",
        { method: "GET" }
      );

      const data = await response.json();

      if (response.status !== 200) throw new Error(data);

      ticketInput.value = data.node_id;

      console.log();
    } catch (error) {
      console.error(error);

      ticketInput.value = "Deu ruim 😢";
    }
  });
}

function handleOpenDirectlyClick() {
  if (openDirectlyButton.dataset["loading"] === "true") {
    return;
  }

  let iElement;

  chrome.storage.sync.get("requestData", async (storedData) => {
    const requestData = storedData?.requestData || {};
    openDirectlyButton.dataset["loading"] = "true";

    iElement = document.createElement("i");
    iElement.dataset["feather"] = "loader";
    iElement.classList.add("rotate");

    openDirectlyButton.innerHTML = "";
    openDirectlyButton.appendChild(iElement);
    feather.replace();

    try {
      const response = await fetch(
        "https://api.github.com/users/angeloevangelista",
        { method: "GET" }
      );

      const data = await response.json();

      if (response.status !== 200) throw new Error(data);

      const ticket = data.node_id;

      var newURL = `${requestData.baseUrl}/ccds?ticket=${ticket}`;
      chrome.tabs.create({ url: newURL });
    } catch (error) {
      alert("Deu ruim.");

      console.error(error);
    } finally {
      iElement = document.createElement("i");
      iElement.dataset["feather"] = "globe";

      openDirectlyButton.innerHTML = "";
      openDirectlyButton.appendChild(iElement);
      openDirectlyButton.dataset["loading"] = "false";

      feather.replace();
    }
  });
}

function setEvents() {
  document.querySelector("label[for=ticket]").addEventListener("click", () => {
    if (!ticketInput.value.trim()) return;

    if (ticketInput) ticketInput.select();

    document.execCommand("copy");

    const previousBackgroundColor = generateButton.style.backgroundColor;

    generateButton.innerText = "Copiado! 😉";
    generateButton.style.backgroundColor = "#4dd051";
    generateButton.setAttribute("disabled", true);

    setTimeout(() => {
      generateButton.innerText = "Gerar";
      generateButton.style.backgroundColor = previousBackgroundColor;
      generateButton.removeAttribute("disabled");
    }, 1000);
  });

  generateButton.addEventListener("click", handleGenerateTicketClick);
  openDirectlyButton.addEventListener("click", handleOpenDirectlyClick);
}

feather.replace();
