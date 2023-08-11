// Definição da chave utilizada para armazenar os dados dos alunos no localStorage
const ALUNOS_KEY = "alunos";

// Seleção de elementos do DOM
const alunosCount = document.querySelector("#alunos-count"); // Elemento que exibe a contagem de alunos
const chartCanvas = document.querySelector("#chart"); // Elemento do canvas para o gráfico

let chart; // Variável para armazenar a instância do gráfico

// Listener para mensagens recebidas via window.postMessage
window.addEventListener("message", (event) => {
  const alunoIdRemovido = event.data.alunoId; // Obtém o ID do aluno removido da mensagem
  removeAlunoFromUI(alunoIdRemovido); // Chama a função para remover o aluno da interface
  updateAlunosCount(); // Atualiza a contagem de alunos
  updateChart(); // Atualiza o gráfico
  }
);

// Função para remover um aluno da interface do usuário
const removeAlunoFromUI = (alunoId) => {
  const alunoElement = document.querySelector(`.aluno[data-id="${alunoId}"]`); // Encontra o elemento do aluno pelo ID
  if (alunoElement) {
    alunoElement.remove(); // Remove o elemento do aluno da interface
  }
};

// Função para atualizar a contagem de alunos exibida
const updateAlunosCount = () => {
  // Recupera os dados de alunos do localStorage ou cria um array vazio
  const totalAlunos = JSON.parse(localStorage.getItem(ALUNOS_KEY))?.length || 0;
  alunosCount.textContent = totalAlunos; // Atualiza o elemento da contagem
};

// Função para atualizar o gráfico de grupos musculares
const updateChart = () => {
  // Recupera os dados de alunos do localStorage ou cria um array vazio se não houver dados
  const alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];

  // Objeto para armazenar a contagem de cada grupo muscular
  const musculosCount = {};

  // Loop pelos dados de cada aluno
  for (let i = 0; i < alunos.length; i++) {
    const alunoData = alunos[i];
    const membros = alunoData.membros;

    // Loop pelos grupos musculares de cada aluno
    for (let j = 0; j < membros.length; j++) {
      const membro = membros[j];

      // Atualiza a contagem no objeto musculosCount
      if (musculosCount[membro]) {
        musculosCount[membro]++;
      } else {
        musculosCount[membro] = 1;
      }
    }
  }

  // Extrai os nomes dos grupos musculares
  const musculos = Object.keys(musculosCount);

  // Cria um array com as contagens dos grupos musculares
  const countData = musculos.map((membro) => musculosCount[membro]);

  // Verifica se já existe uma instância do gráfico
  if (chart) {
    // Se existir, atualiza os dados do gráfico
    chart.data.labels = musculos; // Atualiza os rótulos do gráfico
    chart.data.datasets[0].data = countData; // Atualiza os dados dos datasets do gráfico
    chart.update(); // Atualiza o gráfico
  } else {
    // Caso contrário, cria uma nova instância do gráfico
    const ctx = chartCanvas.getContext("2d"); // Obtém o contexto de renderização
    chart = new Chart(ctx, {
      type: "pie", // Define o tipo de gráfico como "pie" (pizza)
      data: {
        labels: musculos, // Define os rótulos do gráfico
        datasets: [
          {
            data: countData, // Define os dados dos datasets do gráfico
            backgroundColor: [
              // Define as cores de fundo para cada fatia do gráfico
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
        responsive: true, // Permite que o gráfico seja responsivo
        maintainAspectRatio: false, // Permite que o tamanho do gráfico seja ajustado
      },
    });
  }
};

// Listener para o evento de mudança de storage (localStorage)
window.addEventListener("storage", () => {
  updateAlunosCount();
  updateChart();
});
