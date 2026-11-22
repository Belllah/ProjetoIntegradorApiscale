package com.example.apiscale_back_end.repository;

// Importa a entidade que este repository vai consultar e persistir.
import com.example.apiscale_back_end.model.Tarefa;
// Importa a interface do Spring Data JPA com operações prontas de banco de dados.
import org.springframework.data.jpa.repository.JpaRepository;

// Interface de acesso aos dados da entidade Tarefa.
// JpaRepository<Tarefa, Integer> indica a entidade usada e o tipo do seu identificador.
// O Spring cria a implementação desta interface automaticamente durante a inicialização.
public interface TarefaRepository extends JpaRepository<Tarefa, Integer> {
    // Ao estender JpaRepository, esta interface já recebe operações como:
    // save, findAll, findById, deleteById e count.
}
