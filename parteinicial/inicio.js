document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('colabForm');
  const tabela = document.getElementById('respostaTabela').querySelector('tbody');
  const formColaborador = document.getElementById('formColaborador');
  const adminTabela = document.getElementById('adminTabela');
  const alertasDiv = document.getElementById('alertasHoras');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form).entries());
    let respostas = JSON.parse(localStorage.getItem('respostas')) || [];
    respostas.push(dados);
    localStorage.setItem('respostas', JSON.stringify(respostas));
    form.reset();
    alert('Respostas enviadas com sucesso!');
  });

  function carregarRespostas() {
    tabela.innerHTML = '';
    alertasDiv.innerHTML = '';
    const respostas = JSON.parse(localStorage.getItem('respostas')) || [];

    const ordemCampos = ['nome', 'matricula', 'mes', 'data', 'horas', 'autorizacao', 'justificativas', 'macroprocesso', 'area'];
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

    for (let chave in somaHorasPorColaborador) {
      const total = somaHorasPorColaborador[chave];
      if (total >= 35) {
        const alerta = document.createElement('div');
        alerta.className = 'alerta-horas';
        alerta.textContent = `⚠️ O colaborador ${chave} já registrou ${total} horas extras.`;
        alertasDiv.appendChild(alerta);
      }
    }
  }

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
