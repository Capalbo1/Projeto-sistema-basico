document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM
    const inputNome = document.querySelector('#nome');
    const inputCarro = document.querySelector('#carro');
    const inputPlaca = document.querySelector('#placa');
    const inputQuilometragem = document.querySelector('#quilometragem');
    const inputObservacao = document.querySelector('#observacao');
    const btnTarefa = document.querySelector('.btn-submit');
    const tarefas = document.querySelector('.clients-table tbody');

    let contadorId = 1;  // Contador para IDs únicos

    // Função para gerar um novo ID
    function geraIdUnico() {
        return contadorId++;
    }

    // Função para criar uma nova linha (tr) na tabela
    function criaTr() {
        return document.createElement('tr');
    }

    // Limpa os inputs após a adição de um cliente
    function limpaInputs() {
        inputNome.value = '';
        inputCarro.value = '';
        inputPlaca.value = '';
        inputQuilometragem.value = '';
        inputObservacao.value = '';
        inputNome.focus();
    }

    // Função para criar o botão de apagar e adicioná-lo à linha (tr)
    function criaBotaoApagar(td) {
        const botaoApagar = document.createElement('button');
        botaoApagar.innerText = "Apagar";
        botaoApagar.classList.add('apagar');
        td.appendChild(botaoApagar);
    }

    // Função para criar o botão de editar e adicioná-lo à linha (tr)
    function criaBotaoEditar(td) {
        const botaoEditar = document.createElement('button');
        botaoEditar.innerText = "Editar";
        botaoEditar.classList.add('editar');
        td.appendChild(botaoEditar);
    }

    // Função para criar uma nova tarefa (cliente) e adicioná-la à tabela
    function criaTarefa(nome, carro, placa, quilometragem, observacao, id) {
        const tr = criaTr();
        tr.dataset.id = id;  // Adiciona o ID como um atributo de dados à linha
        tr.innerHTML = `
            <td>${id}</td>  <!-- Exibe o ID na tabela -->
            <td>${nome}</td>
            <td>${carro}</td>
            <td>${placa}</td>
            <td>${quilometragem}</td>
            <td>${observacao}</td>
            <td></td>
        `;
        const tdAcao = tr.querySelector('td:last-child');
        criaBotaoEditar(tdAcao);
        criaBotaoApagar(tdAcao);
        tarefas.appendChild(tr);
        limpaInputs();
        salvarTarefa();
    }

    // Função para exibir mensagens ao usuário
    function mostrarMensagem(mensagem) {
        alert(mensagem);  // Você pode substituir por um elemento HTML para mensagens não intrusivas
    }

    // Evento de clique no botão de adicionar cliente
    btnTarefa.addEventListener('click', function() {
        if (!inputNome.value || !inputCarro.value || !inputPlaca.value || !inputQuilometragem.value || !inputObservacao.value) {
            mostrarMensagem("Por favor, preencha todos os campos.");
            return;
        }
        
        // Se já existe um item com essas informações, substitua-o
        const linhas = tarefas.querySelectorAll('tr');
        let tarefaAtualizada = false;

        for (let tr of linhas) {
            const tdValores = tr.querySelectorAll('td');
            if (tdValores[1].innerText === inputNome.value &&
                tdValores[2].innerText === inputCarro.value &&
                tdValores[3].innerText === inputPlaca.value) {
                // Atualiza a linha existente
                tdValores[1].innerText = inputNome.value;
                tdValores[2].innerText = inputCarro.value;
                tdValores[3].innerText = inputPlaca.value;
                tdValores[4].innerText = inputQuilometragem.value;
                tdValores[5].innerText = inputObservacao.value;
                tarefaAtualizada = true;
                break;
            }
        }

        if (!tarefaAtualizada) {
            const id = geraIdUnico();
            criaTarefa(inputNome.value, inputCarro.value, inputPlaca.value, inputQuilometragem.value, inputObservacao.value, id);
        }
        
        mostrarMensagem("Cliente adicionado ou atualizado com sucesso!");
    });

    // Evento de clique para apagar ou editar uma linha da tabela
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains('editar')) {
            const tr = e.target.closest('tr');
            const tdValores = tr.querySelectorAll('td');
            inputNome.value = tdValores[1].innerText;
            inputCarro.value = tdValores[2].innerText;
            inputPlaca.value = tdValores[3].innerText;
            inputQuilometragem.value = tdValores[4].innerText;
            inputObservacao.value = tdValores[5].innerText;
            tr.remove();  // Remove a linha antiga enquanto editamos
            salvarTarefa(); // Atualiza o armazenamento após remover a linha antiga
        } else if (e.target.classList.contains('apagar')) {
            if (confirm("Deseja realmente apagar este cliente?")) {
                e.target.closest('tr').remove();
                salvarTarefa();
            }
        }
    });

    // Função para salvar os dados no localStorage
    function salvarTarefa() {
        const trTarefas = tarefas.querySelectorAll('tr');
        const listaDeTarefas = [];

        for (let tr of trTarefas) {
            const tdValores = tr.querySelectorAll('td');
            const tarefaTexto = {
                id: tr.dataset.id,  // Adiciona o ID ao objeto de tarefa
                nome: tdValores[1].innerText,
                carro: tdValores[2].innerText,
                placa: tdValores[3].innerText,
                quilometragem: tdValores[4].innerText,
                observacao: tdValores[5].innerText
            };
            listaDeTarefas.push(tarefaTexto);
        }

        const tarefasJSON = JSON.stringify(listaDeTarefas);
        localStorage.setItem('tarefas', tarefasJSON);
    }

    // Função para carregar as tarefas salvas do localStorage
    function adicionaTarefasSalvas() {
        const tarefas = localStorage.getItem('tarefas');
        if (tarefas) {
            const listaDeTarefas = JSON.parse(tarefas);
            listaDeTarefas.forEach(tarefa => {
                criaTarefa(tarefa.nome, tarefa.carro, tarefa.placa, tarefa.quilometragem, tarefa.observacao, tarefa.id);
            });
        }
    }

    // Chama a função para adicionar as tarefas salvas ao carregar a página
    adicionaTarefasSalvas();
});
