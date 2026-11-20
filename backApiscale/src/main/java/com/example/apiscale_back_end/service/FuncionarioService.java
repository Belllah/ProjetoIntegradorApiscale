package com.example.apiscale_back_end.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apiscale_back_end.model.Empresa;
import com.example.apiscale_back_end.model.Funcionario;
import com.example.apiscale_back_end.repository.EmpresaRepository;
import com.example.apiscale_back_end.repository.FuncionarioRepository;

@Service 
public class FuncionarioService {
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired 
    private EmpresaRepository empresaRepository;
    
    public Funcionario salvar(Funcionario funcionario) {
        if (funcionarioRepository.existsById(funcionario.getCpf())) {
            throw new RuntimeException("Já existe um funcionário cadastrado com esse CPF");
        }

        if (funcionario.getEmpresa() != null && funcionario.getEmpresa().getCnpj() != null) {
            Empresa empresa = empresaRepository.findById(funcionario.getEmpresa().getCnpj()).orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
            funcionario.setEmpresa(empresa);
        }
        return funcionarioRepository.save(funcionario);
    }

    public List<Funcionario> listarTodos(){
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorCpf(String cpf) {
        return funcionarioRepository.findById(cpf).orElseThrow(() -> new RuntimeException("Funcionário não encontrado com este CPF"));
    }

    public Funcionario atualizar(String cpf, Funcionario dadosAtualizados) {
        Funcionario funcionarioExistente = buscarPorCpf(cpf);

        funcionarioExistente.setNome(dadosAtualizados.getNome());
        funcionarioExistente.setEmail(dadosAtualizados.getEmail());
        funcionarioExistente.setTelefone(dadosAtualizados.getTelefone());
        funcionarioExistente.setDataNascimento(dadosAtualizados.getDataNascimento());
        funcionarioExistente.setSenha(dadosAtualizados.getSenha());

        return funcionarioRepository.save(funcionarioExistente);
    }

    public void deletar(String cpf) {
        Funcionario funcionario = buscarPorCpf(cpf);
        funcionarioRepository.delete(funcionario);
    }
}
