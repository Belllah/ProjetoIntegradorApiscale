package com.example.apiscale_back_end.controller;

import java.util.List;
import com.example.apiscale_back_end.dto.ComentarioRequest;
import com.example.apiscale_back_end.dto.ComentarioResponse;
import com.example.apiscale_back_end.service.ComentarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Disponibiliza comentários dentro do recurso da tarefa, que precisa existir previamente.
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tarefas/{tarefaId}/comentarios")
public class ComentarioController {
    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @GetMapping
    public ResponseEntity<List<ComentarioResponse>> listar(@PathVariable Integer tarefaId) {
        return ResponseEntity.ok(comentarioService.listarPorTarefa(tarefaId));
    }

    @PostMapping
    public ResponseEntity<ComentarioResponse> criar(
            @PathVariable Integer tarefaId,
            @RequestBody ComentarioRequest dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comentarioService.criar(tarefaId, dados));
    }
}
