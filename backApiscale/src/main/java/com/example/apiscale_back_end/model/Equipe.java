package com.example.apiscale_back_end.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Representa uma linha da tabela equipes no banco.
@Entity
@Table(name = "equipes")
public class Equipe {
    // O ID da equipe é a chave primária.
    @Id
    // O banco gera o valor usando AUTO_INCREMENT.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipe")
    private Integer id;

    // Nome da equipe, obrigatório e limitado a 20 caracteres conforme a tabela.
    @Column(name = "nome_equipe", nullable = false, length = 20)
    private String nomeEquipe;

    // Empresa é opcional; a relação usa a coluna cnpj_empresa da tabela equipes.
    @ManyToOne
    @JoinColumn(name = "cnpj_empresa", referencedColumnName = "cnpj")
    private Empresa empresa;

    @ManyToMany 
    @JoinTable(
        name = "equipes_funcionarios", 
        joinColumns = @JoinColumn(name = "id_equipe"), 
        inverseJoinColumns = @JoinColumn(name = "id_funcionario")
    )
    private java.util.List<Funcionario> funcionarios = new java.util.ArrayList<>();

    // Construtor vazio exigido pelo JPA.
    public Equipe() {
    }

    // Retorna o identificador da equipe.
    public Integer getId() { return id; }
    // Define o identificador da equipe.
    public void setId(Integer id) { this.id = id; }
    // Retorna o nome da equipe.
    public String getNomeEquipe() { return nomeEquipe; }
    // Define o nome da equipe.
    public void setNomeEquipe(String nomeEquipe) { this.nomeEquipe = nomeEquipe; }
    // Retorna a empresa associada à equipe, se houver.
    public Empresa getEmpresa() { return empresa; }
    // Define a empresa associada à equipe.
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public java.util.List<Funcionario> getFuncionarios() {
        return funcionarios;
    }
    public void setFuncionarios(java.util.List<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }
}
