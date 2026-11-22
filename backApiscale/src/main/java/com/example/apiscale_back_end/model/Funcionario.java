package com.example.apiscale_back_end.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "funcionarios")
public class Funcionario {
    // Chave primária interna gerada pelo banco.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionario")
    private Integer id;

    // CPF continua armazenado como texto, separado da chave primária numérica.
    @Column(name = "cpf", length = 15)
    private String cpf;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "nome", length = 30)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    // Cargo distingue funcionário comum, gerente e dono sem criar outra entidade para gerente.
    @Column(name = "cargo", nullable = false,
            columnDefinition = "ENUM('Funcionario', 'Gerente', 'Dono')")
    private String cargo = "Funcionario";

    // A senha pode entrar no JSON, mas não é incluída nas respostas da API.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    // Mapeia a coluna obrigatória senha.
    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    @ManyToOne
    @JoinColumn(name = "cnpj_empresa", referencedColumnName = "cnpj")
    private Empresa empresa;

    public Funcionario(){
    }

    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getCargo() { return cargo; }

    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getSenha() { return senha; }

    public void setSenha(String senha) { this.senha = senha; }
    
    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa){
        this.empresa = empresa;
    }
}
