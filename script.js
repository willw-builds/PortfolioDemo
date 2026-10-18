const content = window.PORTFOLIO_CONTENT;

document.querySelectorAll("[data-name]").forEach((node) => {
  node.textContent = content.name;
});

document.querySelector("[data-status]").textContent = content.status;
document.querySelector("[data-intro]").textContent = content.intro;
document.querySelector("[data-about]").textContent = content.about;

const contactLink = document.querySelector("[data-contact-link]");
contactLink.href = content.contactUrl;
contactLink.childNodes[0].textContent = `${content.contactLabel} `;
contactLink.setAttribute("aria-label", `${content.contactLabel} (opens in a new tab)`);

const projectGrid = document.querySelector("#project-grid");
projectGrid.innerHTML = content.projects
  .map(
    (project) => `
      <article class="project-card reveal">
        <div class="project-meta">
          <span>${project.number}</span>
          <span>${project.type}</span>
        </div>
        <div class="project-graphic" aria-hidden="true">${project.number}</div>
        <div class="project-footer">
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
        </div>
      </article>
    `,
  )
  .join("");

document.querySelector("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
