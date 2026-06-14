const API_BASE_URL = "";
const form = document.querySelector("#assetForm");
const message = document.querySelector("#message");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const tableBody = document.querySelector("#assetsTableBody");
const loadingState = document.querySelector("#loadingState");
const emptyState = document.querySelector("#emptyState");
const apiStatus = document.querySelector("#apiStatus");
const tableCount = document.querySelector("#tableCount");

const summaryElements = {
  totalAtivos: document.querySelector("#totalAtivos"),
  totalServidores: document.querySelector("#totalServidores"),
  totalDispositivosRede: document.querySelector("#totalDispositivosRede"),
  totalAtivosOperacao: document.querySelector("#totalAtivosOperacao")
};

let ativos = [];
let editingId = null;

const requiredFields = ["nome", "tipo", "ip", "localizacao", "status"];
const networkDeviceTypes = new Set([
  "switch",
  "roteador",
  "access point",
  "camera ip",
  "câmera ip",
  "atm",
  "telefone ip",
  "firewall",
  "zabbix"
]);

const fields = [
  "nome",
  "tipo",
  "ip",
  "localizacao",
  "sistema_operacional",
  "servico",
  "status",
  "responsavel"
];

const showMessage = (type, text) => {
  message.className = `message ${type}`;
  message.textContent = text;
};

const clearMessage = () => {
  message.className = "message";
  message.textContent = "";
};

const formatApiMessage = (text) =>
  String(text || "Não foi possível concluir a operação.")
    .replaceAll("Nao", "Não")
    .replaceAll("possivel", "possível")
    .replaceAll("operacao", "operação")
    .replaceAll("obrigatorios", "obrigatórios")
    .replaceAll("ausentes ou invalidos", "ausentes ou inválidos")
    .replaceAll("nao encontrado", "não encontrado");

const requestJson = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(formatApiMessage(data.message));
  }

  return data;
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const formatDisplayText = (value) => {
  if (!value) {
    return "-";
  }

  return String(value)
    .replaceAll("Uberlandia", "Uberlândia")
    .replaceAll("Aplicacoes", "Aplicações")
    .replaceAll("Seguranca", "Segurança")
    .replaceAll("manutencao", "manutenção")
    .replaceAll("Manutencao", "Manutenção");
};

const updateHealthBadge = async () => {
  try {
    await requestJson("/health");
    apiStatus.className = "api-badge online";
    apiStatus.innerHTML = '<span class="status-dot"></span>API online';
  } catch (_error) {
    apiStatus.className = "api-badge offline";
    apiStatus.innerHTML = '<span class="status-dot"></span>API offline';
  }
};

const updateSummary = () => {
  const servidores = ativos.filter((ativo) => normalizeText(ativo.tipo) === "servidor");
  const dispositivosRede = ativos.filter((ativo) => networkDeviceTypes.has(normalizeText(ativo.tipo)));
  const ativosOperacao = ativos.filter((ativo) => normalizeText(ativo.status) === "ativo");

  summaryElements.totalAtivos.textContent = ativos.length;
  summaryElements.totalServidores.textContent = servidores.length;
  summaryElements.totalDispositivosRede.textContent = dispositivosRede.length;
  summaryElements.totalAtivosOperacao.textContent = ativosOperacao.length;
  tableCount.textContent = `${ativos.length} ${ativos.length === 1 ? "registro" : "registros"}`;
};

const getStatusClass = (status) => {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus === "ativo") {
    return "active";
  }

  if (normalizedStatus.includes("manutencao") || normalizedStatus.includes("manutenção")) {
    return "maintenance";
  }

  return "inactive";
};

const createCell = (text, className = "") => {
  const cell = document.createElement("td");
  cell.textContent = formatDisplayText(text);

  if (className) {
    cell.className = className;
  }

  return cell;
};

const renderTable = () => {
  tableBody.innerHTML = "";

  loadingState.classList.add("hidden");
  emptyState.classList.toggle("hidden", ativos.length > 0);

  for (const ativo of ativos) {
    const row = document.createElement("tr");
    const statusCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const statusPill = document.createElement("span");
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    statusPill.className = `status-pill ${getStatusClass(ativo.status)}`;
    statusPill.textContent = formatDisplayText(ativo.status);
    statusCell.appendChild(statusPill);

    editButton.type = "button";
    editButton.className = "button button-secondary action-button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => startEditing(ativo));

    deleteButton.type = "button";
    deleteButton.className = "button button-danger action-button";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteAtivo(ativo));

    actions.className = "row-actions";
    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);

    row.append(
      createCell(ativo.nome, "asset-name"),
      createCell(ativo.tipo),
      createCell(ativo.ip),
      createCell(ativo.localizacao),
      createCell(ativo.servico),
      statusCell,
      createCell(ativo.responsavel),
      actionsCell
    );

    tableBody.appendChild(row);
  }
};

const loadAtivos = async () => {
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");

  try {
    ativos = await requestJson("/ativos");
    updateSummary();
    renderTable();
  } catch (error) {
    loadingState.classList.add("hidden");
    showMessage("error", error.message);
  }
};

const getPayload = () => {
  const formData = new FormData(form);
  const payload = {};

  for (const field of fields) {
    payload[field] = String(formData.get(field) || "").trim();
  }

  return payload;
};

const validatePayload = (payload) => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new Error(`Preencha os campos obrigatórios: ${missingFields.join(", ")}.`);
  }
};

const resetForm = () => {
  editingId = null;
  form.reset();
  submitButton.textContent = "Cadastrar ativo";
  cancelEditButton.classList.add("hidden");
};

const startEditing = (ativo) => {
  editingId = ativo.id;

  for (const field of fields) {
    form.elements[field].value = ativo[field] || "";
  }

  submitButton.textContent = "Salvar alterações";
  cancelEditButton.classList.remove("hidden");
  clearMessage();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteAtivo = async (ativo) => {
  const confirmed = window.confirm(`Excluir o ativo ${ativo.nome}?`);

  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`/ativos/${ativo.id}`, {
      method: "DELETE"
    });

    showMessage("success", "Ativo excluído com sucesso.");
    await loadAtivos();

    if (editingId === ativo.id) {
      resetForm();
    }
  } catch (error) {
    showMessage("error", error.message);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const payload = getPayload();

  try {
    validatePayload(payload);

    const url = editingId ? `/ativos/${editingId}` : "/ativos";
    const method = editingId ? "PUT" : "POST";

    await requestJson(url, {
      method,
      body: JSON.stringify(payload)
    });

    showMessage("success", editingId ? "Ativo atualizado com sucesso." : "Ativo cadastrado com sucesso.");
    resetForm();
    await loadAtivos();
  } catch (error) {
    showMessage("error", error.message);
  }
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  clearMessage();
});

const initializePage = async () => {
  await updateHealthBadge();
  await loadAtivos();
};

initializePage();
