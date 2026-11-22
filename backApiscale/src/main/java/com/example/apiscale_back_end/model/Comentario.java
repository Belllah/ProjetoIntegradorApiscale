package com.example.apiscale_back_end.model;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

// Representa um comentário associado a uma tarefa já salva.
@Entity
@Table(name = "comentarios")
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    private Integer id;

    @Column(name = "conteudo", nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarefa", nullable = false)
    private Tarefa tarefa;

    // Autor fica opcional enquanto o sistema não tiver login conectado.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_autor", referencedColumnName = "id_funcionario", nullable = true)
    private Funcionario autor;

    @PrePersist
    protected void aoCriar() {
        if (dataCriacao == null) dataCriacao = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    public Tarefa getTarefa() { return tarefa; }
    public void setTarefa(Tarefa tarefa) { this.tarefa = tarefa; }
    public Funcionario getAutor() { return autor; }
    public void setAutor(Funcionario autor) { this.autor = autor; }
}
