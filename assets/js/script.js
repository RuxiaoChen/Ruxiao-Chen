'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// GitHub repositories
const githubList = document.querySelector("[data-github-list]");

const createGithubMetaItem = function (iconName, text) {
  const item = document.createElement("span");
  item.classList.add("github-meta-item");

  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", iconName);

  const label = document.createElement("span");
  label.textContent = text;

  item.append(icon, label);
  return item;
}

const createGithubRepository = function (repository) {
  const item = document.createElement("li");
  item.classList.add("github-item");

  const link = document.createElement("a");
  link.classList.add("github-link");
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const header = document.createElement("div");
  header.classList.add("github-item-header");

  const name = document.createElement("h3");
  name.classList.add("github-name");
  name.textContent = repository.name;

  const stars = createGithubMetaItem("star-outline", repository.stargazers_count.toLocaleString());
  stars.classList.add("github-stars");
  header.append(name, stars);

  const description = document.createElement("p");
  description.classList.add("github-description");
  description.textContent = repository.description;

  const meta = document.createElement("div");
  meta.classList.add("github-meta");

  if (repository.language) {
    const language = document.createElement("span");
    language.classList.add("github-meta-item");

    const languageDot = document.createElement("span");
    languageDot.classList.add("github-language-dot");

    const languageName = document.createElement("span");
    languageName.textContent = repository.language;

    language.append(languageDot, languageName);
    meta.append(language);
  }

  meta.append(
    createGithubMetaItem("git-network-outline", repository.forks_count.toLocaleString()),
    createGithubMetaItem("calendar-outline", `Updated ${new Date(repository.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`)
  );

  link.append(header, description, meta);
  item.append(link);
  return item;
}

const loadGithubRepositories = async function () {
  const repositories = [];
  const contributedRepositories = ["SusuXu-s-Lab/FLARE"];
  let page = 1;

  while (true) {
    const response = await fetch(`https://api.github.com/users/RuxiaoChen/repos?per_page=100&page=${page}`);

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const pageRepositories = await response.json();
    repositories.push(...pageRepositories);

    if (pageRepositories.length < 100) break;
    page++;
  }

  for (const repositoryName of contributedRepositories) {
    const response = await fetch(`https://api.github.com/repos/${repositoryName}`);

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    repositories.push(await response.json());
  }

  repositories.sort(function (first, second) {
    return second.stargazers_count - first.stargazers_count || first.name.localeCompare(second.name);
  });

  githubList.append(...repositories.map(createGithubRepository));
}

loadGithubRepositories();
