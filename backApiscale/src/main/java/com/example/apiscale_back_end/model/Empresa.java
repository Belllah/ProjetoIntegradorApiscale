package com.example.apiscale_back_end.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    // A senha pode entrar no JSON, mas não é incluída nas respostas da API.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    // Mapeia a senha obrigatória conforme a definição atual da tabela empresas.
    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    @Column(name = "endereco", columnDefinition = "TEXT")
    private String endereco;

    public Empresa(){
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public String getSenha() { return senha; }

    public void setSenha(String senha) { this.senha = senha; }
    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
