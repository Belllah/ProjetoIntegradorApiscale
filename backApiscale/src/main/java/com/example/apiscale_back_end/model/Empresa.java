package com.example.apiscale_back_end.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Entity
@Table(name = "empresas")
public class Empresa {
    @Id
    @Column(name = "cnpj", length = 18)
    private String cnpj;

    @Column(name = "nome", length = 100)
    private String nome;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "endereco")
    private String endereco;

    @Column(nullable = false, length = 255)
    private String senha;
}
