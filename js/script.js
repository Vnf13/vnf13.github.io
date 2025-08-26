const username = "Vnf13"; // seu usuário do GitHub
const repoContainer = document.querySelector(".grid"); // pega a div que já tinha os cards

// Limpa os cards existentes
repoContainer.innerHTML = "Carregando repositórios...";

fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  .then(res => res.json())
  .then(data => {
    repoContainer.innerHTML = ""; // limpa "Carregando..."

    data.forEach(repo => {
      const div = document.createElement("div");
      div.className = "card"; // mantém o estilo original dos cards

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
