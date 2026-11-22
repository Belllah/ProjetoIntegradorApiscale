package com.example.apiscale_back_end.dto;

// Dados enviados para criar um comentário; autorId é opcional durante os testes.
public class ComentarioRequest {
    private String conteudo;
    private Integer autorId;

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public Integer getAutorId() { return autorId; }
    public void setAutorId(Integer autorId) { this.autorId = autorId; }
}
