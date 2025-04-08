document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const matricula = document.getElementById("matricula").value.trim();
    const senha = document.getElementById("senha").value.trim();
  
    if (!matricula || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    // Aqui você pode enviar os dados para o servidor, por exemplo:
    // fetch("/login", { method: "POST", body: JSON.stringify({matricula, senha}) })
  
    alert("Login enviado com sucesso!\nMatrícula: " + matricula);
  });
  
  const toggleButton = document.getElementById("themeToggle");
  
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
  
  