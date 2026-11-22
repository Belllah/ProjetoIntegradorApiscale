package com.example.apiscale_back_end.dto;

import java.time.LocalDateTime;
import com.example.apiscale_back_end.model.Comentario;

// Resposta simples para não serializar a tarefa inteira junto com cada comentário.
public class ComentarioResponse {
    private final Integer id;
    private final String conteudo;
    private final LocalDateTime dataCriacao;
    private final String autorNome;

    public ComentarioResponse(Comentario comentario) {
        this.id = comentario.getId();
        this.conteudo = comentario.getConteudo();
        this.dataCriacao = comentario.getDataCriacao();
        this.autorNome = comentario.getAutor() == null ? null : comentario.getAutor().getNome();
    }

    public Integer getId() { return id; }
    public String getConteudo() { return conteudo; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public String getAutorNome() { return autorNome; }
}
