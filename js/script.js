// Função para verificar se todos os elementos necessários existem
function checkElements() {
  const elements = {
      valorAluguel: document.getElementById('valor-do-aluguel'),
      dataInicio: document.getElementById('data-inicio'),
      dataFinal: document.getElementById('data-final'),
      prazoContrato: document.getElementById('prazo-contrato'),
      simular: document.getElementById('simular'),
      screenshot: document.getElementById('screenshot'),
      resultado: document.getElementById('resultado')
  };

  // Verifica se algum elemento está faltando
  for (const [key, element] of Object.entries(elements)) {
      if (!element) {
          console.error(`Elemento não encontrado: ${key}`);
          return false;
      }
  }

  return true;
}

// Extensão do objeto String para inverter a ordem dos caracteres
String.prototype.reverse = function() {
  return this.split('').reverse().join('');
};

// Função para aplicar a máscara de formatação de moeda
function mascaraMoeda(campo, evento) {
  if (!campo) return;
  
  let tecla = (!evento) ? window.event.keyCode : evento.which;
  let valor = campo.value.replace(/[^\d]+/gi, '').reverse();
  let resultado = "";
  let mascara = "##.###.###,##".reverse();
  
  for (let x = 0, y = 0; x < mascara.length && y < valor.length;) {
      if (mascara.charAt(x) != '#') {
          resultado += mascara.charAt(x);
          x++;
      } else {
          resultado += valor.charAt(y);
          y++;
          x++;
      }
  }
  campo.value = resultado.reverse();
}

// Função principal para cálculo da multa
function CalculoDias() {
  const valorAluguel = document.getElementById('valor-do-aluguel').value;
  const dataInicial = document.getElementById('data-inicio').value;
  const dataFinal = document.getElementById('data-final').value;
  const prazoContratoInput = document.getElementById('prazo-contrato');
  const resultado = document.getElementById('resultado');

  // Validação dos inputs
  if (!valorAluguel || !dataInicial || !dataFinal || !prazoContratoInput || !resultado) {
      console.error('Elementos necessários não encontrados');
      return;
  }

  const prazoContratoValor = prazoContratoInput.options[prazoContratoInput.selectedIndex].value;
  
  // Conversão e cálculo das datas
  const data1 = new Date(dataFinal);
  const data2 = new Date(dataInicial);

  const diffTime = Math.abs(data2 - data1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) + 1);
  const diasNaoUso = prazoContratoValor - diffDays;

  // Conversão do valor do aluguel
  const aluguelFormat = parseFloat(valorAluguel.replace(/\./g, '').replace(',', '.'));
  const multaRescisoria = (3 * aluguelFormat * diasNaoUso) / prazoContratoValor;
  const multaRescisoriaCurrency = multaRescisoria.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
  });

  // Exibição do resultado
  if (!valorAluguel || !dataInicial || !dataFinal) {
      resultado.textContent = 'Insira dados válidos';
  } else if (diffDays >= prazoContratoValor) {
      resultado.textContent = 'Esse contrato não possui multa rescisória';
  } else {
      resultado.textContent = `O inquilino utilizou ${diffDays} dias de seu contrato, gerando ${diasNaoUso} dias de não uso, incidindo uma multa rescisória de ${multaRescisoriaCurrency}.`;
  }
}

// Função para captura de tela
function captureScreen() {
  const element = document.getElementById('capture');
  if (!element) {
      console.error('Elemento para captura não encontrado');
      return;
  }

  html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'calculo-multa.png';
      link.href = canvas.toDataURL();
      link.click();
  }).catch(err => {
      console.error('Erro ao capturar tela:', err);
  });
}

// Inicialização dos event listeners
function initializeEventListeners() {
  if (!checkElements()) {
      console.error('Alguns elementos necessários não foram encontrados');
      return;
  }

  // Event Listeners principais
  document.getElementById('simular').addEventListener('click', CalculoDias);
  document.getElementById('screenshot').addEventListener('click', captureScreen);

  // Adiciona o evento da máscara monetária
  const inputValorAluguel = document.getElementById('valor-do-aluguel');
  inputValorAluguel.addEventListener('keyup', function(event) {
      mascaraMoeda(this, event);
  });

  // Event listeners para tecla Enter
  const elements = ['valor-do-aluguel', 'data-inicio', 'data-final', 'prazo-contrato'];
  elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
          element.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                  CalculoDias();
              }
          });
      }
  });

  console.log('Event listeners inicializados com sucesso');
}

// Inicializa os event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeEventListeners);