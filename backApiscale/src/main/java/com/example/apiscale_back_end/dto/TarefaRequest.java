package com.example.apiscale_back_end.dto;

import java.time.LocalDateTime;

// DTO (Data Transfer Object) define os campos aceitos no JSON de criação e atualização.
// Recebemos os IDs das relações em vez de objetos Funcionario/Equipe inteiros.
public class TarefaRequest {
    // Dados simples da tarefa.
    private String titulo;
    private String descricao;
    private String status;
    private String prioridade;
    private LocalDateTime dataPrazo;
    private LocalDateTime dataConclusao;

    // ID do funcionário que criou a tarefa; pode ficar vazio durante os testes sem login.
    private Integer criadorId;
    // ID do funcionário encarregado; pode ser nulo.
    private Integer encarregadoId;
    // ID da equipe; pode ser nulo.
    private Integer idEquipe;

    // Getters e setters permitem ao Spring converter o JSON para este objeto.
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPrioridade() { return prioridade; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    public LocalDateTime getDataPrazo() { return dataPrazo; }
    public void setDataPrazo(LocalDateTime dataPrazo) { this.dataPrazo = dataPrazo; }
    public LocalDateTime getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDateTime dataConclusao) { this.dataConclusao = dataConclusao; }
    public Integer getCriadorId() { return criadorId; }
    public void setCriadorId(Integer criadorId) { this.criadorId = criadorId; }
    public Integer getEncarregadoId() { return encarregadoId; }
    public void setEncarregadoId(Integer encarregadoId) { this.encarregadoId = encarregadoId; }
    public Integer getIdEquipe() { return idEquipe; }
    public void setIdEquipe(Integer idEquipe) { this.idEquipe = idEquipe; }
}
