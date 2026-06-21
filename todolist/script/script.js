// Elementos da página
const addButton = document.getElementById('add-btn');
const closeButton = document.getElementById('close-btn');
const tarefaInput = document.getElementById('tarefa');
const timeInput = document.getElementById('time');
const addTaskButton = document.getElementById('adicionarTarefa');
const overlay = document.getElementById('overlay');
const tarefasContainer = document.getElementById('tarefas');
const mostrarPendentesBtn = document.getElementById('mostrar-pendentes-btn');
const mostrarConcluidosBtn = document.getElementById('mostrar-concluidos-btn');

// Lista onde as tarefas ficam salvas
let tarefas = [];
let contadorId = 1;
let tarefaEditando = null;
let mostrarConcluidos = false;

// Eventos principais
addButton.addEventListener('click', abrirFormulario);
closeButton.addEventListener('click', fecharFormulario);
addTaskButton.addEventListener('click', salvarTarefa);
mostrarPendentesBtn.addEventListener('click', mostrarPendentes);
mostrarConcluidosBtn.addEventListener('click', mostrarConcluidosFunc);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !overlay.classList.contains('hidden')) {
        salvarTarefa();
    }

    if (event.key === 'Escape') {
        fecharFormulario();
    }
});

// Abre o formulário
function abrirFormulario() {
    // Limpa e mostra o formulário apenas ao clicar no botão de adicionar.
    // Ao editar, o campo será preenchido por `editarTarefa()`.

    if (tarefaEditando === null) {
        tarefaInput.value = '';
        timeInput.value = '';
    }


    overlay.classList.remove('hidden');

    overlay.classList.remove('hidden');
    // Coloca o cursor automaticamente no input de texto
    tarefaInput.focus();
}


// Fecha o formulário
function fecharFormulario() {
    overlay.classList.add('hidden');

    tarefaInput.value = '';
    timeInput.value = '';
    tarefaEditando = null;

}


// Salva uma nova tarefa ou edita uma existente
function salvarTarefa() {
    const nomeTarefa = (tarefaInput.value ?? '').toString().trim();
    const dataConclusao = timeInput.value;

    // Validação básica
    if (!nomeTarefa) {
        alert('Por favor, insira o nome da tarefa');
        tarefaInput.focus();
        return;
    }

    if (!dataConclusao) {
        alert('Por favor, insira a data de conclusão');
        return;
    }

    // Edita ou cria a tarefa
    if (tarefaEditando !== null) {
        for (let i = 0; i < tarefas.length; i++) {
            if (tarefas[i].id === tarefaEditando) {
                tarefas[i].task = nomeTarefa;
                tarefas[i].duration = dataConclusao;
                break;
            }
        }
    } else {
        const novaTarefa = {
            id: contadorId,
            task: nomeTarefa,
            duration: dataConclusao,
            completed: false
        };

        tarefas.push(novaTarefa);
        contadorId++;
    }

    salvarNoNavegador();
    fecharFormulario();
    mostrarTarefas();

}


// Marca a tarefa como concluída
function concluirTarefa(id) {
    // Procura a tarefa certa pelo id
    for (let i = 0; i < tarefas.length; i++) {
        // Se achou, marca como concluída
        if (tarefas[i].id === id) {
            // A tarefa agora passa a contar como concluída
            tarefas[i].completed = true;
            // Para a busca
            break;
        }
    }

    // Persiste a alteração
    salvarNoNavegador();
    // Re-renderiza a lista (para aparecer/desaparecer conforme o filtro)
    mostrarTarefas();
}


// Prepara a tarefa para edição
function editarTarefa(id) {
    // Procura a tarefa pelo id para conseguir preencher os inputs
    for (let i = 0; i < tarefas.length; i++) {
        // Se o id bater, é a tarefa que vai ser editada
        if (tarefas[i].id === id) {
            // Guarda qual tarefa está sendo editada
            tarefaEditando = id;

            // Preenche os campos do formulário com os valores atuais
            tarefaInput.value = tarefas[i].task;
            timeInput.value = tarefas[i].duration;

            // Abre o modal de edição
            overlay.classList.remove('hidden');
            // Foca no campo de texto
            tarefaInput.focus();

            // Para porque já achou
            break;
        }
    }
}


// Remove uma tarefa
function deletarTarefa(id) {
    // Filtra removendo a tarefa que tem o id igual ao recebido
    tarefas = tarefas.filter(function(tarefa) {
        // Mantém tudo que NÃO for a tarefa que queremos apagar
        return tarefa.id !== id;
    });

    // Persiste a alteração
    salvarNoNavegador();
    // Atualiza a lista na tela
    mostrarTarefas();
}


