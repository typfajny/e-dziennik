export function byId(id) {
  return document.getElementById(id);
}

export function clear(element) {
  element.replaceChildren();
}

export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.html !== undefined) {
    element.innerHTML = options.html;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(key, value);
      }
    });
  }

  if (options.children) {
    element.append(...options.children.filter(Boolean));
  }

  return element;
}

export function renderEmpty(container, message) {
  clear(container);
  container.append(createElement("p", {
    className: "empty-state",
    text: message
  }));
}

export function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatDate(value) {
  const date = toDate(value);

  if (!date) {
    return "brak daty";
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatDateTime(value) {
  const date = toDate(value);

  if (!date) {
    return "brak daty";
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function dateKey(value) {
  const date = toDate(value);

  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function studentName(student = {}, fallback = "Uczeń") {
  const first = student.imie || student.name || student.firstName || "";
  const last = student.nazwisko || student.surname || student.lastName || "";
  const full = `${first} ${last}`.trim();

  return full || student.email || fallback;
}

export function studentClass(student = {}) {
  return student.klasa || student.class || student.className || student.oddzial || "brak klasy";
}

export function gradeDisplay(grade = {}) {
  if (grade.poprzedniaOcena !== null && grade.poprzedniaOcena !== undefined && grade.poprzedniaOcena !== "") {
    return `(${grade.poprzedniaOcena}) ${grade.ocena ?? "-"}`;
  }

  return String(grade.ocena ?? "-");
}

export function averageGrade(grades) {
  const values = grades
    .map((grade) => Number(grade.ocena))
    .filter((grade) => Number.isFinite(grade));

  if (!values.length) {
    return "-";
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return average.toFixed(2).replace(".", ",");
}

export function sortByDateDesc(items, fieldNames) {
  return [...items].sort((a, b) => {
    const dateA = fieldNames.map((field) => toDate(a[field])).find(Boolean);
    const dateB = fieldNames.map((field) => toDate(b[field])).find(Boolean);

    return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
  });
}

export function monthDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const leading = (firstDay.getDay() + 6) % 7;
  const days = [];

  for (let i = 0; i < leading; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month - 1, day));
  }

  return days;
}
