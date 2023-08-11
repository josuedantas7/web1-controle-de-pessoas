const ALUNOS_KEY = "alunos";

const alunosCount = document.querySelector("#alunos-count");
const chartCanvas = document.querySelector("#chart");

let chart;

window.addEventListener("message", (event) => {
  if (event.data && event.data.action === "alunoRemovido") {
    const alunoNomeRemovido = event.data.alunoNome;
    removeAlunoFromUI(alunoNomeRemovido);
    updateAlunosCount();
    updateChart();
  }
});

const removeAlunoFromUI = (alunoNome) => {
  const alunoElements = document.querySelectorAll(".aluno");
  alunoElements.forEach((aluno) => {
    const nomeElement = aluno.querySelector("h3");
    if (nomeElement.innerText === alunoNome) {
      aluno.remove();
    }
  });
};

const updateAlunosCount = () => {
  const totalAlunos = JSON.parse(localStorage.getItem(ALUNOS_KEY))?.length || 0;
  alunosCount.textContent = totalAlunos;
};

const updateChart = () => {
  const alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];
  const musculosCount = {};

  for (let i = 0; i < alunos.length; i++) {
    console.log(alunos)
    const alunoData = alunos[i];
    console.log(alunoData)
    const membros = alunoData.membros;

    for (let j = 0; j < membros.length; j++) {
      const membro = membros[j];
      if (musculosCount[membro]) {
        musculosCount[membro]++;
      } else {
        musculosCount[membro] = 1;
      }
    }
  }

  const musculos = Object.keys(musculosCount);
  const countData = musculos.map((membro) => musculosCount[membro]);

  if (chart) {
    chart.data.labels = musculos;
    chart.data.datasets[0].data = countData;
    chart.update();
  } else {
    const ctx = chartCanvas.getContext("2d");
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: musculos,
        datasets: [
          {
            data: countData,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#8d5ad1",
              "#3cba9f",
              "#e8c3b9",
              "#c45850",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

// Atualizar o contador de alunos e o gráfico assim que a página for carregada
updateAlunosCount();
updateChart();

// Adiciona um evento para ouvir mudanças no localStorage
window.addEventListener("storage", () => {
  updateAlunosCount();
  updateChart();
});