// Mostra as tarefas na tela
function mostrarTarefas() {
    tarefasContainer.innerHTML = '';

    // Percorre todas as tarefas salvas
    for (let i = 0; i < tarefas.length; i++) {
        const tarefa = tarefas[i];

        // Decide se vai mostrar ou não de acordo com o filtro atual
        const deveMostrar = mostrarConcluidos ? tarefa.completed === true : tarefa.completed !== true;

        if (deveMostrar) {
            const tarefaElemento = criarElementoTarefa(tarefa);
            tarefasContainer.appendChild(tarefaElemento);
        }
    }
}


function mostrarPendentes() {
    // Configura o filtro para exibir apenas tarefas não concluídas
    mostrarConcluidos = false;
    // Atualiza os botões 
    atualizarBotoesAtivos();
    // Atualiza a lista
    mostrarTarefas();
}

function mostrarConcluidosFunc() {
    // Configura o filtro para exibir apenas tarefas concluídas
    mostrarConcluidos = true;
    // Atualiza os botões (classe active)
    atualizarBotoesAtivos();
    // atualiza a lista
    mostrarTarefas();
}


function atualizarBotoesAtivos() {
    // Se está mostrando concluídos, então ativa o botão de concluídos
    if (mostrarConcluidos) {
        // Desativa o botão de pendentes
        mostrarPendentesBtn.classList.remove('active');
        // Ativa o botão de concluídos
        mostrarConcluidosBtn.classList.add('active');
    } else {
        // Caso contrário, ativa o botão de pendentes
        mostrarPendentesBtn.classList.add('active');
        // Desativa o botão de concluídos
        mostrarConcluidosBtn.classList.remove('active');
    }
}


// Cria o bloco visual da tarefa
function criarElementoTarefa(tarefa) {
    // Cria a "caixa" principal da tarefa
    const div = document.createElement('div');
    div.classList.add('item-todo');
    // id único para facilitar identificação
    div.id = `task-${tarefa.id}`;

    // Div que vai conter as informações (nome e data)
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('task-info');

    // Campo com o nome da tarefa
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('task-name');
    // Coloca o texto diretamente
    nameDiv.textContent = tarefa.task;

    // Campo com a data de conclusão (formatada em pt-BR)
    const durationDiv = document.createElement('div');
    durationDiv.classList.add('task-duration');
    durationDiv.textContent = `Conclusão: ${new Date(tarefa.duration).toLocaleDateString('pt-BR')}`;

    // Organiza as informações dentro da infoDiv
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(durationDiv);

    // Div que vai conter os botões de ação
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('task-actions');

    // Botão para editar a tarefa
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-action', 'btn-edit');
    editBtn.textContent = '✏️';
    editBtn.onclick = function() {
        // Chama a função de edição com o id atual
        editarTarefa(tarefa.id);
    };

    // Botão para marcar como concluída
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('btn-action', 'btn-complete');
    completeBtn.textContent = '✔️';
    completeBtn.onclick = function() {
        // Chama a função de concluir com o id atual
        concluirTarefa(tarefa.id);
    };

    // Botão para remover a tarefa
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-action', 'btn-exclude');
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = function() {
        // Chama a função de deletar com o id atual
        deletarTarefa(tarefa.id);
    };

    // Coloca os botões dentro da área de ações
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    // Junta informações e ações na caixa principal
    div.appendChild(infoDiv);
    div.appendChild(actionsDiv);
    return div;
}


function showTaskPage() {
    // Quando clicar em "Adicionar", abre o formulário/modal
    abrirFormulario();
}

function closeTaskPage() {
    // Quando clicar em "×", fecha o formulário/modal
    fecharFormulario();
}


// Carrega as tarefas salvas
function carregarTarefas() {
    // Lê as tarefas do localStorage
    const tarefasSalvas = localStorage.getItem('tarefas');

    // Se existir algo salvo, então converte de volta para array
    if (tarefasSalvas) {
        // Converte JSON para objeto/array JavaScript
        tarefas = JSON.parse(tarefasSalvas);

        // Atualiza o contador para evitar ids repetidos
        for (let i = 0; i < tarefas.length; i++) {
            // Se a tarefa atual tiver id maior ou igual, então aumenta o contador
            if (tarefas[i].id >= contadorId) {
                contadorId = tarefas[i].id + 1;
            }
        }
    }

    // Renderiza a lista na tela após carregar
    mostrarTarefas();
}

// Salva no localStorage
function salvarNoNavegador() {
    // Converte array para JSON e salva no navegador
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}


// Inicia o sistema
// Carrega as tarefas salvas e mostra na tela
carregarTarefas();

