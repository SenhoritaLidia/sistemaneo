document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('colabForm');
  const tabela = document.getElementById('respostaTabela').querySelector('tbody');
  const formColaborador = document.getElementById('formColaborador');
  const adminTabela = document.getElementById('adminTabela');
  const alertasDiv = document.getElementById('alertaContainer');

  // Criação do botão de logout
  const botaoSair = document.createElement('button');
  botaoSair.textContent = 'Sair do modo administrador';
  botaoSair.id = 'botaoSairAdmin';
  botaoSair.className = 'btn-sair-admin';
  botaoSair.style.margin = '1rem 0';
  botaoSair.style.display = 'none';
  adminTabela.parentNode.insertBefore(botaoSair, adminTabela);

  window.selecionarPapel = function (papel) {
    if (papel === 'admin') {
      const senha = prompt('Digite a senha de administrador:');
      const senhaCorreta = '12345';

      if (senha === senhaCorreta) {
        formColaborador.classList.add('hidden');
        adminTabela.classList.remove('hidden');
        botaoSair.style.display = 'inline-block';
        carregarRespostas();
      } else {
        alert('Senha incorreta!');
      }
    } else {
      formColaborador.classList.remove('hidden');
      adminTabela.classList.add('hidden');
      botaoSair.style.display = 'none';
    }
  };

  // Botão de sair do modo admin
  botaoSair.addEventListener('click', () => {
    formColaborador.classList.remove('hidden');
    adminTabela.classList.add('hidden');
    botaoSair.style.display = 'none';
  });

  // Envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());

    // Validação simples
    if (!dados.nome || !dados.matricula || !dados.horas) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    let respostas = JSON.parse(localStorage.getItem('respostas')) || [];
    respostas.push(dados);
    localStorage.setItem('respostas', JSON.stringify(respostas));
    form.reset();
    alert('Respostas enviadas com sucesso!');

    // Se admin estiver visualizando, atualiza a tabela e alertas em tempo real
    if (!adminTabela.classList.contains('hidden')) {
      carregarRespostas();
    }
  });

  function carregarRespostas() {
    tabela.innerHTML = '';
    alertasDiv.innerHTML = '';
    const respostas = JSON.parse(localStorage.getItem('respostas')) || [];

    const ordemCampos = ['nome', 'matricula', 'horas', 'autorizacao', 'justificativas', 'macroprocesso', 'area'];
    const somaHorasPorColaborador = {};

    respostas.forEach((resposta) => {
      const chave = resposta.nome + resposta.matricula;
      const horas = parseFloat(resposta.horas);
      if (!isNaN(horas)) {
        somaHorasPorColaborador[chave] = (somaHorasPorColaborador[chave] || 0) + horas;
      }

      const linha = document.createElement('tr');
      ordemCampos.forEach((campo) => {
        const td = document.createElement('td');
        td.textContent = resposta[campo] || '';
        linha.appendChild(td);
      });
      tabela.appendChild(linha);
    });

    // Exibir alertas se o colaborador ultrapassou 35h
    for (let chave in somaHorasPorColaborador) {
      const total = somaHorasPorColaborador[chave];
      if (total >= 35) {
        const alerta = document.createElement('div');
        alerta.className = 'alerta-horas';
        alerta.textContent = `⚠️ O colaborador ${chave} já registrou ${total.toFixed(1)} horas extras.`;
        alertasDiv.appendChild(alerta);
      }
    }
  }

  // Modo escuro/claro
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

