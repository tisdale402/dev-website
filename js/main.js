const THEME_STORAGE_KEY = "portfolio-theme";

const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

const modal = document.getElementById("contact-modal");
const modalPanel = modal?.querySelector(".contact-modal__panel");
const modalCloseButton = document.getElementById("contact-modal-close");
const modalOpenButtons = [
  document.getElementById("contact-open-nav"),
  document.getElementById("contact-open-hero"),
].filter(Boolean);
const navToggle = document.getElementById("site-nav-toggle");

const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const emptyState = document.getElementById("projects-empty");

let previouslyFocusedElement = null;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

function getInitialTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function toggleTheme() {
  const currentTheme = root.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function openModal() {
  if (!modal) return;

  previouslyFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalCloseButton?.focus();
}

function closeModal() {
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";

  if (
    previouslyFocusedElement &&
    typeof previouslyFocusedElement.focus === "function"
  ) {
    previouslyFocusedElement.focus();
  }
}

function handleProjectFilter(selectedFilter) {
  let visibleCount = 0;

  for (const card of projectCards) {
    const category = card.dataset.category;
    const matches = selectedFilter === "all" || category === selectedFilter;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

function setActiveFilter(button) {
  for (const filterButton of filterButtons) {
    filterButton.classList.toggle("filter-btn--active", filterButton === button);
  }
}

function closeMobileNav() {
  if (navToggle) {
    navToggle.checked = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getInitialTheme());

  themeToggle?.addEventListener("click", toggleTheme);

  for (const button of modalOpenButtons) {
    button?.addEventListener("click", () => {
      closeMobileNav();
      openModal();
    });
  }

  modalCloseButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal || !modalPanel?.contains(event.target)) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter ?? "all";
      setActiveFilter(button);
      handleProjectFilter(selectedFilter);
    });
  }

  const navLinks = document.querySelectorAll(".site-nav__link[href^='#']");
  for (const link of navLinks) {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  }
});
