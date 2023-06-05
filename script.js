//selecionando os elementos HTML
const simularMulta = document.getElementById('simular');
const valorAluguelInput = document.getElementById('valor-do-aluguel');
const dataInicialInput = document.getElementById('data-inicio');
const dataFinalInput = document.getElementById('data-final');
const prazoContratoInput = document.getElementById('prazo-contrato')
const resultado = document.getElementById('resultado')

//Extensão do objeto String para inverter a ordem dos caracteres
String.prototype.reverse = function(){
  return this.split('').reverse().join('');
};

//Função para aplicar a máscara de formatação de moeda
function mascaraMoeda(campo, evento){
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
    };
  };
  campo.value = resultado.reverse();
};

function CalculoDias() {

  //Manipulando os elementos HTML
  const valorAluguel = valorAluguelInput.value;
  const dataInicial = dataInicialInput.value;
  const dataFinal = dataFinalInput.value;
  const prazoContrato = prazoContratoInput.value

  //converte as datas para objetos
  const data1 = new Date(dataInicial);
  const data2 = new Date(dataFinal);

  //calcula a diferença de datas
  const diffTime = Math.abs(data2 - data1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)+1);

  //define os dias de não uso
  const diasNaoUso = prazoContrato - diffDays

  //Convertendo a String da mascara para number
  const aluguelFormat = parseFloat(valorAluguel.replace(/\./g, "").replace(",", "."));

  //Calculando Multa Rescisória
  const multaRescisoria = (3 * aluguelFormat * diasNaoUso / prazoContrato).toFixed(2);

  //validando o resultado
  if(!multaRescisoria || isNaN(multaRescisoria) || parseFloat(multaRescisoria) === 0) {
    resultado.textContent = 'Insira um valor válido!';
    return;
  };

  //Convertendo o resultado de number para o formato numérico
  const multaFormat = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(multaRescisoria);

  // Printando o resultado na tela
  resultado.textContent = `O Valor da multa é de ${multaFormat}`
};

simularMulta.addEventListener('click', CalculoDias);
