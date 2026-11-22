package com.example.apiscale_back_end.controller;

// DTO com os campos aceitos no JSON de criação e atualização.
import com.example.apiscale_back_end.dto.TarefaRequest;
// Entidade retornada nos endpoints de consulta e gravação.
import com.example.apiscale_back_end.model.Tarefa;
// Importa a camada que executa as operações do CRUD.
import com.example.apiscale_back_end.service.TarefaService;
// ResponseEntity permite definir o corpo e o status HTTP da resposta.
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Importa as anotações usadas para configurar endpoints REST.
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Indica que esta classe recebe requisições HTTP e devolve dados, normalmente em JSON.
@RestController
// Permite que o frontend local do Vite chame a API durante o desenvolvimento.
@CrossOrigin(origins = "*")
// Define o prefixo compartilhado por todos os endpoints desta classe.
@RequestMapping("/api/tarefas")
public class TarefaController {

    // O controller delega as operações para o service.
    private final TarefaService tarefaService;

    // O Spring fornece o service ao criar o controller (injeção por construtor).
    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    // GET /api/tarefas: retorna a lista de tarefas.
    @GetMapping
    public ResponseEntity<Iterable<Tarefa>> listarTodas() {
        return ResponseEntity.ok(tarefaService.listarTodas());
    }

    // GET /api/tarefas/{id}: retorna uma tarefa ou 404 quando o ID não existe.
    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Integer id) {
        return tarefaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/tarefas: recebe os dados e IDs relacionados no JSON e cria o registro.
    @PostMapping
    public ResponseEntity<Tarefa> criar(@RequestBody TarefaRequest dados) {
        Tarefa tarefaSalva = tarefaService.criar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaSalva);
    }

    // PUT /api/tarefas/{id}: substitui os dados enviados da tarefa identificada na URL.
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(
            @PathVariable Integer id,
            @RequestBody TarefaRequest dados) {
        return tarefaService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /api/tarefas/{id}: exclui a tarefa ou retorna 404 se ela não existir.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (tarefaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        tarefaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
