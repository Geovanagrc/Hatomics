
//Adicionar
const botaoAdd = document.querySelector(".btn-new") //Identificando botão no site
function addElement(nomeDoHabito = "Novo Hábito!",estadoDoHabito = false,dificuldade = "facil",estaCarregando = false, streak = 0, streakAnterior=null){
    const novoElemento = document.createElement("li");
    const botaoRemover = document.createElement("button");
    const check = document.createElement("input");
    const listaMae = document.querySelector("#listaMae");
    const textoDoHabito = document.createElement("span"); // como span fica mais organizado
    const entrada = document.createElement("input"); // É a entrada para realizar o update
    const spanStreak = document.createElement("span");

    novoElemento.dataset.dificuldade = dificuldade;// é um atributo que coloca uma classe do tipo data-dificuldade no li
    novoElemento.dataset.ultimoStreak = streakAnterior;// Vai mostrar o ultimo dia que um hábito foi marcado como feito
    novoElemento.dataset.streak = streak; // Vê o numero de vezes que seguidas que o usúario cumpriu aquele hábito

    textoDoHabito.textContent = nomeDoHabito; //Usa o argumento da função
    botaoRemover.textContent = "X";
    botaoRemover.className = "btn-delete"; //É a classe do CSS para botões.
    check.type = "checkbox";
    entrada.type = "text";
    entrada.classList.add("hidden"); // Mantem o botao escondido inicialmente
    entrada.value = nomeDoHabito;
    entrada.classList.add("inserirNome")
    spanStreak.classList.add("streak-span");
    spanStreak.textContent = "🔥" + streak;
    //novoElemento.className = "habito-concluido";
    
    novoElemento.appendChild(check);
    novoElemento.appendChild(textoDoHabito);
    novoElemento.appendChild(spanStreak);
    novoElemento.appendChild(entrada);
    novoElemento.appendChild(botaoRemover);
    listaMae.appendChild(novoElemento);

    //Verificando o estado do hábito
    if(estadoDoHabito === true){
        novoElemento.classList.add("habito-concluido");
        check.checked = true; //Marca o checkbox de acordo com o estado do hábito
    }
    else{
        check.checked = false;
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
    input.focus();
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
    const nomeDoHabito = maeDoCheck.querySelector("span")
    const visor = document.querySelector("#moedas");
    const hoje = new Date().toLocaleDateString('en-CA');
    const visorStreak = maeDoCheck.querySelector(".streak-span");
    let streakFinal = parseInt(maeDoCheck.dataset.streak); // pega o streak salvo no card
    let ultimoStreak = maeDoCheck.dataset.ultimoStreak;//pega o ultimo streak no atributo data

    let totalMoedas = parseInt(moedas);
    const moedasFacil = 1;
    const moedasMedio = 2;
    const moedasDificil = 3;


    maeDoCheck.classList.toggle("habito-concluido");//Se a class não existe ele adiciona, se existe ele retira.


    if (maeDoCheck.classList.contains("habito-concluido")===false){//Se o user marcou e desmarcou as moedas que ele recebeu devem ser retiradas
        if (maeDoCheck.dataset.dificuldade === "facil"){
            totalMoedas -= moedasFacil;
        }
        else if (maeDoCheck.dataset.dificuldade === "medio"){
            totalMoedas -= moedasMedio;
        }
        else if (maeDoCheck.dataset.dificuldade === "dificil"){
            totalMoedas -= moedasDificil;
        }

        if(ultimoStreak===hoje){ //Se o usuário só marcou e desmarcou, então ele não concluiu a tarefa e o ultimo streak foi ontem.
            streakFinal -= 1;
            ultimoStreak = ontem;
        }
    }
    else{
        if (maeDoCheck.dataset.dificuldade === "facil"){
            totalMoedas += moedasFacil;
        }
        else if (maeDoCheck.dataset.dificuldade === "medio"){
            totalMoedas += moedasMedio;
        }
        else if (maeDoCheck.dataset.dificuldade === "dificil"){
            totalMoedas += moedasDificil;
        }
        //lógica do streak
        if(ontem===ultimoStreak){ // Se o ultimo streak foi ontem o usuário manteve a corrente
            streakFinal +=1;
        }
        else if(hoje===ultimoStreak){ // Se o ultimo streak foi hoje ele só marcou e desmarcou o hábito
            streakFinal = streakFinal;
        }
        else{ // Se o ultimoStreak não foi ontem nem hoje, o usuário quebrou a corrente. Volta do inicio
            streakFinal = 1;
        }
        ultimoStreak = hoje;
    }

    
    visor.textContent = totalMoedas
    maeDoCheck.dataset.streak = streakFinal; //Atualiza o atributo data para o streak final.
    maeDoCheck.dataset.ultimoStreak = ultimoStreak
    visorStreak.textContent = "🔥" + streakFinal;
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
        const streakFinal = parseInt(habito.dataset.streak); // Lê o class data do streak
        const ultimoStreak = habito.dataset.ultimoStreak;
        //Verificando se o hábito esta marcado como feito
        const habitoFeito = habito.classList.contains("habito-concluido");// Retorna True ou false
        if (isNaN(streakFinal)){
            streakFinal = 0;
        }
        habitosTratados.push({
            nome:nomeDoHabito,
            estado: habitoFeito,
            dificuldade: dificuldade,
            streak: streakFinal,
            ultimoStreak: ultimoStreak
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
    const novoAcesso = (hoje !== ultimaVisita); // Compara se hoje é diferente do ultimo acesso

    if (armazenados === null){
        return;
    }// para a função aqui se não houver nada para carregar

    const habitosCodigo = JSON.parse(armazenados);//Transforma o texto em codigo novamente

    for(const habitos of habitosCodigo){
        let estadoCorreto; // se for um acesso no dia seguinte todos os hábitos resetam
        
        if(novoAcesso === true){
            estadoCorreto = false;
            salvarHabitos();

        }
        else{
            estadoCorreto = habitos.estado;
        }
        addElement(habitos.nome,estadoCorreto,habitos.dificuldade,true,habitos.streak,habitos.ultimoStreak);//Joga o nome e o estado de cada hábito para a função addElement
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
      if(span.textContent === ""){//Se não inserir nada volta a ser "Novo hábito"
        span.textContent = "Novo hábito!"
    }
    span.classList.remove("hidden");
    input.classList.add("hidden");
    
    salvarHabitos();
}

//Streaks
    //função auxiliar
function getOntem(){
    const data = new Date(); // Cria uma nova instância do objeto date
    data.setDate(data.getDate()-1)//getDate() retorna o DIA do mês.
    return data.toLocaleDateString('en-CA');
}
const ontem = getOntem();

carregarHabitos();
carregarMoedas();