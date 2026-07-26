
const STORAGE_KEY = "hostelRegisterRecords";
const SIMULATED_LATENCY_MS = 450;  
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUSES = ["Pending", "In Progress", "Resolved"];


const seedRecords = [
  { record_id:1,  room_no:"101", block:"A", occupant_name:"Sri",  complaint_type:"Leaking Tap",        reported_date:"2026-07-01", status:"Pending",     resolved_date:"" },
  { record_id:2,  room_no:"102", block:"A", occupant_name:"Sai kishore",  complaint_type:"Fan Not Working",    reported_date:"2026-07-02", status:"Resolved",    resolved_date:"2026-07-04" },
  { record_id:3,  room_no:"103", block:"A", occupant_name:"Gokul",   complaint_type:"Broken Window",      reported_date:"2026-07-03", status:"In Progress", resolved_date:"" },
  { record_id:4,  room_no:"104", block:"A", occupant_name:"Nivi",  complaint_type:"Tube Light Issue",   reported_date:"2026-07-05", status:"Pending",     resolved_date:"" },
  { record_id:5,  room_no:"105", block:"A", occupant_name:"Raji",complaint_type:"Door Lock Damaged",  reported_date:"2026-07-06", status:"Resolved",    resolved_date:"2026-07-08" },
  { record_id:6,  room_no:"201", block:"B", occupant_name:"Keerthi",  complaint_type:"Water Leakage",      reported_date:"2026-07-07", status:"Pending",     resolved_date:"" },
  { record_id:7,  room_no:"202", block:"B", occupant_name:"Shivani", complaint_type:"Broken Chair",       reported_date:"2026-07-08", status:"Resolved",    resolved_date:"2026-07-09" },
  { record_id:8,  room_no:"203", block:"B", occupant_name:"Santhosh",  complaint_type:"Wi-Fi Issue",        reported_date:"2026-07-09", status:"Pending",     resolved_date:"" },
  { record_id:9,  room_no:"204", block:"B", occupant_name:"Lenin",  complaint_type:"Power Failure",      reported_date:"2026-07-10", status:"In Progress", resolved_date:"" },
  { record_id:10, room_no:"205", block:"B", occupant_name:"Meenakshi",       complaint_type:"",                   reported_date:"",           status:"Pending",     resolved_date:"" },
  { record_id:11, room_no:"301", block:"C", occupant_name:"Hema",complaint_type:"Leaking Tap",        reported_date:"2026-06-01", status:"Pending",     resolved_date:"" },
  { record_id:12, room_no:"302", block:"C", occupant_name:"Bhavani",   complaint_type:"Fan Repair",         reported_date:"2026-07-11", status:"Resolved",    resolved_date:"2026-07-12" },
  { record_id:13, room_no:"303", block:"C", occupant_name:"Vandhana",  complaint_type:"Broken Cot",         reported_date:"2026-07-13", status:"Pending",     resolved_date:"" },
  { record_id:14, room_no:"304", block:"C", occupant_name:"Abishek",   complaint_type:"Window Glass Broken",reported_date:"2026-07-14", status:"Resolved",    resolved_date:"2026-07-15" },
  { record_id:15, room_no:"305", block:"C", occupant_name:"Suriya",  complaint_type:"Water Heater Fault", reported_date:"2026-07-15", status:"Pending",     resolved_date:"" },
  { record_id:16, room_no:"401", block:"D", occupant_name:"Lathi",  complaint_type:"Switch Board Problem",reported_date:"2026-07-16",status:"In Progress", resolved_date:"" },
  { record_id:17, room_no:"402", block:"D", occupant_name:"Divya",  complaint_type:"AC Not Cooling",     reported_date:"2026-07-17", status:"Pending",     resolved_date:"" },
  { record_id:18, room_no:"403", block:"D", occupant_name:"Sharani",complaint_type:"Door Lock Broken",   reported_date:"2026-07-18", status:"Resolved",    resolved_date:"2026-07-19" },
  { record_id:19, room_no:"404", block:"D", occupant_name:"Shruthi",  complaint_type:"Broken Table",       reported_date:"2026-07-19", status:"Pending",     resolved_date:"" },
  { record_id:20, room_no:"405", block:"D", occupant_name:"Velvizhi",  complaint_type:"Ceiling Crack",      reported_date:"2025-12-01", status:"Pending",     resolved_date:"" }
];


