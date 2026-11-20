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

import com.example.apiscale_back_end.model.Funcionario;
import com.example.apiscale_back_end.service.FuncionarioService;


@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {
    @Autowired 
    private FuncionarioService funcionarioService;

    @GetMapping 
    public List<Funcionario> listarTodas(){
        return funcionarioService.listarTodos();
    }

    @PostMapping 
    public Funcionario criar(@RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(funcionario);
    }

    @PutMapping("/{cpf}")
    public Funcionario atualizar(@PathVariable String cpf, @RequestBody Funcionario funcionario){
        return funcionarioService.atualizar(cpf, funcionario);
    }

    @DeleteMapping("/{cpf}")
    public void deletar(@PathVariable String cpf) {
        funcionarioService.deletar(cpf);
    }

    @GetMapping("/{cpf}")
    public Funcionario buscar(@PathVariable String cpf){
        return funcionarioService.buscarPorCpf(cpf);
    }
}
