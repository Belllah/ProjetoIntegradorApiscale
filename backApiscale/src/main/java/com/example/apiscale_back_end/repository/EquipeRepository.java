package com.example.apiscale_back_end.repository;

import com.example.apiscale_back_end.model.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;

// Dá acesso às equipes; Integer é o tipo da chave primária id_equipe.
public interface EquipeRepository extends JpaRepository<Equipe, Integer> {
}
