const clientesContainer = document.getElementById("clientesContainer");
var formattedContent = ""; // Variável global para armazenar o conteúdo formatado
var editor = document.getElementById("editor");
var removeBtn = document.getElementById("removeBtn");
var returnBtn = document.getElementById("returnBtn");
var firstFileAdded = false; // Flag para rastrear se o primeiro arquivo foi adicionado


function copiarTexto(texto) {
  // Cria um elemento de input dinamicamente
  var inputTemporario = document.createElement("input");

  // Atribui o valor do texto ao input
  inputTemporario.value = texto;

  // Adiciona o input ao corpo do documento
  document.body.appendChild(inputTemporario);

  // Seleciona o texto no elemento de input
  inputTemporario.select();
  inputTemporario.setSelectionRange(0, 99999); // Para dispositivos móveis

  // Copia o texto para a área de transferência
  document.execCommand("copy");

  // Remove o elemento de input temporário
  document.body.removeChild(inputTemporario);

  // Exibe uma mensagem indicando que o texto foi copiado
  const copiedElement = document.createElement("div");
  copiedElement.innerHTML = `<div class="copied-text">
      <button id="closeAction">OK</button>
      Texto copiado!</div>`;
  const recebeAction = document.getElementById("recebeAction");
  recebeAction.innerHTML = "";
  recebeAction.appendChild(copiedElement);
  const closeAction = document.getElementById("closeAction");
  closeAction.addEventListener("click", function () {
    recebeAction.innerHTML = "";
  });

  setTimeout(function () {
    recebeAction.removeChild(copiedElement);
  }, 4000);
}

const arrowIcon2 = document.getElementById("arrowIconClientes");
const arrowIcon = document.getElementById("arrowIconEmpresa");

function mostrarSubMenu(containerId) {
  const container = document.getElementById(containerId + "Container");
  const buttons = container.querySelectorAll(".btn");

  buttons.forEach((button) => {
    const currentDisplay = window
      .getComputedStyle(button)
      .getPropertyValue("display");
    button.style.display = currentDisplay === "none" ? "block" : "none";
  });

  if (containerId === "clientes") {
    arrowIconClientes.classList.toggle("rotate180");
  } else if (containerId === "empresa") {
    arrowIconEmpresa.classList.toggle("rotate180");
  } else if (containerId === "contrato") {
    arrowIconContrato.classList.toggle("rotate180");
  } else if (containerId === "responsavel") {
    arrowIronResponsavel.classList.toggle("rotate180");
  } else if (containerId === "estrutura") {
    arrowIconEstrutura.classList.toggle("rotate180");
  }
}

mostrarSubMenu("responsavel");
mostrarSubMenu("clientes");
mostrarSubMenu("empresa");
mostrarSubMenu("contrato");
mostrarSubMenu("estrutura");

function mostrarSubMenuEstrutura(containerId) {
  const container = document.getElementById(containerId + "Container");
  const buttons = container.querySelectorAll(".btn");
  const listagemForeach = document.getElementById("listagemForeach");
  const listagemForeachParcela = document.getElementById(
    "listagemForEachParcelas"
  );

  buttons.forEach((button) => {
    const currentDisplay = window
      .getComputedStyle(button)
      .getPropertyValue("display");
    if (currentDisplay === "none") {
      button.style.display = "block";
    } else {
      button.style.display = "none";
      listagemForeach.style.display = "none";
      listagemForeachParcela.style.display = "none";
      arrowIconListagemParcelas.classList.remove("rotate1802");
      arrowIconListagem.classList.remove("rotate1802");
    }
  });
  if (containerId === "estrutura") {
    arrowIconEstrutura.classList.toggle("rotate180");
  }
}

const inputPesquisa = document.getElementById("inputPesquisa");
const botaoPesquisar = document.getElementById("buttonSearch");
const botaoEntrar = document.getElementById("botaoEntrar");

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    filtrarBotoes();
  }
});

function filtrarBotoes() {
  const termoPesquisa = inputPesquisa.value.toLowerCase();

  function filtrarBotoesContainer(containerId) {
    const container = document.getElementById(containerId);
    const botoes = container.querySelectorAll(".btn");

    if (termoPesquisa === "") {
      botoes.forEach((botao) => {
        botao.style.display = "none";
      });
    } else {
      botoes.forEach((botao) => {
        const textoBotao = botao.textContent.toLowerCase();
        const mostrar = textoBotao.includes(termoPesquisa);
        botao.style.display = mostrar ? "block" : "none";
      });
    }
  }

  filtrarBotoesContainer("clientesContainer");
  filtrarBotoesContainer("empresaContainer");
  filtrarBotoesContainer("contratoContainer");
  filtrarBotoesContainer("responsavelContainer");
  filtrarBotoesContainer("estruturaContainer");
}

inputPesquisa.addEventListener("input", filtrarBotoes);

function renderDocument() {
  const fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  const editor = tinymce.get("editor");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
    };

    reader.readAsText(file);
  }

  if (!firstFileAdded && !file) {
    const copiedElement = document.createElement("div");
    copiedElement.innerHTML = `<div class="non-found-template">
          <button id="closeAction">OK</button>
          Adicione um template e tente novamente.</div>`;
    const recebeAction = document.getElementById("recebeAction");
    recebeAction.appendChild(copiedElement);
    const closeAction = document.getElementById("closeAction");
    closeAction.addEventListener("click", function () {
      recebeAction.removeChild(copiedElement);
    });

    setTimeout(function () {
      recebeAction.removeChild(copiedElement);
    }, 4000);
    return;
  }

  // Se o primeiro arquivo ainda não foi adicionado, definir a flag como true
  if (!firstFileAdded) {
    firstFileAdded = true;
  } else {
    // Se o primeiro arquivo já foi adicionado, impedir que outro seja adicionado
    const mensagemDeErro = document.getElementById("mensagemDeErro");
    mensagemDeErro.style.display = "inline";
    return;
  }

  var Reader = new FileReader();
  Reader.onload = function (e) {
    var arrayBuffer = e.target.result;
    var mammothOptions = {};

    mammoth
      .extractRawText({ arrayBuffer: arrayBuffer })
      .then(function (result) {
        formattedContent = result.value; // Salva o conteúdo na variável global
        const arquivo = document.createElement("p");
        arquivo.innerText = formattedContent;
        const editor = tinymce.get("editor");
        console.log(formattedContent);
        let conteudoFormatado = formattedContent
          .replace(/</g, "&lt")
          .replace(/>/g, "&gt");
        conteudoFormatado = conteudoFormatado
          .split("\n")
          .map((para) => `<p>${para}</p>`)
          .join("");
        editor.setContent(conteudoFormatado, { format: "raw" });

        // Ativa o botão de remoção
        removeBtn.style.display = "inline";
        returnBtn.style.display = "inline";
      })
      .catch(function (err) {
        console.log(err);
        alert("Ocorreu um erro ao processar o arquivo DOCX.");
      });
  };

  Reader.readAsArrayBuffer(file);
}

