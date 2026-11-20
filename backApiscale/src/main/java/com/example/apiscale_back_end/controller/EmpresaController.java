package com.example.apiscale_back_end.controller;

import com.example.apiscale_back_end.model.Empresa;
import com.example.apiscale_back_end.service.EmpresaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;



@RestController 
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {
    
    @Autowired 
    private EmpresaService empresaService;

    @GetMapping 
    public List<Empresa> listarTodas(){
        return empresaService.listarTodas();
    }

    @PostMapping 
    public Empresa criar(@RequestBody Empresa empresa) {
        return empresaService.salvar(empresa);
    }

    @PutMapping("/{cnpj}")
    public Empresa atualizar(@PathVariable String cnpj, @RequestBody Empresa empresa){
        return empresaService.atualizar(cnpj, empresa);
    }

    @DeleteMapping("/{cnpj}")
    public void deletar(@PathVariable String cnpj) {
        empresaService.deletar(cnpj);
    }

    @GetMapping("/{cnpj}")
    public Empresa buscar(@PathVariable String cnpj){
        return empresaService.buscarPorCnpj(cnpj);
    }
}
