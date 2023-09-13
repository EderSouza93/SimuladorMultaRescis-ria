//selecionando os elementos HTML
const simularMulta = document.getElementById("simular");
const valorAluguelInput = document.getElementById("valor-do-aluguel");
const dataInicialInput = document.getElementById("data-inicio");
const dataFinalInput = document.getElementById("data-final");
const prazoContratoInput = document.getElementById("prazo-contrato");
const resultado = document.getElementById("resultado");

//Extensão do objeto String para inverter a ordem dos caracteres
String.prototype.reverse = function () {
  return this.split("").reverse().join("");
};

//Função para aplicar a máscara de formatação de moeda
function mascaraMoeda(campo, evento) {
  let tecla = !evento ? window.event.keyCode : evento.which;
  let valor = campo.value.replace(/[^\d]+/gi, "").reverse();
  let resultado = "";
  let mascara = "##.###.###,##".reverse();
  for (let x = 0, y = 0; x < mascara.length && y < valor.length; ) {
    if (mascara.charAt(x) != "#") {
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

function CalculoDias() {
  //Manipulando os elementos HTML
  const valorAluguel = valorAluguelInput.value;
  const dataInicial = dataInicialInput.value;
  const dataFinal = dataFinalInput.value;
  const prazoContratoValor =
    prazoContratoInput.options[prazoContratoInput.selectedIndex].value;
  const prazoContratoTexto =
    prazoContratoInput.options[prazoContratoInput.selectedIndex].text;

  //converte as datas para objetos
  const data1 = new Date(dataFinal);
  const data2 = new Date(dataInicial);

  //calcula a diferença de datas
  const diffTime = Math.abs(data2 - data1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) + 1);

  //define os dias de não uso
  const diasNaoUso = prazoContratoValor - diffDays;

  //Convertendo a String da mascara para number
  const aluguelFormat = parseFloat(
    valorAluguel.replace(/\./g, "").replace(",", ".")
  );

  //Calculando Multa Rescisória
  const multaRescisoria = (3 * aluguelFormat * diasNaoUso) / prazoContratoValor;

  let multaRescisoriaCurrency = multaRescisoria.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  //validando o resultado
  if (dataFinal === "" || dataInicial === "" || valorAluguel === "")
    resultado.textContent = "Insira dados válidos";
  else if (diffDays >= prazoContratoValor)
    resultado.textContent = "Esse contrato não possui multa rescisória";
  else
    resultado.textContent = `O inquilino utilizou ${diffDays} dias de seu contrato, gerando ${diasNaoUso} dias de não uso, incidindo uma multa rescisória de ${multaRescisoriaCurrency}.`;
}

simularMulta.addEventListener("click", CalculoDias);

dataFinalInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    CalculoDias();
  }
});

valorAluguelInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    CalculoDias();
  }
});

dataInicialInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    CalculoDias();
  }
});

prazoContratoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    CalculoDias();
  }
});
