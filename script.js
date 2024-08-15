document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do DOM
    const inputNome = document.querySelector('#nome');
    const inputCarro = document.querySelector('#carro');
    const inputPlaca = document.querySelector('#placa');
    const inputObservacao = document.querySelector('#observacao');
    const btnTarefa = document.querySelector('.btn-submit');
    const tarefas = document.querySelector('.clients-table tbody');

    // Função para criar uma nova linha (tr) na tabela
    function criaTr() {
        const tr = document.createElement('tr');
        return tr;
    }

    // Limpa os inputs após a adição de um cliente
    function limpaInputs() {
        inputNome.value = '';
        inputCarro.value = '';
        inputPlaca.value = '';
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

    // Função para criar uma nova tarefa (cliente) e adicioná-la à tabela
    function criaTarefa(nome, carro, placa, observacao) {
        const tr = criaTr();
        tr.innerHTML = `
            <td>${nome}</td>
            <td>${carro}</td>
            <td>${placa}</td>
            <td>${observacao}</td>
            <td></td>
        `;
        const tdAcao = tr.querySelector('td:last-child');
        criaBotaoApagar(tdAcao);
        tarefas.appendChild(tr);
        limpaInputs();
        salvarTarefa();
    }

    // Evento de clique no botão de adicionar cliente
    btnTarefa.addEventListener('click', function() {
        if (!inputNome.value || !inputCarro.value || !inputPlaca.value || !inputObservacao.value) return;
        criaTarefa(inputNome.value, inputCarro.value, inputPlaca.value, inputObservacao.value);
    });

    // Evento de clique para apagar uma linha da tabela
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains('apagar')) {
            e.target.closest('tr').remove();
            salvarTarefa();
        }
    });

    // Função para salvar os dados no localStorage
    function salvarTarefa() {
        const trTarefas = tarefas.querySelectorAll('tr');
        const listaDeTarefas = [];

        for (let tr of trTarefas) {
            const tdValores = tr.querySelectorAll('td');
            const tarefaTexto = {
                nome: tdValores[0].innerText,
                carro: tdValores[1].innerText,
                placa: tdValores[2].innerText,
                observacao: tdValores[3].innerText
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

            for (let tarefa of listaDeTarefas) {
                criaTarefa(tarefa.nome, tarefa.carro, tarefa.placa, tarefa.observacao);
            }
        }
    }

    // Chama a função para adicionar as tarefas salvas ao carregar a página
    adicionaTarefasSalvas();
});
