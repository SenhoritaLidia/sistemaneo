document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('colabForm');
    const tabela = document.getElementById('respostaTabela').querySelector('tbody');
    const formColaborador = document.getElementById('formColaborador');
    const adminTabela = document.getElementById('adminTabela');
  
    // Alterna entre Administrador e Colaborador
    window.selecionarPapel = function (papel) {
      if (papel === 'admin') {
        formColaborador.classList.add('hidden');
        adminTabela.classList.remove('hidden');
        carregarRespostas();
      } else {
        formColaborador.classList.remove('hidden');
        adminTabela.classList.add('hidden');
      }
    };
  
    // Salva as respostas no localStorage
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const dados = Object.fromEntries(new FormData(form).entries());
  
      // Recupera do localStorage
      let respostas = JSON.parse(localStorage.getItem('respostas')) || [];
  
      respostas.push(dados);
      localStorage.setItem('respostas', JSON.stringify(respostas));
  
      form.reset();
      alert('Respostas enviadas com sucesso!');
    });
  
    // Preenche a tabela para o admin
    function carregarRespostas() {
      tabela.innerHTML = '';
      const respostas = JSON.parse(localStorage.getItem('respostas')) || [];
  
      respostas.forEach((resposta) => {
        const linha = document.createElement('tr');
  
        Object.values(resposta).forEach((valor) => {
          const td = document.createElement('td');
          td.textContent = valor;
          linha.appendChild(td);
        });
  
        tabela.appendChild(linha);
      });
    }
  
    // Modo Claro/Escuro
    const toggle = document.getElementById('modoToggle');
    const body = document.body;
    const modoAtual = localStorage.getItem('modo');
  
    if (modoAtual === 'escuro') {
      ativarModoEscuro();
    }
  
    toggle.addEventListener('click', () => {
      if (body.classList.contains('escuro')) {
        desativarModoEscuro();
      } else {
        ativarModoEscuro();
      }
    });
  
    function ativarModoEscuro() {
      body.classList.add('escuro');
      toggle.textContent = 'Modo Claro';
      document.documentElement.style.setProperty('--bg-color', '#1b2727');
      document.documentElement.style.setProperty('--text-color', '#f3f8f4');
      document.documentElement.style.setProperty('--card-bg', '#2f3c4f');
      localStorage.setItem('modo', 'escuro');
    }
  
    function desativarModoEscuro() {
      body.classList.remove('escuro');
      toggle.textContent = 'Modo Escuro';
      document.documentElement.style.setProperty('--bg-color', '#f3f8f4');
      document.documentElement.style.setProperty('--text-color', '#1b2727');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      localStorage.setItem('modo', 'claro');
    }
  });
  
