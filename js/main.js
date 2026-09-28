import { PipelineVisual } from "./pipeline.js";

/** Toggle the mobile navigation menu. */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const list = document.querySelector(".nav__list");
  if (!toggle || !list) return;

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("nav__list--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/** Mark the nav link matching the current page as active. */
function markActiveNavLink() {
  const links = document.querySelectorAll(".nav__link");
  const current = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("nav__link--active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/** Write the current year into the footer. */
function setFooterYear() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

/** Client-side only contact form feedback (no backend on this static site). */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "Please fill in every field before sending.";
      return;
    }
    const name = form.elements.namedItem("name").value.trim();
    status.textContent = `Thanks, ${name}. This demo form doesn't send email yet — reach out via the links below instead.`;
    form.reset();
  });
}

/** Build the hero pipeline visualization, if the canvas exists on this page. */
function initPipelineVisual() {
  const canvas = document.querySelector("[data-pipeline-canvas]");
  const caption = document.querySelector("[data-pipeline-caption]");
  if (!canvas || !caption) return;

  const stages = [
    {
      label: "Ingest",
      detail: "Pulls raw, messy data from upstream sources into a pipeline.",
    },
    {
      label: "Transform",
      detail: "Cleans and reshapes data so a model can learn from it.",
    },
    {
      label: "Train",
      detail: "Fits and validates a model against the prepared dataset.",
    },
    {
      label: "Serve",
      detail: "Packages the model into a containerized microservice.",
    },
    {
      label: "Monitor",
      detail: "Watches production behavior and flags drift or anomalies.",
    },
  ];

  const visual = new PipelineVisual(canvas, caption, stages);
  visual.defaultCaption = "Hover or tab through the stages to see what each one does.";
  caption.textContent = visual.defaultCaption;
}

function init() {
  initNavToggle();
  markActiveNavLink();
  setFooterYear();
  initContactForm();
  initPipelineVisual();
}

document.addEventListener("DOMContentLoaded", init);
