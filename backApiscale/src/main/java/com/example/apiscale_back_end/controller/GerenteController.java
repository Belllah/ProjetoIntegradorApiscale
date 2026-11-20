package com.example.apiscale_back_end.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.apiscale_back_end.model.Gerente;
import com.example.apiscale_back_end.service.GerenteService;

@RestController
@RequestMapping("/api/gerentes")
@CrossOrigin(origins = "*")
public class GerenteController {
    @Autowired 
    private GerenteService gerenteService;

    @GetMapping 
    public List<Gerente> listarTodas(){
        return gerenteService.listarTodos();
    }

    @PostMapping 
    public Gerente criar(@RequestBody Gerente gerente) {
        return gerenteService.salvar(gerente);
    }

    @PutMapping("/{cpf}")
    public Gerente atualizar(@PathVariable String cpf, @RequestBody Gerente gerente){
        return gerenteService.atualizar(cpf, gerente);
    }

    @DeleteMapping("/{cpf}")
    public void deletar(@PathVariable String cpf) {
        gerenteService.deletar(cpf);
    }

    @GetMapping("/{cpf}")
    public Gerente buscar(@PathVariable String cpf){
        return gerenteService.buscarPorCpf(cpf);
    }
}
