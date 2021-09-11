document
  .getElementById("main-form")
  .addEventListener("submit", handleFormSubmit);

loadStoredData();

function handleFormSubmit(event) {
  event.preventDefault();

  const inputs = Array.from(
    document.querySelectorAll(".input-container > input")
  );

  const invalidData = inputs.some((input) => !input.value?.trim());

  if (invalidData) {
    alert("Preenche direito, imbecil.");

    return;
  }

  const isTryingToBreak = inputs.some((input) =>
    /<|>|\\|\//.test(input.value?.trim())
  );

  if (isTryingToBreak) {
    alert("Tentando injetar algo por aqui?");

    return;
  }

  const requestData = inputs.reduce(
    (acc, next) => ({
      ...acc,
      [next.name]: next.value,
    }),
    {}
  );

  chrome.storage.sync.set({ requestData });
}

function loadStoredData() {
  chrome.storage.sync.get("requestData", (data) => {
    const requestData = data?.requestData || {};

    Object.entries(requestData).forEach(([key, value]) => {
      const input = document.querySelector(`input[name=${key}]`);

      if (input) input.value = value;
    });
  });
}

feather.replace();
