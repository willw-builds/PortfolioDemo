const content = window.PORTFOLIO_CONTENT;

document.querySelectorAll("[data-name]").forEach((node) => {
  node.textContent = content.name;
});
document.querySelector("[data-status]").textContent = content.status;
document.querySelector("[data-title]").textContent = content.title;
document.querySelector("[data-tagline]").textContent = content.tagline;
document.querySelectorAll("[data-github-link]").forEach((link) => {
  link.href = content.githubUrl;
});

document.querySelector("#about-copy").innerHTML = content.about.map((paragraph) => `<p>${paragraph}</p>`).join("");

document.querySelector("#experience-list").innerHTML = content.experience
  .map((item) => `
    <article class="timeline-item reveal${item.placeholder ? " is-placeholder" : ""}">
      <div class="timeline-meta"><span>${item.period}</span><strong>${item.organization}</strong></div>
      <div class="timeline-detail">
        <h3>${item.role}</h3><p>${item.summary}</p>
        <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
      </div>
    </article>`)
  .join("");

document.querySelector("#project-list").innerHTML = content.projects
  .map((project) => `
    <article class="project-row reveal${project.placeholder ? " is-placeholder" : ""}">
      <div class="project-number" aria-hidden="true">${project.number}</div>
      <div class="project-body">
        <p class="project-status">${project.status}</p><h3>${project.title}</h3><p>${project.description}</p>
        <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="project-links">
          <a href="${project.primaryUrl}">${project.primaryLabel} <span aria-hidden="true">↗</span></a>
          <a href="${project.secondaryUrl}">${project.secondaryLabel} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </article>`)
  .join("");

document.querySelector("#notes-list").innerHTML = content.notes
  .map((note) => `
    <a class="note-item${note.placeholder ? " is-placeholder" : ""}" href="${note.url}">
      <span class="note-date">${note.date}</span>
      <span class="note-copy"><strong>${note.title}</strong><span>${note.description}</span></span>
      <span class="note-arrow" aria-hidden="true">↗</span>
    </a>`)
  .join("");

document.querySelector("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav a");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -45% 0px" });
sections.forEach((section) => navObserver.observe(section));
