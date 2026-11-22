package com.example.apiscale_back_end.service;

import java.util.List;
import java.util.stream.Collectors;
import com.example.apiscale_back_end.dto.ComentarioRequest;
import com.example.apiscale_back_end.dto.ComentarioResponse;
import com.example.apiscale_back_end.model.Comentario;
import com.example.apiscale_back_end.model.Funcionario;
import com.example.apiscale_back_end.model.Tarefa;
import com.example.apiscale_back_end.repository.ComentarioRepository;
import com.example.apiscale_back_end.repository.FuncionarioRepository;
import com.example.apiscale_back_end.repository.TarefaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Aplica as regras para listar e criar comentários vinculados a tarefas existentes.
@Service
public class ComentarioService {
    private final ComentarioRepository comentarioRepository;
    private final TarefaRepository tarefaRepository;
    private final FuncionarioRepository funcionarioRepository;

    public ComentarioService(
            ComentarioRepository comentarioRepository,
            TarefaRepository tarefaRepository,
            FuncionarioRepository funcionarioRepository) {
        this.comentarioRepository = comentarioRepository;
        this.tarefaRepository = tarefaRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    @Transactional(readOnly = true)
    public List<ComentarioResponse> listarPorTarefa(Integer tarefaId) {
        if (!tarefaRepository.existsById(tarefaId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada");
        }
        return comentarioRepository.findByTarefa_IdOrderByDataCriacaoAsc(tarefaId)
                .stream().map(ComentarioResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public ComentarioResponse criar(Integer tarefaId, ComentarioRequest dados) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        if (dados.getConteudo() == null || dados.getConteudo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O comentário não pode ficar vazio");
        }

        Comentario comentario = new Comentario();
        comentario.setConteudo(dados.getConteudo().trim());
        comentario.setTarefa(tarefa);
        if (dados.getAutorId() != null) {
            Funcionario autor = funcionarioRepository.findById(dados.getAutorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Autor não encontrado"));
            comentario.setAutor(autor);
        }
        return new ComentarioResponse(comentarioRepository.save(comentario));
    }
}