const mockApi = (() => {

  function delay(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Error) reject(value);
        else resolve(value);
      }, SIMULATED_LATENCY_MS);
    });
  }

  function readStore() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(seedRecords));
  }

  function writeStore(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function nextId(records) {
    return records.length ? Math.max(...records.map(r => r.record_id)) + 1 : 1;
  }


  function validate(payload) {
    const errors = {};

    const room_no = (payload.room_no || "").trim();
    const block = (payload.block || "").trim();
    const complaint_type = (payload.complaint_type || "").trim();
    const reported_date = (payload.reported_date || "").trim();
    const status = (payload.status || "").trim();
    const resolved_date = (payload.resolved_date || "").trim();

    if (!room_no) errors.roomNo = "Room number is required.";
    if (!block) errors.block = "Block is required.";

    if (status && VALID_STATUSES.indexOf(status) === -1) {
      errors.status = "Status must be Pending, In Progress, or Resolved.";
    }
    if (reported_date && !DATE_RE.test(reported_date)) {
      errors.reportedDate = "Reported date must be in YYYY-MM-DD format.";
    }
    if (resolved_date && !DATE_RE.test(resolved_date)) {
      errors.resolvedDate = "Resolved date must be in YYYY-MM-DD format.";
    }
    if (complaint_type && !reported_date) {
      errors.reportedDate = "Reported date is required when a complaint is logged.";
    }
    if (status === "Resolved") {
      if (!resolved_date) {
        errors.resolvedDate = "Resolved date is required for a resolved complaint.";
      } else if (reported_date && DATE_RE.test(reported_date) && resolved_date < reported_date) {
        errors.resolvedDate = "Resolved date cannot be before the reported date.";
      }
    }
    return errors;
  }

  return {
    
    list() {
      try {
        return delay(readStore());
      } catch (err) {
        return delay(new Error("Could not read stored records."));
      }
    },

    
    create(payload) {
      const errors = validate(payload);
      if (Object.keys(errors).length) {
        const err = new Error("Validation failed");
        err.fieldErrors = errors;
        return delay(err);
      }
      try {
        const records = readStore();
        const record = {
          record_id: nextId(records),
          room_no: payload.room_no.trim(),
          block: payload.block.trim(),
          occupant_name: (payload.occupant_name || "").trim(),
          complaint_type: (payload.complaint_type || "").trim(),
          reported_date: payload.reported_date || "",
          status: payload.status || "Pending",
          resolved_date: payload.status === "Resolved" ? (payload.resolved_date || "") : ""
        };
        records.push(record);
        writeStore(records);
        return delay(record);
      } catch (err) {
        return delay(new Error("Could not save the new record."));
      }
    },

    
    update(id, payload) {
      const errors = validate(payload);
      if (Object.keys(errors).length) {
        const err = new Error("Validation failed");
        err.fieldErrors = errors;
        return delay(err);
      }
      try {
        const records = readStore();
        const index = records.findIndex(r => r.record_id === id);
        if (index === -1) {
          return delay(new Error("Record not found."));
        }
        const updated = {
          record_id: id,
          room_no: payload.room_no.trim(),
          block: payload.block.trim(),
          occupant_name: (payload.occupant_name || "").trim(),
          complaint_type: (payload.complaint_type || "").trim(),
          reported_date: payload.reported_date || "",
          status: payload.status || "Pending",
          resolved_date: payload.status === "Resolved" ? (payload.resolved_date || "") : ""
        };
        records[index] = updated;
        writeStore(records);
        return delay(updated);
      } catch (err) {
        return delay(new Error("Could not save the changes."));
      }
    },

    remove(id) {
      try {
        const records = readStore();
        const exists = records.some(r => r.record_id === id);
        if (!exists) return delay(new Error("Record not found."));
        writeStore(records.filter(r => r.record_id !== id));
        return delay({ deleted: id });
      } catch (err) {
        return delay(new Error("Could not delete the record."));
      }
    }
  };
})();


let records = [];

const tableBody      = document.getElementById("tableBody");
const tableContainer  = document.getElementById("tableContainer");
const searchInput     = document.getElementById("searchInput");
const statusFilter    = document.getElementById("statusFilter");
const addBtn          = document.getElementById("addBtn");

