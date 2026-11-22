package com.example.apiscale_back_end.service;

// DTO recebido pela API com os dados da tarefa e os IDs das relações.
import com.example.apiscale_back_end.dto.TarefaRequest;
// Entidades relacionadas que serão associadas à tarefa.
import com.example.apiscale_back_end.model.Equipe;
import com.example.apiscale_back_end.model.Funcionario;
import com.example.apiscale_back_end.model.Tarefa;
// Repositories usados para localizar os registros relacionados.
import com.example.apiscale_back_end.repository.EquipeRepository;
import com.example.apiscale_back_end.repository.FuncionarioRepository;
import com.example.apiscale_back_end.repository.TarefaRepository;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;

// Camada que organiza as operações e regras relacionadas às tarefas.
@Service
public class TarefaService {

    // Repositories necessários para acessar tarefas e localizar entidades
    // relacionadas.
    private final TarefaRepository tarefaRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final EquipeRepository equipeRepository;

    // O Spring fornece as dependências ao criar o service (injeção por construtor).
    public TarefaService(
            TarefaRepository tarefaRepository,
            FuncionarioRepository funcionarioRepository,
            EquipeRepository equipeRepository) {
        this.tarefaRepository = tarefaRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.equipeRepository = equipeRepository;
    }

    // Busca todas as tarefas cadastradas.
    public Iterable<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    // Procura uma tarefa pelo ID; Optional representa que ela pode não existir.
    public Optional<Tarefa> buscarPorId(Integer id) {
        return tarefaRepository.findById(id);
    }

    // Cria uma tarefa e associa funcionários e equipe existentes a partir de seus
    // IDs.
    public Tarefa criar(TarefaRequest dados) {
        Tarefa tarefa = new Tarefa();
        aplicarDados(tarefa, dados);
        atualizarDataConclusao(tarefa);
        return tarefaRepository.save(tarefa);
    }

    // Atualiza uma tarefa; Optional vazio indica que o ID da tarefa não foi
    // encontrado.
    public Optional<Tarefa> atualizar(Integer id, TarefaRequest dados) {
        return tarefaRepository.findById(id).map(tarefa -> {
            aplicarDados(tarefa, dados);
            atualizarDataConclusao(tarefa);

            return tarefaRepository.save(tarefa);
        });
    }

    // Copia os dados recebidos e resolve cada chave estrangeira consultando o
    // respectivo repository.
    private void aplicarDados(Tarefa tarefa, TarefaRequest dados) {
        tarefa.setTitulo(dados.getTitulo());
        tarefa.setDescricao(dados.getDescricao());

        // Se status ou prioridade não vierem no JSON, preserva os padrões da entidade.
        if (dados.getStatus() != null)
            tarefa.setStatus(dados.getStatus());
        if (dados.getPrioridade() != null)
            tarefa.setPrioridade(dados.getPrioridade());

        tarefa.setDataPrazo(dados.getDataPrazo());

        // O criador é opcional durante os testes, enquanto o login não está pronto.
        if (dados.getCriadorId() == null) {
            tarefa.setCriador(null);
        } else {
            Funcionario criador = funcionarioRepository.findById(dados.getCriadorId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Criador não encontrado"));
            tarefa.setCriador(criador);
        }

        // A associação do encarregado é opcional; ID nulo remove a associação.
        if (dados.getEncarregadoId() == null) {
            tarefa.setEncarregado(null);
        } else {
            Funcionario encarregado = funcionarioRepository.findById(dados.getEncarregadoId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Funcionário encarregado não encontrado"));
            tarefa.setEncarregado(encarregado);
        }

        // A equipe também é opcional; se houver ID, ele precisa existir.
        if (dados.getIdEquipe() == null) {
            tarefa.setEquipe(null);
        } else {
            Equipe equipe = equipeRepository.findById(dados.getIdEquipe())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Equipe não encontrada"));
            tarefa.setEquipe(equipe);
        }
    }

    // Controla automaticamente a data de conclusão conforme o status.
    private void atualizarDataConclusao(Tarefa tarefa) {

        if ("Concluida".equals(tarefa.getStatus())) {

            // Registra a data somente se ainda não existir.
            if (tarefa.getDataConclusao() == null) {
                tarefa.setDataConclusao(LocalDateTime.now());
            }

        } else {

            // Se a tarefa deixar de estar concluída, remove a data.
            tarefa.setDataConclusao(null);
        }
    }

    // Exclui do banco a tarefa que tenha o ID informado.
    public void excluir(Integer id) {
        tarefaRepository.deleteById(id);
    }
}
