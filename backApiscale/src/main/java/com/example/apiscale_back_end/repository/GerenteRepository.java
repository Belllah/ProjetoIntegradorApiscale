package com.example.apiscale_back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.apiscale_back_end.model.Gerente;

public interface GerenteRepository extends JpaRepository<Gerente, String>{
    
}
