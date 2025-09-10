const username = "Vnf13"; 
const repoContainer = document.querySelector(".grid"); 
if (repoContainer) {
  repoContainer.innerHTML = "Carregando repositórios...";

  // Carrega a lista de repos a ignorar
  fetch("../ignore-repos.json")
    .then(res => res.json())
    .then(ignoreList => {

      // Busca os repositórios no GitHub
      fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
        .then(res => res.json())
        .then(data => {
          repoContainer.innerHTML = "";

          data
            .filter(repo => !ignoreList.includes(repo.name)) // filtra os ignorados
            .forEach(repo => {
              const div = document.createElement("div");
              div.className = "card";

              div.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : "Sem descrição"}</p>
                <p><strong>Linguagem:</strong> ${repo.language || "Não definida"}</p>
                <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
              `;

              // Torna o card inteiro clicável
              div.addEventListener("click", () => {
                window.open(repo.html_url, "_blank");
              });

              repoContainer.appendChild(div);
            });
        })
        .catch(err => {
          repoContainer.innerHTML = "Não foi possível carregar os repositórios.";
          console.error(err);
        });

    })
    .catch(err => console.error("Não foi possível carregar a lista de ignorados:", err));
}
