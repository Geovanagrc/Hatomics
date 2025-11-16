
//Adicionar
const botaoAdd = document.querySelector(".btn-new") //Identificando botão no site
function addElement(nomeDoHabito = "Novo Hábito!",estadoDoHabito = false,dificuldade = "facil",estaCarregando = false){
    const novoElemento = document.createElement("li");
    const botaoRemover = document.createElement("button");
    const check = document.createElement("input");
    const listaMae = document.querySelector("#listaMae");
    const textoDoHabito = document.createElement("span"); // como span fica mais organizado
    const entrada = document.createElement("input"); // É a entrada para realizar o update

    novoElemento.dataset.dificuldade = dificuldade;// é um atributo que coloca uma classe do tipo data-dificuldade no li

    textoDoHabito.textContent = nomeDoHabito; //Usa o argumento da função
    botaoRemover.textContent = "X";
    botaoRemover.className = "btn-delete"; //É a classe do CSS para botões.
    check.type = "checkbox";
    entrada.type = "text";
    entrada.classList.add("hidden") // Mantem o botao escondido inicialmente
    entrada.value = nomeDoHabito
    //novoElemento.className = "habito-concluido";
    
    novoElemento.appendChild(check);
    novoElemento.appendChild(textoDoHabito);
    novoElemento.appendChild(entrada)
    novoElemento.appendChild(botaoRemover);
    listaMae.appendChild(novoElemento);

    //Verificando o estado do hábito
    if(estadoDoHabito === true){
        novoElemento.classList.add("habito-concluido");
        check.checked = true; //Marca o checkbox de acordo com o estado do hábito
    }

    //Ouvintes
    botaoRemover.addEventListener("click",removeElement);//Ouvinte para remover
    check.addEventListener("change",habitoFeito);// Ouvinte para "Marcar como feito"
    textoDoHabito.addEventListener("click",alterarNome);
    entrada.addEventListener("blur",salvarNome);
    //Salvando após adicionar um hábito.
    if(estaCarregando === false){
        salvarHabitos(); //Após adicionar salva a pag
    }
}

botaoAdd.addEventListener("click",mostrarformulario); // ouvinte com Arrow function devido aos erros de parametro na função addElement

//Formulário para nome do hábito
    //Abrir formulário de nome
function mostrarformulario(){
    const form = document.querySelector("#form-novoHabito");
    const input = form.querySelector("input[type = 'text']")
    input.value = "" // Limpa o que ficou no input anteriormente
    form.classList.remove("hidden")
}
const form = document.querySelector("#form-novoHabito");
    //enviar formulário
function enviarFormulario(evento){
    evento.preventDefault();//Por padrão o submit recarregaria a página para enviar a info para o servidor. O método contrária isso.
    const form = document.querySelector("#form-novoHabito");
    const input = form.querySelector("input[type = 'text']");//texto que o usúario inseriu
    const selectDificuldade = form.querySelector("#select-dificuldade"); //É o select das dificuldades do hábito.

    if (input.value.trim() === ""){ // trim() remove os espaços antes e depois
        alert("Insira um nome para o hábito!"); // Mostra uma mensagem de alerta no navegador.
        return; // para a função aqui
    }

    addElement(input.value,false,selectDificuldade.value);
    form.classList.add("hidden")
    //A função addElement já vai salvar a pag.
}
form.addEventListener("submit",enviarFormulario)

//Remover
function removeElement(evento){
    const localDoBotao = evento.target;
    const maeDoBotao = localDoBotao.parentElement;//É o que queremos apagar: A li.
    const avoDoBotao = maeDoBotao.parentElement; //é a ul da li

    avoDoBotao.removeChild(maeDoBotao)
    salvarHabitos(); //Após adicionar salva a pag

}

//Concluir hábito
function habitoFeito(evento){//coloquei o ouvinte na função addElement
    const localDoCheck = evento.target;
    const maeDoCheck = localDoCheck.parentElement; // Descobre o li que queremos
    const moedas  = localStorage.getItem("minhasMoedas");
    const visor = document.querySelector("#moedas")
    let totalMoedas = parseInt(moedas);
    const moedasFacil = 1;
    const moedasMedio = 2;
    const moedasDificil = 3;


    maeDoCheck.classList.toggle("habito-concluido");//Se a class não existe ele adiciona, se existe ele retira.


    if (maeDoCheck.classList.contains("habito-concluido")===false){//Se o user marcou e desmarcou as moedas que ele recebeu devem ser retiradas
        if (maeDoCheck.dataset.dificuldade === "facil"){
            totalMoedas -= moedasFacil;
        }
        if (maeDoCheck.dataset.dificuldade === "medio"){
            totalMoedas -= moedasMedio;
        }
        if (maeDoCheck.dataset.dificuldade === "dificil"){
            totalMoedas -= moedasDificil;
        }
    }
    else{
        if (maeDoCheck.dataset.dificuldade === "facil"){
            totalMoedas += moedasFacil;
        }
        if (maeDoCheck.dataset.dificuldade === "medio"){
            totalMoedas += moedasMedio;
        }
        if (maeDoCheck.dataset.dificuldade === "dificil"){
            totalMoedas += moedasDificil;
        }
    }

    visor.textContent = totalMoedas

    salvarMoedas(totalMoedas);
    salvarHabitos(); //Após adicionar salva a pag

}

