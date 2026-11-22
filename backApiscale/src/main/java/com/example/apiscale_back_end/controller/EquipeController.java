package com.example.apiscale_back_end.controller;

import com.example.apiscale_back_end.model.Equipe;
import com.example.apiscale_back_end.repository.EquipeRepository;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Expõe operações HTTP para consultar equipes disponíveis na tela de tarefas.
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/equipes")
public class EquipeController {
    private final EquipeRepository equipeRepository;

    // O Spring fornece o repository que consulta a tabela equipes.
    public EquipeController(EquipeRepository equipeRepository) {
        this.equipeRepository = equipeRepository;
    }

    // GET /api/equipes retorna as equipes que podem ser associadas a uma tarefa.
    @GetMapping
    public List<Equipe> listarTodas() {
        return equipeRepository.findAll();
    }
}
