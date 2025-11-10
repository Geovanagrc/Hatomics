
//Adicionar
const botaoAdd = document.querySelector(".btn-new")//Identificando botão no site
function addElement(){
    const novoElemento = document.createElement("li");
    const botaoRemover = document.createElement("button");
    const check = document.createElement("input");
    const listaMae = document.querySelector("#listaMae");
    const textoDoHabito = document.createElement("span"); // como span fica mais organizado

    textoDoHabito.textContent = "Novo hábito!";
    botaoRemover.textContent = "X";
    botaoRemover.className = "btn-delete"; //É a classe do CSS para botões.
    check.type = "checkbox";
    //novoElemento.className = "habito-concluido";

    listaMae.appendChild(novoElemento);
    novoElemento.appendChild(check);
    novoElemento.appendChild(textoDoHabito);
    novoElemento.appendChild(botaoRemover);

    botaoRemover.addEventListener("click",removeElement);//Ouvinte para remover
    check.addEventListener("change",habitoFeito);
}
botaoAdd.addEventListener("click",addElement); // ouvinte

//Remover
const botaoRemov = document.querySelectorAll(".btn-delete");
function removeElement(evento){
    const localDoBotao = evento.target;
    const maeDoBotao = localDoBotao.parentElement;//É o que queremos apagar: A li.
    const avoDoBotao = maeDoBotao.parentElement; //é a ul da li

    avoDoBotao.removeChild(maeDoBotao)
}
botaoRemov.addEventListener("click",removeElement);//Ouvinte para remover

//Concluir hábito
function habitoFeito(evento){//coloquei o ouvinte na função addElement
    const localDoCheck = evento.target;
    const maeDoCheck = localDoCheck.parentElement; // Descobre o li que queremos

    maeDoCheck.classList.toggle("habito-concluido");//Se a chave não existe ele adiciona, se existe ele retira.
}