//Local Storage
    //Salvar hábitos
function salvarHabitos(){
    const habitos = document.querySelectorAll("li"); //Faz um array com todos os meus hábitos
    const habitosTratados = []; //é onde vou armazenar os habitos já tratados pelo for


    for(const habito of habitos){
        //Verificando o nome do hábito
        const spanHabito = habito.querySelector("span");
        const nomeDoHabito = spanHabito.textContent;
        const dificuldade = habito.dataset.dificuldade;//Lê o class data que criamos em addElement
        //Verificando se o hábito esta marcado como feito
        const habitoFeito = habito.classList.contains("habito-concluido");// Retorna True ou false

        habitosTratados.push({
            nome:nomeDoHabito,
            estado: habitoFeito,
            dificuldade: dificuldade
        })
    }

    localStorage.setItem("habitos",JSON.stringify(habitosTratados)) //Cria um item no local storage (em forma de texto) com a array de habitos
    
}
    //Salvar moedas
function salvarMoedas(novoTotal){
    localStorage.setItem("minhasMoedas",JSON.stringify(novoTotal)) // cria um item para a carteira no local storage em forma de texto
}

//Sistema de carregamento 
    //carregar habitos
function carregarHabitos(){
    const armazenados = localStorage.getItem("habitos"); //pega o que esta no local storage 
    const hoje = new Date().toLocaleDateString('en-CA'); //pega a data de hoje e coloca no padrão canada ano-mês-dia
    const ultimaVisita = localStorage.getItem('dataAtual'); // Pega a data de ontem no local storage.
    console.log("Hoje: ",hoje," UltimaVisita: ",ultimaVisita); //Testando para ver se as datas estão corretas.
    const novoAcesso = (hoje !== ultimaVisita); // Compara se hoje é diferente do ultimo acesso

    if (armazenados === null){
        return;
    }// para a função aqui se não houver nada para carregar

    const habitosCodigo = JSON.parse(armazenados);//Transforma o texto em codigo novamente

    for(const habitos of habitosCodigo){
        let estadoCorreto; // se for um acesso no dia seguinte todos os hábitos resetam
        
        if(novoAcesso === true){
            estadoCorreto = false;
        }
        else{
            estadoCorreto = habitos.estado;
        }
        addElement(habitos.nome,estadoCorreto,habitos.dificuldade,true);//Joga o nome e o estado de cada hábito para a função addElement
    }

    localStorage.setItem("dataAtual",hoje);

}
    //carregar moedas
function carregarMoedas(){
    const visor = document.querySelector("#moedas")
    const moedasAtuais = localStorage.getItem("minhasMoedas"); // sempre pega o item em string
    let totalMoedas = parseInt(moedasAtuais);//var para moedas.

    if(moedasAtuais === null){ //lógica para que o visor não mostre null.
        totalMoedas = 0;
        localStorage.setItem("minhasMoedas",0); // No primeiro acesso preenche a carteira com 0.
    }
    else{
        totalMoedas = parseInt(moedasAtuais);
    }
    visor.textContent = totalMoedas
}

//Gerenciando o nome do hábito
    //Update de nome
function alterarNome(evento){
    const span = evento.target;
    const paiDeTodos = span.parentElement;
    const input = paiDeTodos.querySelector("input[type='text']")
    
    span.classList.add("hidden")
    input.classList.remove("hidden")
    
    input.focus();
}
    //Salvar nome
function salvarNome(evento){
    const input = evento.target;
    const paiDeTodos = input.parentElement;
    const span = paiDeTodos.querySelector("span")
    
  
    span.textContent = input.value;
      if(span.textContent === ""){//Se não inserir nada voltar a ser "Novo hábito"
        span.textContent = "Novo hábito!"
    }
    span.classList.remove("hidden");
    input.classList.add("hidden");
    
    salvarHabitos();
}

carregarHabitos();
carregarMoedas();