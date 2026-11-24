package com.example.apiscale_back_end.controller;

import com.example.apiscale_back_end.model.Equipe;
import com.example.apiscale_back_end.repository.EquipeRepository;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping 
    public Equipe criar(@RequestBody Equipe equipe) {
        return equipeRepository.save(equipe);
    }

    @PutMapping ("/{id}")
    public Equipe atualizar(@PathVariable Integer id, @RequestBody Equipe equipeAtualizada) {
        equipeAtualizada.setId(id);
        return equipeRepository.save(equipeAtualizada);
    }

    @DeleteMapping ("/{id}")
    public void deletar(@PathVariable Integer id) {
        equipeRepository.deleteById(id);
    }

}
