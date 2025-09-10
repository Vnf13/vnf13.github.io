const username = "Vnf13"; 
const repoContainer = document.querySelector(".grid"); 
repoContainer.innerHTML = "Carregando repositórios...";

// Carrega a lista de repos a ignorar
fetch("ignore-repos.json")
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
              <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
              <p>${repo.description ? repo.description : "Sem descrição"}</p>
              <p><strong>Linguagem:</strong> ${repo.language || "Não definida"}</p>
            `;
            repoContainer.appendChild(div);
          });
      })
      .catch(err => {
        repoContainer.innerHTML = "Não foi possível carregar os repositórios.";
        console.error(err);
      });

  })
  .catch(err => console.error("Não foi possível carregar a lista de ignorados:", err));