const loadingState    = document.getElementById("loadingState");
const emptyState      = document.getElementById("emptyState");
const emptyStateText  = document.getElementById("emptyStateText");
const errorState      = document.getElementById("errorState");
const errorStateText  = document.getElementById("errorStateText");
const resetSearchBtn  = document.getElementById("resetSearchBtn");
const retryBtn        = document.getElementById("retryBtn");

const modal           = document.getElementById("modal");
const modalTitle      = document.getElementById("modalTitle");
const recordForm      = document.getElementById("recordForm");
const cancelBtn       = document.getElementById("cancelBtn");
const deleteBtn       = document.getElementById("deleteBtn");
const saveBtn         = document.getElementById("saveBtn");

const toast           = document.getElementById("toast");
const toastText       = document.getElementById("toastText");

const recordId        = document.getElementById("recordId");
const roomNo          = document.getElementById("roomNo");
const block           = document.getElementById("block");
const occupant        = document.getElementById("occupant");
const complaint       = document.getElementById("complaint");
const reportedDate    = document.getElementById("reportedDate");
const statusSelect    = document.getElementById("status");
const resolvedDate    = document.getElementById("resolvedDate");


function calculateDaysPending(reportedDateStr, status) {
  if (!reportedDateStr) return null;
  if (status === "Resolved") return 0;

  const today = new Date();
  const reported = new Date(reportedDateStr);
  const diffMs = today.setHours(0,0,0,0) - reported.setHours(0,0,0,0);
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function statusRowClass(record) {
  if (!record.occupant_name && !record.complaint_type) return "row-vacant";
  if (record.status === "Pending") return "row-pending";
  if (record.status === "In Progress") return "row-progress";
  return "row-resolved";
}

function statusBadgeClass(status) {
  if (status === "Pending") return "badge-pending";
  if (status === "In Progress") return "badge-progress";
  return "badge-resolved";
}


function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  tableContainer.classList.remove("hidden");
  emptyState.classList.add("hidden");

  data.forEach(record => {
    const daysPending = calculateDaysPending(record.reported_date, record.status);

    let daysCell = "-";
    if (daysPending !== null) {
      const overdue = daysPending > 7 && record.status !== "Resolved";
      daysCell = `<span class="days-pill ${overdue ? "days-overdue" : "days-ok"}">${daysPending} day${daysPending === 1 ? "" : "s"}</span>`;
    }

    const row = document.createElement("tr");
    row.className = statusRowClass(record);
    row.innerHTML = `
      <td>${record.record_id}</td>
      <td>${escapeHtml(record.room_no)}</td>
      <td>${escapeHtml(record.block)}</td>
      <td>${record.occupant_name ? escapeHtml(record.occupant_name) : '<span class="muted">Vacant</span>'}</td>
      <td>${record.complaint_type ? escapeHtml(record.complaint_type) : '<span class="muted">—</span>'}</td>
      <td>${record.reported_date || "-"}</td>
      <td><span class="badge ${statusBadgeClass(record.status)}">${record.status}</span></td>
      <td>${record.resolved_date || "-"}</td>
      <td>${daysCell}</td>
      <td><button class="editBtn" data-id="${record.record_id}">Edit</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


function renderStats(data) {
  const totalRooms = new Set(data.map(r => r.room_no)).size;
  const vacantRooms = data.filter(r => !r.occupant_name && !r.complaint_type).length;
  const openComplaints = data.filter(r => r.complaint_type && r.status !== "Resolved").length;
  const overdue = data.filter(r => {
    const d = calculateDaysPending(r.reported_date, r.status);
    return d !== null && d > 7 && r.status !== "Resolved";
  }).length;

  animateCount("statTotal", totalRooms);
  animateCount("statVacant", vacantRooms);
  animateCount("statPending", openComplaints);
  animateCount("statOverdue", overdue);

  document.getElementById("statOverdue").closest(".stat-card").classList.toggle("has-overdue", overdue > 0);
}

function animateCount(elementId, target) {
  const el = document.getElementById(elementId);
  const start = Number(el.textContent) || 0;
  if (start === target) return;

  const duration = 400;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (target - start) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


function getFilteredRecords() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  return records.filter(record => {
    const roomMatch = record.room_no.toLowerCase().includes(query);
    const occupantMatch = (record.occupant_name || "").toLowerCase().includes(query);
    const statusMatch = selectedStatus === "All" || record.status === selectedStatus;
    return (roomMatch || occupantMatch) && statusMatch;
  });
}

function refresh() {
  const filtered = getFilteredRecords();
  renderStats(records);
  renderTable(filtered);

  const isFiltering = searchInput.value.trim() !== "" || statusFilter.value !== "All";
  resetSearchBtn.classList.toggle("hidden", !isFiltering);
  emptyStateText.textContent = isFiltering
    ? "No record matches your search or filter."
    : "Add a new complaint or occupancy record to get started.";
}

searchInput.addEventListener("input", refresh);
statusFilter.addEventListener("change", refresh);

resetSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "All";
  refresh();
});


function showLoading() {
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  errorState.classList.add("hidden");
  tableContainer.classList.add("hidden");
}

function hideLoading() {
  loadingState.classList.add("hidden");
}

function showError(message) {
  errorStateText.textContent = message || "Unable to load records.";
  errorState.classList.remove("hidden");
  tableContainer.classList.add("hidden");
  emptyState.classList.add("hidden");
}

function hideError() {
  errorState.classList.add("hidden");
}

let toastTimer = null;
function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

retryBtn.addEventListener("click", () => init());


function clearForm() {
  recordId.value = "";
  roomNo.value = "";
  block.value = "";
  occupant.value = "";
  complaint.value = "";
  reportedDate.value = "";
  statusSelect.value = "Pending";
  resolvedDate.value = "";
  ["roomNo","block","reportedDate","resolvedDate"].forEach(clearFieldError);
}

function clearFieldError(fieldId) {
  const el = document.getElementById("err-" + fieldId);
  if (el) el.textContent = "";
}

function openAddModal() {
  clearForm();
  modalTitle.textContent = "Add New Record";
  deleteBtn.classList.add("hidden");
  modal.classList.remove("hidden");
  roomNo.focus();
}

function openEditModal(record) {
  clearForm();
  modalTitle.textContent = "Edit Record — Room " + record.room_no;
  recordId.value = record.record_id;
  roomNo.value = record.room_no;
  block.value = record.block;
  occupant.value = record.occupant_name;
  complaint.value = record.complaint_type;
  reportedDate.value = record.reported_date;
  statusSelect.value = record.status;
  resolvedDate.value = record.resolved_date;
  deleteBtn.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

addBtn.addEventListener("click", openAddModal);
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".editBtn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const record = records.find(r => r.record_id === id);
  if (record) openEditModal(record);
});


function applyFieldErrors(fieldErrors) {
  ["roomNo","block","reportedDate","resolvedDate"].forEach(clearFieldError);
  Object.keys(fieldErrors).forEach(field => {
    const el = document.getElementById("err-" + field);
    if (el) el.textContent = fieldErrors[field];
  });
}

recordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  ["roomNo","block","reportedDate","resolvedDate"].forEach(clearFieldError);

  const payload = {
    room_no: roomNo.value,
    block: block.value,
    occupant_name: occupant.value,
    complaint_type: complaint.value,
    reported_date: reportedDate.value,
    status: statusSelect.value,
    resolved_date: resolvedDate.value
  };

  const isUpdate = recordId.value !== "";
  saveBtn.disabled = true;

  try {
    if (isUpdate) {
      await mockApi.update(Number(recordId.value), payload);
    } else {
      await mockApi.create(payload);
    }
    closeModal();
    await loadAndRefresh();
    showToast(isUpdate ? "Record updated" : "Record added");
  } catch (err) {
    if (err.fieldErrors) {
      applyFieldErrors(err.fieldErrors);
    } else {
      showToast(err.message || "Something went wrong. Please try again.");
    }
  } finally {
    saveBtn.disabled = false;
  }
});

deleteBtn.addEventListener("click", async () => {
  const id = Number(recordId.value);
  if (!id) return;
  if (!confirm("Delete this record? This cannot be undone.")) return;

  try {
    await mockApi.remove(id);
    closeModal();
    await loadAndRefresh();
    showToast("Record deleted");
  } catch (err) {
    showToast(err.message || "Delete failed. Please try again.");
  }
});


async function loadAndRefresh() {
  records = await mockApi.list();
  refresh();
}

async function init() {
  showLoading();
  hideError();

  try {
    await loadAndRefresh();
    hideLoading();
  } catch (err) {
    hideLoading();
    showError(err.message || "Unable to load records. Your browser storage may be unavailable.");
  }
}

document.addEventListener("DOMContentLoaded", init);


console.log("Sample check — Room 101 days pending:", calculateDaysPending("2026-07-01", "Pending"));