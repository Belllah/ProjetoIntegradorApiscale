package com.example.apiscale_back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apiscale_back_end.model.Empresa;
import com.example.apiscale_back_end.model.Gerente;
import com.example.apiscale_back_end.repository.EmpresaRepository;
import com.example.apiscale_back_end.repository.GerenteRepository;



@Service 
public class GerenteService {

    @Autowired
    private GerenteRepository gerenteRepository;

    @Autowired 
    private EmpresaRepository empresaRepository;
    
    public Gerente salvar(Gerente gerente) {
        if (gerenteRepository.existsById(gerente.getCpf())) {
            throw new RuntimeException("Já existe um gerente cadastrado com esse CPF");
        }

        if (gerente.getEmpresa() != null && gerente.getEmpresa().getCnpj() != null) {
            Empresa empresa = empresaRepository.findById(gerente.getEmpresa().getCnpj()).orElseThrow(() -> new RuntimeException("Empresa não encontrada!"));
            gerente.setEmpresa(empresa);
        }
        return gerenteRepository.save(gerente);
    }

    public List<Gerente> listarTodos(){
        return gerenteRepository.findAll();
    }

    public Gerente buscarPorCpf(String cpf) {
        return gerenteRepository.findById(cpf).orElseThrow(() -> new RuntimeException("Gerente não encontrado com este CPF"));
    }

    public Gerente atualizar(String cpf, Gerente dadosAtualizados) {
        Gerente gerenteExistente = buscarPorCpf(cpf);

        gerenteExistente.setNome(dadosAtualizados.getNome());
        gerenteExistente.setEmail(dadosAtualizados.getEmail());
        gerenteExistente.setTelefone(dadosAtualizados.getTelefone());
        gerenteExistente.setDataNascimento(dadosAtualizados.getDataNascimento());
        gerenteExistente.setSenha(dadosAtualizados.getSenha());

        return gerenteRepository.save(gerenteExistente);
    }

    public void deletar(String cpf) {
        Gerente gerente = buscarPorCpf(cpf);
        gerenteRepository.delete(gerente);
    }
}

