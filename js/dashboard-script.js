const username = "Vnf13";
const token = "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"; // <--- substitua pelo seu token pessoal do GitHub
const canvas = document.getElementById("languagesChart");
const totalReposEl = document.getElementById("totalRepos");

if (canvas) {
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
            Authorization: `token ${token}`
        }
    })
    .then(res => res.json())
    .then(async repos => {
        // Total de repositórios
        totalReposEl.textContent = repos.length;

        // Contagem de linguagens
        let langTotals = {};
        for (const repo of repos) {
            try {
                const langRes = await fetch(repo.languages_url, {
                    headers: {
                        Authorization: `token ${token}`
                    }
                });
                const langs = await langRes.json();
                for (const [lang, bytes] of Object.entries(langs)) {
                    langTotals[lang] = (langTotals[lang] || 0) + bytes;
                }
            } catch (e) {
                console.warn(`Erro ao buscar linguagens de ${repo.name}:`, e);
            }
        }

        // Preparar dados para Chart.js
        const labels = Object.keys(langTotals);
        const dataValues = Object.values(langTotals);

        const data = {
            labels: labels,
            datasets: [{
                label: 'Uso de Linguagens',
                data: dataValues,
                backgroundColor: [
                    '#f9b234', '#3ecd5e', '#e44002', '#952aff',
                    '#cd3e94', '#4c49ea', '#ffaa00', '#00aaff',
                    '#ff00aa', '#aa00ff', '#00ffaa', '#ff5555'
                ],
                borderColor: '#383838',
                borderWidth: 2
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const sum = context.dataset.data.reduce((a,b) => a+b,0);
                                const percent = ((context.parsed / sum) * 100).toFixed(1);
                                return `${context.label}: ${percent}%`;
                            }
                        }
                    }
                }
            }
        };

        new Chart(canvas.getContext('2d'), config);

    })
    .catch(err => console.error("Erro ao carregar dashboard:", err));
}
