package com.example.apiscale_back_end.model;

// Importa os tipos de data e hora usados pelas colunas DATETIME do MySQL.
import java.time.LocalDateTime;
// Importa as anotações JPA usadas para mapear a classe e seus relacionamentos.
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Informa ao JPA que esta classe representa dados persistidos no banco.
@Entity
// Associa a classe à tabela tarefas.
@Table(name = "tarefas")
public class Tarefa {
    // Marca o identificador como chave primária.
    @Id
    // Deixa o MySQL gerar o ID usando AUTO_INCREMENT.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Associa o atributo à coluna id_tarefa.
    @Column(name = "id_tarefa")
    private Integer id;

    // Mapeia o título obrigatório, limitado a 50 caracteres.
    @Column(name = "titulo", nullable = false, length = 50)
    private String titulo;

    // Mapeia a descrição, armazenada como TEXT no banco.
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    // Usa String para corresponder literalmente aos valores do ENUM do MySQL,
    // que incluem espaços, como "Em andamento".
    @Column(name = "status", nullable = false,
            columnDefinition = "ENUM('Pendente', 'Em andamento', 'Concluida', 'Cancelada')")
    private String status = "Pendente";

    // Usa String para corresponder aos valores Media, Alta, Baixa e Urgente do banco.
    @Column(name = "prioridade", nullable = false,
            columnDefinition = "ENUM('Baixa', 'Media', 'Alta', 'Urgente')")
    private String prioridade = "Media";

    // Data e hora em que a tarefa foi criada.
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    // Prazo é opcional, por isso a coluna aceita valor nulo.
    @Column(name = "data_prazo")
    private LocalDateTime dataPrazo;

    // Data de conclusão também é opcional.
    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    // Funcionário que registrou a tarefa.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criador", referencedColumnName = "id_funcionario", nullable = true)
    private Funcionario criador;

    // Relaciona a tarefa ao funcionário encarregado pela chave interna id_funcionario.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encarregado", referencedColumnName = "id_funcionario")
    private Funcionario encarregado;

    // Relaciona a tarefa à equipe; a chave estrangeira fica na coluna id_equipe.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipe", referencedColumnName = "id_equipe")
    private Equipe equipe;

    // Construtor vazio exigido pelo JPA.
    public Tarefa() {
        // Define a data inicial quando a aplicação cria uma tarefa.
        this.dataCriacao = LocalDateTime.now();
    }

    // Retorna o ID da tarefa.
    public Integer getId() { return id; }
    // Define o ID; normalmente ele é gerado pelo banco.
    public void setId(Integer id) { this.id = id; }
    // Retorna o título.
    public String getTitulo() { return titulo; }
    // Define o título.
    public void setTitulo(String titulo) { this.titulo = titulo; }
    // Retorna a descrição.
    public String getDescricao() { return descricao; }
    // Define a descrição.
    public void setDescricao(String descricao) { this.descricao = descricao; }
    // Retorna o status atual.
    public String getStatus() { return status; }
    // Define o status; o texto precisa corresponder a um valor permitido pelo ENUM do banco.
    public void setStatus(String status) { this.status = status; }
    // Retorna a prioridade.
    public String getPrioridade() { return prioridade; }
    // Define a prioridade; o texto precisa corresponder a um valor permitido pelo ENUM do banco.
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    // Retorna a data de criação.
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    // Define a data de criação.
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    // Retorna o prazo.
    public LocalDateTime getDataPrazo() { return dataPrazo; }
    // Define o prazo.
    public void setDataPrazo(LocalDateTime dataPrazo) { this.dataPrazo = dataPrazo; }
    // Retorna a data de conclusão.
    public LocalDateTime getDataConclusao() { return dataConclusao; }
    // Define a data de conclusão.
    public void setDataConclusao(LocalDateTime dataConclusao) { this.dataConclusao = dataConclusao; }
    // Retorna o funcionário que criou a tarefa.
    public Funcionario getCriador() { return criador; }
    // Define o funcionário que criou a tarefa.
    public void setCriador(Funcionario criador) { this.criador = criador; }
    // Retorna o funcionário encarregado, se houver.
    public Funcionario getEncarregado() { return encarregado; }
    // Define o funcionário encarregado.
    public void setEncarregado(Funcionario encarregado) { this.encarregado = encarregado; }
    // Retorna a equipe associada à tarefa, se houver.
    public Equipe getEquipe() { return equipe; }
    // Define a equipe associada à tarefa.
    public void setEquipe(Equipe equipe) { this.equipe = equipe; }
}
