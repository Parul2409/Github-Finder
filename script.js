const searchBtn = document.getElementById("searchBtn");
const userNameInput = document.getElementById("searchUser");
const error = document.getElementById("error");

const userName = document.getElementById("username");
const about = document.getElementById("about");
const profile = document.querySelector(".profile-section img");

const stats = document.querySelectorAll(".stat-card strong");
const repoSection = document.querySelector(".repo-section");

const showAllBtn = document.getElementById("button");

let allRepos = [];
let show = false;

// 🔍 Search button
searchBtn.addEventListener("click", () => {
  const user = userNameInput.value.trim();
  if (user === "") return;

  fetchUser(user);
  fetchRepos(user);
});

// 👤 Fetch user data
async function fetchUser(user) {
  try {
    const res = await fetch(`https://api.github.com/users/${user}`);

    if (!res.ok) {
      error.style.display = "block";
      return;
    }

    error.style.display = "none";
    const data = await res.json();

    userName.textContent = "@" + data.login;
    about.textContent = data.bio || "No bio available";
    profile.src = data.avatar_url;

    stats[0].textContent = data.followers;
    stats[1].textContent = data.following;
    stats[2].textContent = data.public_repos;

    document.getElementById("viewProfile")
      .addEventListener("click", () => {
        window.open(data.html_url);
      });

  } catch (err) {
    console.log(err);
  }
}

// 📦 Fetch repositories
async function fetchRepos(user) {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos`);
    if (!res.ok) return;

    const data = await res.json();
    allRepos = data;
    displayRepos();

  } catch (err) {
    console.log(err);
  }
}

// 🧾 Display repositories
function displayRepos() {
  document.querySelectorAll(".repo-card")
    .forEach(card => card.remove());

  const reposToShow = show ? allRepos : allRepos.slice(0, 2);

  reposToShow.forEach(repoItem => {
    const card = document.createElement("div");
    card.classList.add("repo-card");

    card.innerHTML = `
      <div class="repo-left">
        <h4>${repoItem.name}</h4>
        <p>${repoItem.description || "No Description"}</p>
      </div>
      <div class="repo-right">
        <span class="language">${repoItem.language || "N/A"}</span>
        <button onclick="window.open('${repoItem.html_url}')">
          View Repo
        </button>
      </div>
    `;

    repoSection.insertBefore(card, showAllBtn);
  });
}

// 🔁 Show more / less
showAllBtn.addEventListener("click", () => {
  show = !show;

  showAllBtn.textContent = show
    ? "Show Less Repositories"
    : "Show All Repositories >";

  displayRepos();
});
