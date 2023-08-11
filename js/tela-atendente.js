// Definição da chave utilizada para armazenar os dados dos alunos no localStorage
const ALUNOS_KEY = "alunos";

// Seleção de elementos do DOM
const alunoForm = document.querySelector("#formulario"); // Formulário de adição de aluno
const alunoInput = document.querySelector("#formulario-submit-input"); // Campo de entrada do nome do aluno
const checkboxes = document.querySelectorAll('input[name="membro"]'); // Checkboxes dos grupos musculares
const limparAlunosButton = document.querySelector("#limpar-alunos"); // Botão de limpar todos os alunos

// Variável para controlar o próximo ID de aluno
let nextAlunoId = 1;

// Função para salvar informações de um aluno
const saveAluno = (text, membros) => {
  // Criação de objeto com informações do aluno
  const alunoData = {
    id: nextAlunoId, // Atribuição do próximo ID disponível
    nome: text, // Nome do aluno
    membros: membros, // Grupos musculares selecionados
  };

  nextAlunoId++; // Incremento do próximo ID disponível

  if (membros.length === 0) {
    alert("Selecione pelo menos um grupo muscular");
    return;
  }

  // Recuperação dos dados de alunos do localStorage ou criação de um array vazio
  let alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];
  alunos.push(alunoData);
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));

  // Criação de elementos DOM para exibir informações do aluno
  const alunoList = document.querySelector("#aluno-list");
  const aluno = document.createElement("div");
  aluno.classList.add("aluno");
  aluno.setAttribute("data-id", alunoData.id);

  const alunoNome = document.createElement("h3");
  alunoNome.innerText = text;
  aluno.appendChild(alunoNome);

  const alunoMembros = document.createElement("p");
  alunoMembros.innerText = "Membros: " + membros.join(", ");
  aluno.appendChild(alunoMembros);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-aluno");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  // Listener para remover aluno e atualizar contagens após clique no botão de remoção
  deleteBtn.addEventListener("click", () => {
    aluno.remove();
    removeAluno(alunoData.id);
    updateAlunosCount();
    window.parent.postMessage({ action: "alunoRemovido" }, "*");
  });

  aluno.appendChild(deleteBtn);
  alunoList.appendChild(aluno);

  // Limpar campo de entrada e desmarcar checkboxes
  alunoInput.value = "Aluno ";
  alunoInput.focus();

  updateAlunosCount();
};

// Função para atualizar a contagem de alunos exibida
const updateAlunosCount = () => {
  const totalAlunos = document.querySelector("#aluno-list").children.length;
  document.querySelectorAll("#alunos-count").forEach((element) => {
    element.textContent = totalAlunos;
  });
};

// Função para desmarcar todas as checkboxes dos grupos musculares
const desmarcarCheckbox = () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
};

// Listener para o botão de limpar todos os alunos
limparAlunosButton.addEventListener("click", function () {
  if (confirm("Tem certeza que deseja remover todos os alunos?")) {
    removerTodosAlunos();
    const alunoList = document.querySelector("#aluno-list");
    alunoList.innerHTML = "";
    updateAlunosCount();
    alert("Todos os alunos foram removidos.");
  }
});

// Função para remover todos os alunos do localStorage
function removerTodosAlunos() {
  localStorage.removeItem(ALUNOS_KEY);
}

// Função para remover um aluno pelo ID
const removeAluno = (id) => {
  let alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY));
  const alunoIndex = alunos.findIndex((aluno) => aluno.id === id);
  alunos.splice(alunoIndex, 1);
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
  window.parent.postMessage({ action: "alunoRemovido", alunoId: id }, "*");
};

// Listener para o formulário de adição de aluno
alunoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const valorInput = alunoInput.value;

  if (valorInput) {
    // Seleciona checkboxes marcadas e obtém seus valores
    const membrosSelecionados = Array.from(
      document.querySelectorAll('input[name="membro"]:checked')
    ).map((checkbox) => checkbox.value);

    // Chama a função para salvar o aluno com as informações fornecidas
    saveAluno(valorInput, membrosSelecionados);
    desmarcarCheckbox();
  }
});

// Atualização da contagem de alunos ao carregar a página de visualização dos alunos
if (window.location.pathname.includes("tela-aluno.html")) {
  updateAlunosCount();
}
