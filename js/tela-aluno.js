const ALUNOS_KEY = "alunos";

const alunosCount = document.querySelector("#alunos-count");
const chartCanvas = document.querySelector("#chart");

let chart;
let nextAlunoId = 1;

window.addEventListener("message", (event) => {
  if (event.data && event.data.action === "alunoRemovido") {
    const alunoIdRemovido = event.data.alunoId;
    removeAlunoFromUI(alunoIdRemovido);
    updateAlunosCount();
    updateChart();
  }
});

const removeAlunoFromUI = (alunoId) => {
  const alunoElement = document.querySelector(`.aluno[data-id="${alunoId}"]`);
  if (alunoElement) {
    alunoElement.remove();
  }
};

const updateAlunosCount = () => {
  const totalAlunos = JSON.parse(localStorage.getItem(ALUNOS_KEY))?.length || 0;
  alunosCount.textContent = totalAlunos;
};

const updateChart = () => {
  const alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];
  const musculosCount = {};

  for (let i = 0; i < alunos.length; i++) {
    const alunoData = alunos[i];
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

updateAlunosCount();
updateChart();

window.addEventListener("storage", () => {
  updateAlunosCount();
  updateChart();
});
