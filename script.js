
//Adicionar
const botaoAdd = document.querySelector(".btn-new")//Identificando botão no site
function addElement(nomeDoHabito = "Novo Hábito!",estadoDoHabito = false){
    const novoElemento = document.createElement("li");
    const botaoRemover = document.createElement("button");
    const check = document.createElement("input");
    const listaMae = document.querySelector("#listaMae");
    const textoDoHabito = document.createElement("span"); // como span fica mais organizado

    textoDoHabito.textContent = nomeDoHabito;
    botaoRemover.textContent = "X";
    botaoRemover.className = "btn-delete"; //É a classe do CSS para botões.
    check.type = "checkbox";
    //novoElemento.className = "habito-concluido";
    //Verificando estadoDoHabito
   

    novoElemento.appendChild(check);
    novoElemento.appendChild(textoDoHabito);
    novoElemento.appendChild(botaoRemover);
    listaMae.appendChild(novoElemento);


    if(estadoDoHabito === true){
        novoElemento.classList.add("habito-concluido");
        check.checked = true; //Marca o checkbox de acordo com o estado do hábito
    }

    botaoRemover.addEventListener("click",removeElement);//Ouvinte para remover
    check.addEventListener("change",habitoFeito);// Ouvinte para "Marcar como feito"

    salvarHabitos(); //Após adicionar salva a pag
}

botaoAdd.addEventListener("click",()=>{addElement();}); // ouvinte com Arrow function devido aos erros de parametro na função addElement

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

    maeDoCheck.classList.toggle("habito-concluido");//Se a chave não existe ele adiciona, se existe ele retira.

    salvarHabitos(); //Após adicionar salva a pag

}

//Salvar hábitos
function salvarHabitos(){
    const habitos = document.querySelectorAll("li"); //Faz um array com todos os meus hábitos
    const habitosTratados = []; //é onde vou armazenar os habitos já tratados pelo for

    for(const habito of habitos){
        //Verificando o nome do hábito
        const spanHabito = habito.querySelector("span");
        const nomeDoHabito = spanHabito.textContent;
        
        //Verificando se o hábito esta marcado como feito
        const habitoFeito = habito.classList.contains("habito-concluido");// Retorna True ou false

        habitosTratados.push({
            nome:nomeDoHabito,
            estado: habitoFeito
        })
    }

    localStorage.setItem("habitos",JSON.stringify(habitosTratados)) //Cria um item no local storage (em forma de texto) com a array de habitos
    
}
//Carregar hábitos
function carregarHabitos(){
    const armazenados = localStorage.getItem("habitos"); //pega o que esta no local storage 

    if (armazenados === null){
        return;
    }// para a função aqui se não houver nada para carregar

    const habitosCodigo = JSON.parse(armazenados);//Transforma o texto em codigo novamente

    for(const habitos of habitosCodigo){
        addElement(habitos.nome,habitos.estado);//Joga o nome e o estado de cada hábito para a função addElement
    }

}
carregarHabitos();