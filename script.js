const searchBtn = document.getElementById("searchBtn");
const userNameInput = document.getElementById("searchUser");
const error = document.getElementById("error");
const suggestionsBox = document.getElementById("suggestions");

const userName = document.getElementById("username");
const name = document.getElementById("name");
const about = document.getElementById("about");
const profile = document.getElementById("avatar");

const stats = document.querySelectorAll(".stat-card strong");

const repoContainer = document.getElementById("repoContainer");
const showAllBtn = document.getElementById("button");

let allRepos = [];
let show = false;
let profileLink = "";

/* SEARCH BUTTON */

searchBtn.addEventListener("click", () => {

const user = userNameInput.value.trim();

if(!user) return;

fetchUser(user);
fetchRepos(user);

});

/* USER SUGGESTIONS */

userNameInput.addEventListener("input", async () => {

const query = userNameInput.value.trim();

if(query.length < 2){
suggestionsBox.innerHTML="";
return;
}

const res = await fetch(`https://api.github.com/search/users?q=${query}&per_page=5`);

const data = await res.json();

suggestionsBox.innerHTML="";

data.items.forEach(user=>{

const li=document.createElement("li");

li.textContent=user.login;

li.onclick=()=>{
userNameInput.value=user.login;
suggestionsBox.innerHTML="";
fetchUser(user.login);
fetchRepos(user.login);
}

suggestionsBox.appendChild(li);

});

});

/* FETCH USER */

async function fetchUser(user){

try{

const res = await fetch(`https://api.github.com/users/${user}`);

if(!res.ok){
error.style.display="block";
return;
}

error.style.display="none";

const data = await res.json();

name.textContent=data.name || data.login;

userName.textContent="@"+data.login;

about.textContent=data.bio || "No bio available";

profile.src=data.avatar_url;

stats[0].textContent=data.followers;
stats[1].textContent=data.following;
stats[2].textContent=data.public_repos;

profileLink=data.html_url;

}catch(err){

console.log(err);

}

}

/* VIEW PROFILE */

document.getElementById("viewProfile").onclick=()=>{
if(profileLink) window.open(profileLink);
}

/* FETCH REPOS */

async function fetchRepos(user){

repoContainer.innerHTML="Loading repositories...";

const res = await fetch(`https://api.github.com/users/${user}/repos`);

const data = await res.json();

allRepos=data;

displayRepos();

}

/* DISPLAY REPOS */

function displayRepos(){

repoContainer.innerHTML="";

const reposToShow = show ? allRepos : allRepos.slice(0,3);

reposToShow.forEach(repo=>{

const card=document.createElement("div");

card.classList.add("repo-card");

card.innerHTML=`

<div>
<h4>${repo.name}</h4>
<p>${repo.description || "No description"}</p>
</div>

<div class="repo-right">
<span class="language">${repo.language || "N/A"}</span>
<button onclick="window.open('${repo.html_url}')">
View Repo
</button>
</div>

`;

repoContainer.appendChild(card);

});

}

/* SHOW MORE */

showAllBtn.addEventListener("click",()=>{

show=!show;

showAllBtn.textContent = show
? "Show Less Repositories"
: "Show All Repositories >";

displayRepos();

});