function formatAndEditDocument() {
  const arquivo = document.createElement("p");
  arquivo.innerText = formattedContent;
  const editor = tinymce.get("editor");
  console.log(formattedContent);
  let conteudoFormatado = formattedContent
    .replace(/</g, "&lt")
    .replace(/>/g, "&gt");
  conteudoFormatado = conteudoFormatado
    .split("\n")
    .map((para) => `<p>${para}</p>`)
    .join("");
  editor.setContent(conteudoFormatado, { format: "raw" });

  // Ativa o botão de remoção
  removeBtn.style.display = "inline";
  returnBtn.style.display = "inline";
}

function removeFile() {
  // Remove o conteúdo do editor

  const editor = tinymce.get("editor");
  editor.setContent("");

  // Reinicia as variáveis globais
  formattedContent = "";

  // Oculta o botão de remoção

  const mensagemDeErro = document.getElementById("mensagemDeErro");
  mensagemDeErro.style.display = "none";
  const button = document.getElementById("btnDownload");
  button.style.display = "none";

  // Reinicia a flag para permitir que outro arquivo seja adicionado
  firstFileAdded = false;
}

function closeContainer() {
  const mensagemDeErro = document.getElementById("mensagemDeErro");
  mensagemDeErro.style.display = "none";
}

function downloadDocx() {
  console.log("entrou");
  const editor = tinymce.get("editor");
  const editedContent = editor.getContent();
  var regex = /<<\[.*\]>>/;

  if (!editedContent || !editedContent.trim()) {
    const copiedElement = document.createElement("div");
    copiedElement.innerHTML = `<div class="non-found-template">
            <button id="closeAction">OK</button>
            Nenhum conteúdo para baixar.</div>`;
    const recebeAction = document.getElementById("recebeAction");
    recebeAction.appendChild(copiedElement);
    const closeAction = document.getElementById("closeAction");
    closeAction.addEventListener("click", function () {
      recebeAction.removeChild(copiedElement);
    });

    setTimeout(function () {
      recebeAction.removeChild(copiedElement);
    }, 4000);
    return;
  }

  const styledContent = `<div style="font-family: 'Calibri', sans-serif; font-size: 11pt">${editedContent}</div>`;

  const blob = new Blob([styledContent], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "Template.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  function contarLinhas(texto, posicao) {
    var linhasAnteriores = texto.substr(0, posicao).split("\n");
    return linhasAnteriores.length;
  }
}

function clickParaVerificar() {
  console.log("Verificando...")
  const editor = tinymce.get("editor");

  // Obtém o conteúdo do editor
  const content = editor.getContent();

  // Seleciona todo o conteúdo no campo de texto HTML subjacente
  editor.selection.select(editor.getBody(), true);

  // Aplica a cor vermelha ao texto selecionado
  editor.execCommand("ForeColor", true, "black");
  editor.selection.collapse();
  const outputDiv = document.getElementById("output");
  outputDiv.style.backgroundColor = "transparent";
  outputDiv.style.boxShadow = "none";
  outputDiv.style.padding = "15px";
  outputDiv.style.borderRadius = "7px";
  outputDiv.style.marginTop = "-5%";
  outputDiv.style.overflow = "inherit"
  outputDiv.style.width = "10%"
  outputDiv.style.left = "100px"
  const loaderContainer = document.createElement("div");
  loaderContainer.id = "loaderContainer";
  const btnDownload = document.getElementById("btnDownload");
  if (btnDownload) {
    const btnDownloadContainer = document.getElementById(
      "btnDownloadContainer"
    );
    btnDownloadContainer.removeChild(btnDownload);
    loaderContainer.style.display = "none";
  }
  if (loaderContainer) {
    loaderContainer.remove();
  }
  outputDiv.innerHTML = "";
  const mensagemDiv = document.createElement("p");
  mensagemDiv.id = "mensagemVerificando";
  mensagemDiv.textContent = "Verificando...";

  const mensagemVerificandoContainer = document.createElement("div");
  mensagemVerificandoContainer.id = "mensagemVerificandoContainer";

  const loaderBar = document.createElement("div");
  loaderBar.id = "loaderBar";

  const loaderProgress = document.createElement("div");
  loaderProgress.id = "loaderProgress";

  outputDiv.appendChild(loaderContainer);
  loaderContainer.appendChild(loaderBar);
  loaderBar.appendChild(loaderProgress);

  outputDiv.appendChild(mensagemVerificandoContainer);

  mensagemVerificandoContainer.appendChild(mensagemDiv);
  loaderContainer.style.display = "flex";
  loaderBar.style.animation = "fadeeee 2s ease-in-out";
  mensagemDiv.style.animation = "fadeeee 2s ease-in-out";

  setTimeout(function () {
    mensagemVerificandoContainer.removeChild(mensagemDiv);
    verificarTexto();
  }, 2000);
}

