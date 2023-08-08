const ALUNOS_KEY = "alunos";

const alunoForm = document.querySelector("#formulario");
const alunoInput = document.querySelector("#formulario-submit-input");
const checkboxes = document.querySelectorAll('input[name="membro"]');

const saveAluno = (text, membros) => {
  const alunoData = {
    nome: text,
    membros: membros,
  };

  let alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];
  alunos.push(alunoData);
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));

  const alunoList = document.querySelector("#aluno-list");

  const aluno = document.createElement("div");
  aluno.classList.add("aluno");

  const alunoNome = document.createElement("h3");
  alunoNome.innerText = text;
  aluno.appendChild(alunoNome);

  const alunoMembros = document.createElement("p");
  alunoMembros.innerText = "Membros: " + membros.join(", ");
  aluno.appendChild(alunoMembros);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-aluno");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  deleteBtn.addEventListener("click", () => {
    aluno.remove();
    removeAluno(text);
    updateAlunosCount();
    updateChart();
    window.parent.postMessage({ action: "alunoRemovido" }, "*");
  });
  aluno.appendChild(deleteBtn);

  alunoList.appendChild(aluno);

  alunoInput.value = "Aluno ";
  alunoInput.focus();

  updateAlunosCount();
};

const updateAlunosCount = () => {
  const totalAlunos = document.querySelector("#aluno-list").children.length;
  document.querySelectorAll("#alunos-count").forEach((element) => {
    element.textContent = totalAlunos;
  });
};

const desmarcarCheckbox = () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
};

// Função para remover aluno do localStorage
const removeAluno = (nome) => {
  let alunos = JSON.parse(localStorage.getItem(ALUNOS_KEY)) || [];
  alunos = alunos.filter((aluno) => aluno.nome !== nome);
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
};

alunoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const valorInput = alunoInput.value;

  if (valorInput) {
    const membrosSelecionados = Array.from(
      document.querySelectorAll('input[name="membro"]:checked')
    ).map((checkbox) => checkbox.value);
    if (membrosSelecionados.length === 0) {
      alert("Selecione pelo menos um grupo muscular");
      return;
    }
    saveAluno(valorInput, membrosSelecionados);
    desmarcarCheckbox();
  }
});

// Atualizar a página dos Alunos assim que ela for carregada
if (window.location.pathname.includes("tela-aluno.html")) {
  updateAlunosCount();
  updateChart();
}
