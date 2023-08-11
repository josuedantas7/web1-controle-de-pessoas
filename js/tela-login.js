const usuarios = [
    { username: "aluno", password: "aluno123", role: "aluno" },
    { username: "atendente", password: "atendente123", role: "atendente" },
  ];
  
  const form = document.querySelector(".formulario");
  const usernameInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const loginButton = form.querySelector("button");
  
  loginButton.addEventListener("click", function () {
    const username = usernameInput.value;
    const password = passwordInput.value;
  
    const user = usuarios.find(
      (user) => user.username === username && user.password === password
    );
  
    if (user) {
      if (user.role === "aluno") {
        window.location.href = "tela-aluno.html";
      } else if (user.role === "atendente") {
        window.location.href = "tela-atendente.html";
      }
    } else {
      alert("Usuário ou senha incorretos. Por favor, tente novamente.");
    }
  });
  