function verificarTexto() {
  const texto = tinymce.activeEditor.getContent();
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  const textoDesescapado = texto.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  const numLinhas = texto.split("\n").length;

  // Gerar números de linha
  const numerosLinhas = Array.from(
    { length: numLinhas },
    (_, index) => index + 1
  ).join("\n");

  // Expressão regular para encontrar variáveis no formato <<[...]>>
  const regex = /<<\[([^[\]<>]+?)\]>>/g;
  let match;
  let isInsideForeach = false;

  // Lista de variáveis existentes
  const variaveisExistentes = [
    "NomeCliente",
    "CpfCliente",
    "RgCliente",
    "NomeResponsavel",
    "RazaoSocialFilial",
    "NomeFantasiaFilial",
    "CnpjCpfFilial",
    "TelefoneFilial",
    "EmailFilial",
    "EnderecoFilial",
    "NumeroEnderecoFilial",
    "ComplementoEnderecoFilial",
    "BairroFilial",
    "CepFilial",
    "CidadeFilial",
    "UfFilial",
    "DataNascimentoCliente",
    "SexoCliente",
    "EmailCliente",
    "TelefoneCliente",
    "EnderecoCliente",
    "NumeroEnderecoCliente",
    "ComplementoEnderecoCliente",
    "BairroCliente",
    "CepCliente",
    "CidadeCliente",
    "UfCliente",
    "DescricaoContrato",
    "DuracaoContrato",
    "ValorTotalContrato",
    "ValorTotalContratoFormatado",
    "ValorAdesao",
    "ValorAdesaoFormatado",
    "ValorTotalContratoSemDesconto",
    "ValorTotalContratoSemDescontoFormatado",
    "QuantMaximoSuspensoes",
    "QuantMaximoDiasSuspensao",
    "DataInicio",
    "DataValidade",
    "DataImpressao",
    "DataImpressaoCompleta",
    "DataImpressaoFormatada",
    "ValorTotalMedioMensalContrato",
    "ValorTotalMedioMensalContratoFormatado",
    "TemResponsavel",
    "CpfResponsavel",
    "RgResponsavel",
    "DataNascimentoResponsavel",
    "SexoResponsavel",
    "EmailResponsavel",
    "TelefoneResponsavel",
    "EnderecoResponsavel",
    "NumeroEnderecoResponsavel",
    "ComplementoEnderecoResponsavel",
    "BairroResponsavel",
    "CepResponsavel",
    "CidadeResponsavel",
    "UfResponsavel",
    "modalidade.DescricaoModalidade",
    "modalidade.LimiteAcessos",
    "modalidade.QtdeSessoesPorSemana",
    "modalidade.DiasLiberadosParaAcesso",
    "modalidade.HorariosLiberadosParaAcesso",
    "modalidade.DiasHorariosLiberadosParaAcesso",
    "modalidade.TipoDescricao",
    "modalidade.QtdePacoteAulas",
    "parcela.ValorFormatado",
    "parcela.DataVencimento"
  ];

  let temErros = false;

  while ((match = regex.exec(textoDesescapado)) !== null) {
    const variavelCompleta = match[0];
    const variavelConteudo = match[1];
    const lineNumber = texto.substr(0, match.index).split("\n").length;

    if(isInsideForeach){
      continue;
    }

    if (variavelCompleta !== `<<[${variavelConteudo}]>>`) {
      console.log("Entrou no 1° if");
      // Verificar se a variável está bem formada
      outputDiv.innerHTML += `Variável <span class="error">${variavelCompleta}</span> mal formada.<br>`;
      temErros = true;
    } else if (!variaveisExistentes.includes(variavelConteudo)) {
      // Verificar se a variável existe na lista
      const variaveisSemelhantes = variaveisExistentes.filter((existente) =>
        existente.toLowerCase().startsWith(variavelConteudo.toLowerCase())
      );
      if (variaveisSemelhantes.length > 0) {
        console.log("Está errado mas tem sugestão de correção.");

        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[lineNumber - 1]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();
        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.overflowY = "scroll"
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `O conteúdo <span class="error">"${variavelConteudo}"</span> da variável <span class="error">${variavelCompleta}</span><br>
             não existe na linha ${lineNumber}.<br><br>Sugestão de correção:<br>`;

        variaveisSemelhantes.forEach(function (variavel) {
          outputDiv.innerHTML += `<br><div class="list-correction">&#10132; \t<span>  <<[${variavel}]>> </span><button class="button-copy copy-button">Copiar</button></div>
          <hr>`;
        });
        const copyButtons = document.querySelectorAll(".copy-button");
        copyButtons.forEach(function (button) {
          button.addEventListener("click", function () {
            console.log("Copiou!!!");
            const variavel = this.previousElementSibling.textContent.trim();
            copyToClipboard(variavel);
            button.textContent = "Copiado!";
            setTimeout(() => {
              button.textContent = "Copiar";
            }, 3000);
          });
        });

        function copyToClipboard(text) {
          const textarea = document.createElement("textarea");
          const mensagemCopia = document.getElementById("mensagemCopia");
          mensagemCopia.className = "animation-fade";
          mensagemCopia.style.display = "inherit";
          mensagemCopia.innerHTML = "";
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          const valorCopiado = document.createElement("p");
          valorCopiado.textContent = `Variável ${text} copiada!`;
          mensagemCopia.appendChild(valorCopiado);
          setTimeout(function () {
            mensagemCopia.style.display = "none";
            mensagemCopia.className = "";
          }, 3900);
        }
        return;
      } else {
        console.log("Está errado e não tem sugestão de correção.");
        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `O conteúdo <span class="error">"${variavelConteudo}"</span> da variável <span class="error">${variavelCompleta}</span>
             não existe. <br><br>Não foi possível encontrar sugestão de recurso, <br>
             consulte a lista completa de variáveis.<br>`;
        return;
      }

      temErros = true;
    }
  }

  if (match && match[0].includes("<<foreach")) {
    isInsideForeach = true;
} else if (match && match[0].includes("<</foreach>>")) {
    isInsideForeach = false;
}
  // Tratar caso em que a variável está mal formada e não foi encontrada pelo regex
  const textoSemVariaveis = textoDesescapado.replace(/(<<\[([^>\s]+)]>>)/g, "");
  const REGEX = /<<if \[ValorAdesao > 0]>>([\s\S]*?)<<\/if>>/g;
  const REGEX2 = /<<if \[TemResponsavel > 0]>>([\s\S]*?)<<\/if>>/g;
  const REGEX3 = /<<if \[QuantMaximoDiasSuspensao > 0]>>([\s\S]*?)<<\/if>>/g;
  const REGEX4 = /<<foreach \[modalidade in Modalidades]>>([\s\S]*?)<<\/foreach>>/g;
  const REGEX5 = /<<foreach \[parcela in Parcelas]>>([\s\S]*?)<<\/foreach>>/g;

  const textoSemNada = textoSemVariaveis
    .replace(/<<if \[ValorAdesao > 0]>>([\s\S]*?)<<\/if>>/g, "")
    .replace(/<<if \[TemResponsavel > 0]>>([\s\S]*?)<<\/if>>/g, "")
    .replace(/<<if \[QuantMaximoDiasSuspensao > 0]>>([\s\S]*?)<<\/if>>/g, "")
    .replace(/<<foreach \[modalidade in Modalidades]>>([\s\S]*?)<<\/foreach>>/g, "")
    .replace(/<<foreach \[parcela in Parcelas]>>([\s\S]*?)<<\/foreach>>/g, "");

  const semPTags = textoSemNada.replace(/<p>/g, "");
  const semPTagsFinal = semPTags.replace(/<\/?p>/g, "");
  const semPTagsFinal15 = semPTagsFinal.replace(
    /<span\s+style="color:\s*red;">/g,
    ""
  );
  const semPTagsFinal17 = semPTagsFinal15.replace(/<\/span>/g, "");
  const semPTagsFinal18 = semPTagsFinal17.replace(
    /<span\s+style="color:\s*black;">/g,
    ""
  );
  const semPTagsFinal2 = semPTagsFinal18.replace(/<br>/g, "");
  console.log("Texto final: " + semPTagsFinal2);
  const regexx = /<<\[/;
  let conteudoDentroDoIf2 = "";
  let conteudoDentroDoForeach2 = ""
  const matches = REGEX.exec(textoSemVariaveis);
  const matches2 = REGEX2.exec(textoSemVariaveis);
  const matches3 = REGEX3.exec(textoSemVariaveis);
  const matches4 = REGEX4.exec(textoSemVariaveis);
  const matches5 = REGEX5.exec(textoSemVariaveis);
  console.log("Texto sem variáveis: \n" + textoSemVariaveis)
  console.log(matches);
  let conteudoDentroDoIf = "";
  if (matches || matches2 || matches3 || matches4 || matches5) {
    console.log("Entrou nos matches");
    if (matches) conteudoDentroDoIf += matches[1] || "";
    if (matches2) conteudoDentroDoIf += matches2[1] || "";
    if (matches3) conteudoDentroDoIf += matches3[1] || "";
    if (matches4) conteudoDentroDoIf += matches4[1] || "";
    if (matches5) conteudoDentroDoIf += matches5[1] || "";

    conteudoDentroDoIf = conteudoDentroDoIf
      .replace(/(<<\[([^>\s]+)]>>)/g, "")
      .replace(/<p>/g, "")
      .replace(/<\/?p>/g, "")
      .replace(/<span\s+style="color:\s*red;">/g, "")
      .replace(/<\/span>/g, "")
      .replace(/<span\s+style="color:\s*black;">/g, "")
      .replace(/<br>/g, "");

    console.log("Conteudo if: \n" + conteudoDentroDoIf);
  }
  const conteudoCompleto = `${semPTagsFinal2} ${conteudoDentroDoIf}`;
  console.log("SemPTagsFinal2: \n" + semPTagsFinal2)
  console.log("Conteudo inteiro: \n" + conteudoCompleto);

  if (
    conteudoCompleto.includes("<<[") ||
    conteudoCompleto.includes("]>>") ||
    conteudoCompleto.includes("<[") ||
    conteudoCompleto.includes("]>") ||
    conteudoCompleto.includes("<<") ||
    conteudoCompleto.includes(">>") ||
    conteudoCompleto.includes("<") ||
    conteudoCompleto.includes(">") ||
    conteudoCompleto.includes("[") ||
    conteudoCompleto.includes("]")
  ) {
    console.log("Variável identificada");
    const copiedElement = document.createElement("div");
    copiedElement.innerHTML = `<div class="non-found-template">
    <button id="closeAction">OK</button>
    Variável mal formada encontrada no texto.</div>`;
    const recebeAction = document.getElementById("recebeAction");
    recebeAction.appendChild(copiedElement);
    const closeAction = document.getElementById("closeAction");
    closeAction.addEventListener("click", function () {
      recebeAction.removeChild(copiedElement);
    });

    setTimeout(function () {
      recebeAction.removeChild(copiedElement);
    }, 4000);
    temErros = true;

    const ifMalFormado1 = conteudoCompleto.match(/<<if/);

    const foreachMalFormado1 = conteudoCompleto.match(/<<foreach/)

    const variavelMalFormada1 = conteudoCompleto.match(/<<\[(\S+)]>/); //ok
    const variavelMalFormada2 = conteudoCompleto.match(/<<\[(.*?)>>/); //ok
    const variavelMalFormada3 = conteudoCompleto.match(/<<\[(.*?)>/); //ok
    const variavelMalFormada4 = conteudoCompleto.match(/<<\[(.*?)]/); //ok

    const variavelMalFormada5 = conteudoCompleto.match(/<\[(.*?)]>$/); //ok
    const variavelMalFormada6 = conteudoCompleto.match(
      /<\[(.*?)(?![^\[]*?])>>/
    ); //ok
    const variavelMalFormada7 = conteudoCompleto.match(/<\[(.*?)>/); //ok
    const variavelMalFormada8 = conteudoCompleto.match(/<\[(.*?)]/); //ok
    const variavelMalFormada9 = conteudoCompleto.match(/<\[(.*?)]>>/); //ok

    const variavelMalFormada10 = conteudoCompleto.match(/<<(\S+)]>(?=>|\b)$/); //ok
    const variavelMalFormada11 = conteudoCompleto.match(/<<(.*?)>>/); //ok
    const variavelMalFormada12 = conteudoCompleto.match(/<<(.*?)>/); //ok
    const variavelMalFormada13 = conteudoCompleto.match(/<<(.*?)]/); //ok
    const variavelMalFormada14 = conteudoCompleto.match(/<<(.*?)]>>/); //ok

    const variavelMalFormada15 = conteudoCompleto.match(/<(\w*]>)>/); //<NomeCliente]> ok
    const variavelMalFormada16 = conteudoCompleto.match(/<(.*?)>>/); //<NomeCliente>> ok
    const variavelMalFormada17 = conteudoCompleto.match(/<(.*?)>/); //<NomeCliente> ok
    const variavelMalFormada18 = conteudoCompleto.match(/<(.*?)]/); //<NomeCliente] ok
    const variavelMalFormada19 = conteudoCompleto.match(/<(.*?)]>>/); //<NomeCliente]>> ok

    const variavelMalFormada20 = conteudoCompleto.match(/\[(\w+)]>(?![>])\b/); //ok
    const variavelMalFormada21 = conteudoCompleto.match(/\[(.*?)>>/); //ok
    const variavelMalFormada22 = conteudoCompleto.match(/\[(.*?)>/); //ok
    const variavelMalFormada23 = conteudoCompleto.match(/\[(.*?)]/); //ok
    const variavelMalFormada24 = conteudoCompleto.match(/\[(.*?)]>>/); //ok

    const variavelMalFormada25 = conteudoCompleto.match(/\b\w*\](?=>)\b/); //ok
    const variavelMalFormada26 = conteudoCompleto.match(/\b\w*\]>>\b/); //ok
    const variavelMalFormada27 = conteudoCompleto.match(/\b\w*\b>/); //ok
    const variavelMalFormada28 = conteudoCompleto.match(/\b\w*\](?=\W|$)/); //ok
    const variavelMalFormada29 = conteudoCompleto.match(/\b\w*\[\w+]\b>>/); //ok

    const editor = tinymce.get("editor");

    if (ifMalFormado1) {
      console.log("IF MAL FORMADO 1");
      console.log(ifMalFormado1.index);
      const purpleText = `<span style="color: purple;">${ifMalFormado1[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        ifMalFormado1.index
      );
      const purpleText2 = `<span style="color: purple;">${ifMalFormado1[1]}</span>`;

      const editor = tinymce.get("editor");
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const valorPadraoIf = document.createElement("p");
      valorPadraoIf.innerText =
        "<<if [TemResponsavel > 0]>> *CONTEÚDO* <</if>>\n\n<<if [ValorAdesao > 0]>> *CONTEÚDO* <</if>>\n\n<<if [QuantMaximoDiasSuspensao > 0]>> *CONTEÚDO* <</if>>";
      valorPadraoIf.style.color = "purple";
      valorPadraoIf.style.fontSize = "15px"
      console.log(valorPadraoIf);
      outputDiv.innerHTML += `Conteúdo mal formado: Estrutura IF na linha ${linhaPalavraMalFormada}.<br>
      
    
      Verifique se o valor segue o seguinte padrão:
      <br>
      <br>
      `;
      outputDiv.appendChild(valorPadraoIf);
      const btnSearch = document.createElement('button');
      btnSearch.innerText = "Procurar"
      outputDiv.appendChild(btnSearch)
      btnSearch.className = "verificaBtn"
      btnSearch.addEventListener('click', () => {
        const palavraPesquisa = "if"

        if(editor && palavraPesquisa) {
          const conteudo = editor.getContent({ format: 'html' });

          const indice = conteudo.indexOf(palavraPesquisa)
          if(indice !== -1){
            editor.selection.select(editor.dom.select("p")[palavraPesquisa]);
            editor.execCommand("ForeColor", true, "red");

            const palavraElemento = editor.getBody().querySelector('span[style="color:red;"]');
             if (palavraElemento) {
                palavraElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            alert('Palavra não encontrada!');
        }
        } else {
          alert('Editor não encontrado ou palavra de pesquisa não definida.');
      }
      })
    } 
    
    
    else if(foreachMalFormado1){
      console.log("FOR EACH MAL FORMADO 1");
      console.log(foreachMalFormado1.index);
      const purpleText = `<span style="color: purple;">${foreachMalFormado1[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        foreachMalFormado1.index
      );
      const purpleText2 = `<span style="color: purple;">${foreachMalFormado1[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(editor.dom.select("p")[foreachMalFormado1.index]);
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const valorPadraoForeach = document.createElement("p");
      console.log("Entrou na modalidade");
      valorPadraoForeach.innerText =
        "<<foreach [modalidade in Modalidades]>>\n*conteúdo*\n<</foreach>>\n\n<<foreach [parcela in Parcelas]>>\n*conteúdo*\n<</foreach>>";
      valorPadraoForeach.style.color = "purple";
      console.log(valorPadraoForeach);
      outputDiv.innerHTML += `Conteúdo mal formado: Estrutura ForEach na linha ${linhaPalavraMalFormada}.<br>
    
      Verifique se o valor segue o seguinte padrão:
      <br>
      `;
      outputDiv.appendChild(valorPadraoForeach);
    }
    
    else if (variavelMalFormada1) {
      console.log("Variável Mal Formada 1: " + variavelMalFormada1);
      const purpleText = `<span style="color: purple;">${variavelMalFormada1[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada1.index
      );
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira uma <span style="color: purple;">">"</span> no final da variável.<br>
      
        Sugestão de correção: ${purpleText}<span style="color: purple;">></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();

      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira uma <span style="color: purple;">">"</span> no final da variável.<br>
    
      Sugestão de correção: ${purpleText}<span style="color: purple;">></span>.`;
      if (conteudoCompleto.match(/<<\[(\S+)]>/)) {
        console.log("Deu certo!!!");
        conteudoCompleto.replace("<<[NomeCliente]>", "<<[]>>");
        console.log(conteudoCompleto);
      }
    } else if (variavelMalFormada2) {
      console.log("Variável Mal Formada 2: " + variavelMalFormada2[1]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada2[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada2.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada2[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.style.overflowY = "scroll"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}. <br>
        Insira uma <span style="color: purple;">"]"</span> após "${purpleText2}".<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
        return;
      }

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );

      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira uma <span style="color: purple;">"]"</span> após "${purpleText2}".<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada3) {
      console.log("Variável Mal Formada 3: " + variavelMalFormada3[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada3[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada3.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada3[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">"]>"</span> após "${purpleText2}".<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira <span style="color: purple;">"]>"</span> após "${purpleText2}".<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
      return;
    } else if (variavelMalFormada4) {
      console.log("Variável Mal Formada 4: " + variavelMalFormada4[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada4[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada4.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada4[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">">>"</span> no final da variável.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira <span style="color: purple;">">>"</span> no final da variável.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada5) {
      console.log("Variável Mal Formada 5: " + variavelMalFormada5[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada5[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada5.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada5[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">"<"</span> e <span style="color: purple;">">"</span> no final da variável.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira <span style="color: purple;">"<"</span> e <span style="color: purple;">">"</span> no final da variável.<br>
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada6) {
      console.log("Variável Mal Formada 6: " + variavelMalFormada6[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada6[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada6.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada6[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada7) {
      console.log("Variável Mal Formada 7: " + variavelMalFormada7[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada7[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada7.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada7[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada8) {
      console.log("Variável Mal Formada 8: " + variavelMalFormada8[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada8[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada8.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada8[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">"<"</span> no começo e <span style="color: purple;">">>"</span> no final da variável.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
      Insira <span style="color: purple;">"<"</span> no começo e <span style="color: purple;">">>"</span> no final da variável.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada9) {
      console.log("Variável Mal Formada 9: " + variavelMalFormada9[0]);
      const purpleText = `<span style="color: purple;">${variavelMalFormada9[0]}</span>`;
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada9.index
      );
      const purpleText2 = `<span style="color: purple;">${variavelMalFormada9[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.style.overflowY = "scroll"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">"<"</span> no começo e <span style="color: purple;">">>"</span> no final da variável.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText} na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">>></span>.`;
    } else if (variavelMalFormada10) {
      console.log("Variável Mal Formada 10: " + variavelMalFormada10[0]);
      const purpleText = `${variavelMalFormada10[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada10.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada10[1]}</span>`;
      if (conteudoDentroDoIf2) {
        console.log("Entrou");
        const editor = tinymce.get("editor");
        editor.selection.select(editor.dom.select("p")[conteudoDentroDoIf2]);
        editor.execCommand("ForeColor", true, "red");
        editor.selection.collapse();

        outputDiv.style.backgroundColor = "white";
        outputDiv.style.padding = "15px";
        outputDiv.style.borderRadius = "7px";
        outputDiv.style.marginTop = "-10%";
        outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
        outputDiv.style.animation = "fadein 0.8s ease-in";
        outputDiv.style.width = "40%"
        outputDiv.innerHTML += `Conteúdo mal formado: ${purpleText}.<br>
        Insira <span style="color: purple;">"<"</span> no começo e <span style="color: purple;">">>"</span> no final da variável.<br>
      
        Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">>></span>.`;
        return;
      }
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada11) {
      console.log("Variável Mal Formada 11: " + variavelMalFormada11[0]);
      const purpleText = `${variavelMalFormada11[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada11.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada11[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada12) {
      console.log("Variável Mal Formada 12: " + variavelMalFormada12[0]);
      const purpleText = `${variavelMalFormada12[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada12.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada12[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada13) {
      console.log("Variável Mal Formada 13: " + variavelMalFormada13[0]);
      const purpleText = `${variavelMalFormada13[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada13.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada13[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada14) {
      console.log("Variável Mal Formada 14: " + variavelMalFormada14[0]);
      const purpleText = `${variavelMalFormada14[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada14.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada14[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada15) {
      console.log("Variável Mal Formada 15: " + variavelMalFormada15[0]);
      const purpleText = `${variavelMalFormada15[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada15.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada15[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada16) {
      console.log("Variável Mal Formada 16: " + variavelMalFormada16[0]);
      const purpleText = `${variavelMalFormada16[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada16.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada16[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada17) {
      console.log("Variável Mal Formada 17: " + variavelMalFormada17[0]);
      const purpleText = `${variavelMalFormada17[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada17.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada17[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada18) {
      console.log("Variável Mal Formada 18: " + variavelMalFormada18[0]);
      const purpleText = `${variavelMalFormada18[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada18.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada18[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada19) {
      console.log("Variável Mal Formada 19: " + variavelMalFormada19[0]);
      const purpleText = `${variavelMalFormada19[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada19.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada19[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada20) {
      console.log("Variável Mal Formada 20: " + variavelMalFormada20[0]);
      const purpleText = `${variavelMalFormada20[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada20.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada20[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada21) {
      console.log("Variável Mal Formada 21: " + variavelMalFormada21[0]);
      const purpleText = `${variavelMalFormada21[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada21.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada21[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada22) {
      console.log("Variável Mal Formada 22: " + variavelMalFormada22[0]);
      const purpleText = `${variavelMalFormada22[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada22.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada22[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada23) {
      console.log("Variável Mal Formada 23: " + variavelMalFormada23[0]);
      const purpleText = `${variavelMalFormada23[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada23.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada23[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada24) {
      console.log("Variável Mal Formada 24: " + variavelMalFormada24[0]);
      const purpleText = `${variavelMalFormada24[0]}`;
      console.log(purpleText);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada24.index
      );

      const purpleText2 = `<span style="color: purple;">${variavelMalFormada24[1]}</span>`;

      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      const spanElement = document.createElement("span");
      const spanElement1 = document.createElement("span");
      spanElement1.style.color = "black";
      spanElement1.textContent = "Conteúdo mal formado: ";
      spanElement.style.color = "purple";
      spanElement.textContent = purpleText;
      outputDiv.append(spanElement1, spanElement);
      outputDiv.innerHTML += ` na linha ${linhaPalavraMalFormada}.<br>
    
      Sugestão de correção: <span style="color: purple;"><<[</span>${purpleText2}<span style="color: purple;">]>></span>.`;
    } else if (variavelMalFormada25) {
      console.log("Não entrou em nenhuma 25");
      console.log(variavelMalFormada25);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada25.index
      );
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado na <span style="color: purple;">linha ${linhaPalavraMalFormada}</span>.<br>
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada26) {
      console.log("Não entrou em nenhuma 26");
      console.log(variavelMalFormada26);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada26.index
      );
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado na <span style="color: purple;">linha ${linhaPalavraMalFormada}</span>.<br>
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada27) {
      console.log("Não entrou em nenhuma 27");
      console.log(variavelMalFormada27);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada27.index
      );
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado na <span style="color: purple;">linha ${linhaPalavraMalFormada}</span>.<br>
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada28) {
      console.log("Não entrou em nenhuma 28");
      console.log(variavelMalFormada28);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada28.index
      );
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado na <span style="color: purple;">linha ${linhaPalavraMalFormada}</span>.<br>
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;
    } else if (variavelMalFormada29) {
      console.log("Não entrou em nenhuma 29");
      console.log(variavelMalFormada29);
      const linhaPalavraMalFormada = contarLinhas(
        conteudoCompleto,
        variavelMalFormada29.index
      );
      const editor = tinymce.get("editor");
      editor.selection.select(
        editor.dom.select("p")[linhaPalavraMalFormada - 1]
      );
      editor.execCommand("ForeColor", true, "red");
      editor.selection.collapse();
      outputDiv.style.backgroundColor = "white";
      outputDiv.style.padding = "15px";
      outputDiv.style.borderRadius = "7px";
      outputDiv.style.marginTop = "-10%";
      outputDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
      outputDiv.style.animation = "fadein 0.8s ease-in";
      outputDiv.style.width = "40%"
      outputDiv.style.overflowY = "scroll"
      outputDiv.innerHTML += `Conteúdo mal formado na <span style="color: purple;">linha ${linhaPalavraMalFormada}</span>.<br>
      Sugestão de correção: <span style="color: purple;"><<[CONTEÚDO]>></span>.`;

    } 
    else {
      console.log("Não entrou em nenhuma");
    }
  }

  if (!temErros) {
    outputDiv.style.width = "inherit"
    outputDiv.style.left  = "500px"
    outputDiv.innerHTML +=
      '<span class="success">Nenhum erro encontrado.\nO texto está correto!</span>';
    const divContainer = document.getElementById("btnDownloadContainer");
    divContainer.innerHTML += `    <button onclick="downloadDocx()" class="btn btn-primary mt-3 d-flex justify-content-start" id="btnDownload" style="display: none;">Baixar DOCX</button>`;
    const lineNumbers = document.getElementById("lineNumbers");
    lineNumbers.style.top = "45.8%";
    const loaderContainer = document.getElementById("loaderContainer");
    loaderContainer.style.display = "none";
  }
  function contarLinhas(texto, posicao) {
    var trechoAnterior = texto.substr(0, posicao);
    var linhasAnteriores = trechoAnterior.split(/\r\n|\r|\n/);
    return linhasAnteriores.length;
  }
}

var botoesMensagem = document.querySelectorAll(".meusBotoes");

botoesMensagem.forEach(function (botao) {
  botao.addEventListener("mouseover", function () {
    exibirMensagem(botao.dataset.mensagem);
  });
  botao.addEventListener("mouseout", function () {
    esconderMensagem();
  });
});

function exibirMensagem(mensagem) {
  var mensagemElemento = document.getElementById("mensagem");
  mensagemElemento.textContent = mensagem;
  mensagemElemento.style.display = "block";
  mensagemElemento.style.animation = "fadein 0.3s ease-in-out";
}

function esconderMensagem() {
  document.getElementById("mensagem").style.display = "none";
}

tinymce.init({
  selector: "textarea#editor",
  debug: true,
  menubar: false,
  plugins: "autoresize",
  autoresize_bottom_margin: 20,
  autoresize_min_height: 500,
  codesample: {
    globalToolbar: false,
  },
  valid_elements: "*[*]",
  valid_children: "+body[style]",
  apiKey: "kacifcf3hr981xcm37om2ximqlp1fub3ufswvcru49gski63",
  width: "75%", // Ou defina um valor específico, como '500px'
  height: 500,
  content_style: "div { line-height: 2; }",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | forecolor",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
  mergetags_list: [
    { value: "First.Name", title: "First Name" },
    { value: "Email", title: "Email" },
  ],
  ai_request: (request, respondWith) =>
    respondWith.string(() =>
      Promise.reject("See docs to implement AI Assistant")
    ),
});

if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return Promise.all(
      promises.map((p) =>
        Promise.resolve(p).then(
          (value) => ({
            status: "fulfilled",
            value,
          }),
          (reason) => ({
            status: "rejected",
            reason,
          })
        )
      )
    );
  };
}

function mostrarListagem() {
  const listagemForeach = document.getElementById("listagemForeach");
  if (listagemForeach.style.display == "inherit") {
    listagemForeach.style.display = "none";
  } else {
    listagemForeach.style.display = "inherit";
    listagemForeach.style.animation = "fade 0.5s ease-in-out";
  }
  arrowIconListagem.classList.toggle("rotate1802");
}

function mostrarListagemParcelas() {
  const listagemForeachParcelas = document.getElementById(
    "listagemForEachParcelas"
  );
  if (listagemForeachParcelas.style.display == "inherit") {
    listagemForeachParcelas.style.display = "none";
  } else {
    listagemForeachParcelas.style.display = "inherit";
    listagemForeachParcelas.style.animation = "fade 0.5s ease-in-out";
  }
  arrowIconListagemParcelas.classList.toggle("rotate1802");
}

function mostrarVerificar() {
  const verificacoes = document.getElementById("verificacaoIf");
  if (verificacoes.style.display == "inherit") {
    verificacoes.style.display = "none";
  } else {
    verificacoes.style.display = "inherit";
    verificacoes.style.animation = "fade 0.5s ease-in-out";
  }
  arrowIconVerificar.classList.toggle("rotate1802");
}

document.addEventListener("DOMContentLoaded", function () {
  const checkboxesConfig = [
    {
      id: "nomeModalidade",
      value: "• Musculação",
      code: "\t• <<[modalidade.DescricaoModalidade]>>",
    },
    {
      id: "limiteAcessos",
      value: "\t◦ Limite de acessos: 3x por semana",
      code: "\t\t◦ Limite de acessos: <<[modalidade.LimiteAcessos]>>",
    },
    {
      id: "qtdSessoesSemana",
      value: "\t◦ Quantidade de sessões por semana: 3 Sessões por semana",
      code: "\t\t◦ Quantidade de sessões por semana: <<[modalidade.QtdeSessoesPorSemana]>>",
    },
    {
      id: "diasLiberadosAcesso",
      value:
        "\t◦ Dias liberados para acesso: segunda-feira, quarta-feira, sexta-feira",
      code: "\t\t◦ Dias liberados para acesso: <<[modalidade.DiasLiberadosParaAcesso]>>",
    },
    {
      id: "horariosLiberadosAcesso",
      value: "\t◦ Horários liberados: entre 08:00 e 12:00",
      code: "\t\t◦ Horários liberados: <<[modalidade.HorariosLiberadosParaAcesso]>>",
    },
    {
      id: "diasHorariosLiberadosAcesso",
      value:
        "\t◦ Dias e horários liberados: segunda-feira, quarta-feira, sexta-feira das 14:00 às 22:00 sábado das 08:00 às 12:00",
      code: "\t\t◦ Dias e horários liberados: <<[modalidade.DiasHorariosLiberadosParaAcesso]>>",
    },
    {
      id: "descTipoModalidade",
      value: "\t◦ Tipo do contrato: Sessões por semana",
      code: "\t\t◦ Tipo do contrato: <<[modalidade.TipoDescricao]>>",
    },
    {
      id: "qtdPacoteAulas",
      value: "\t◦ Quantidade de aulas no pacote: 8 aulas",
      code: "\t\t◦ Quantidade de aulas no pacote: <<[modalidade.QtdePacoteAulas]>>",
    },
  ];

  let valorInicial = `<<foreach [modalidade in Modalidades]>>\t`;
  let valorMeio = "";

  function createCheckboxListener(checkboxConfig, textAreaListagem) {
    const { id, value, code } = checkboxConfig;
    const checkbox = document.getElementById(id);

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        textAreaListagem.value += `\n ${value}`;
        valorMeio += `\n ${code}`;
        let valorResult = valorInicial + valorMeio + "\n<</foreach>>";
        console.log(valorResult);
      } else {
        const textoAtual = textAreaListagem.value;
        valorMeio = valorMeio.replace(`\n ${code}`, "");
        let valorResult = valorInicial + valorMeio + "\n<</foreach>>";
        console.log(valorResult);
        if (textoAtual.includes(`\n ${value}`)) {
          // Remove apenas o valor adicionado pelo checkbox
          textAreaListagem.value = textoAtual.replace(`\n ${value}`, "");
        }
      }
    });
  }

  // Aplica o event listener para cada checkbox
  const textAreaListagem = document.getElementById("textAreaListagem");
  checkboxesConfig.forEach((config) =>
    createCheckboxListener(config, textAreaListagem)
  );

  let valorResult = valorInicial + valorMeio + "\n<</foreach>>";

  const copyBtnList = document.getElementById("copyBtnList");
  copyBtnList.addEventListener("click", function () {
    const valorResult = valorInicial + valorMeio + "\n<</foreach>>";

    console.log(valorResult);
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = valorResult;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const checkboxesConfig = [
    {
      id: "valorParcelaFormatado",
      value: "\n\t• Valor da parcela: R$150,00",
      code: "\t• R$<<[parcela.ValorFormatado]>>",
    },
    {
      id: "dataVencimento",
      value: "com vencimento em 31/12/2023",
      code: "com vencimento em <<[parcela.DataVencimento]>>",
    },
  ];

  let valorInicial = `<<foreach [parcela in Parcelas]>>\t\n`;
  let valorMeio = "";

  function createCheckboxListener(checkboxConfig, textAreaListagemParcela) {
    const { id, value, code } = checkboxConfig;
    const checkbox = document.getElementById(id);

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        textAreaListagemParcela.value += ` ${value}`;
        valorMeio += ` ${code}`;
        let valorResult = valorInicial + valorMeio + "\n<</foreach>>";
        console.log(valorResult);
      } else {
        const textoAtual = textAreaListagemParcela.value;
        valorMeio = valorMeio.replace(` ${code}`, "");
        let valorResult = valorInicial + valorMeio + "\n<</foreach>>";
        console.log(valorResult);
        if (textoAtual.includes(`${value}`)) {
          // Remove apenas o valor adicionado pelo checkbox
          textAreaListagemParcela.value = textoAtual.replace(` ${value}`, "");
        }
      }
    });
  }

  // Aplica o event listener para cada checkbox
  const textAreaListagemParcela = document.getElementById(
    "textAreaListagemParcela"
  );
  checkboxesConfig.forEach((config) =>
    createCheckboxListener(config, textAreaListagemParcela)
  );

  let valorResult = valorInicial + valorMeio + "\n<</foreach>>";

  const copyBtnList = document.getElementById("copyBtnListParcela");
  copyBtnList.addEventListener("click", function () {
    const valorResult = valorInicial + valorMeio + "\n<</foreach>>";

    console.log(valorResult);
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = valorResult;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  });
});

function copiarTextoList() {
  const copyBtnList = document.getElementById("copyBtnList");
  copyBtnList.textContent = "Copiado! ✅";

  setTimeout(function () {
    copyBtnList.textContent = "Copiar";
  }, 3000); // 3000 milissegundos = 3 segundos
}

function copiarTextoListParcela() {
  const copyBtnList = document.getElementById("copyBtnListParcela");
  copyBtnList.textContent = "Copiado! ✅";

  setTimeout(function () {
    copyBtnList.textContent = "Copiar";
  }, 3000); // 3000 milissegundos = 3 segundos
}
