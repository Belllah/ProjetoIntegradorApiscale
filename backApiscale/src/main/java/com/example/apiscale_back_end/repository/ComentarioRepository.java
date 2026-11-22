package com.example.apiscale_back_end.repository;

import java.util.List;
import com.example.apiscale_back_end.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

// Oferece as consultas básicas e a listagem cronológica dos comentários da tarefa.
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByTarefa_IdOrderByDataCriacaoAsc(Integer tarefaId);
}
