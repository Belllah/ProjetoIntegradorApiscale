package com.example.apiscale_back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.example.apiscale_back_end.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer>{
    // O CPF não é mais o ID, então o Spring cria esta busca pelo atributo cpf.
    Optional<Funcionario> findByCpf(String cpf);

    // Verifica duplicidade de CPF sem depender da chave primária.
    boolean existsByCpf(String cpf);
}
