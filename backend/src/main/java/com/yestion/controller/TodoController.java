package com.yestion.controller;

import com.yestion.dto.TodoDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// TODO: TodoService, 인증 구현 후 주입

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    // TODO: private final TodoService todoService;

    // ── GET /api/todos?date=2025-06-08 ───────
    @GetMapping
    public ResponseEntity<List<?>> getTodos(
            @RequestParam(required = false) String date
            // TODO: @AuthenticationPrincipal UserDetails userDetails
    ) {
        // TODO: return ResponseEntity.ok(todoService.getTodos(userId, date));
        return ResponseEntity.ok(List.of());
    }

    // ── POST /api/todos ───────────────────────
    @PostMapping
    public ResponseEntity<?> createTodo(@Valid @RequestBody TodoDto.CreateRequest request) {
        // TODO: return ResponseEntity.ok(todoService.createTodo(userId, request));
        return ResponseEntity.ok("createTodo 구현 예정");
    }

    // ── PATCH /api/todos/{id} ─────────────────
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDto.UpdateRequest request
    ) {
        // TODO: return ResponseEntity.ok(todoService.updateTodo(id, request));
        return ResponseEntity.ok("updateTodo 구현 예정");
    }

    // ── DELETE /api/todos/{id} ────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        // TODO: todoService.deleteTodo(id);
        return ResponseEntity.ok("deleteTodo 구현 예정");
    }
}
