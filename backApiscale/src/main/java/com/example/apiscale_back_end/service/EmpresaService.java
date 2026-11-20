package com.example.apiscale_back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apiscale_back_end.model.Empresa;
import com.example.apiscale_back_end.repository.EmpresaRepository;

@Service 
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;
    
    public Empresa salvar(Empresa empresa) {
        if (empresaRepository.existsById(empresa.getCnpj())) {
            throw new RuntimeException("Já existe uma empresa cadastrada com este CNPJ");
        }
        return empresaRepository.save(empresa);
    }

    public List<Empresa> listarTodas(){
        return empresaRepository.findAll();
    }

    public Empresa buscarPorCnpj(String cnpj) {
        return empresaRepository.findById(cnpj).orElseThrow(() -> new RuntimeException("Empresa não encontrada com CNPJ"));
    }

    public Empresa atualizar(String cnpj, Empresa dadosAtualizados) {
        Empresa empresaExistente = buscarPorCnpj(cnpj);

        empresaExistente.setNome(dadosAtualizados.getNome());
        empresaExistente.setEmail(dadosAtualizados.getEmail());
        empresaExistente.setTelefone(dadosAtualizados.getTelefone());
        empresaExistente.setEndereco(dadosAtualizados.getEndereco());
        empresaExistente.setSenha(dadosAtualizados.getSenha());

        return empresaRepository.save(empresaExistente);
    }

    public void deletar(String cnpj) {
        Empresa empresa = buscarPorCnpj(cnpj);
        empresaRepository.delete(empresa);
    }
}
