package com.yestion.controller;

import com.yestion.dto.TodoDto;
import com.yestion.entity.User;
import com.yestion.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    // GET /api/todos?date=2025-06-08
    @GetMapping
    public ResponseEntity<List<TodoDto.Response>> getTodos(
            @RequestParam(required = false) String date,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(todoService.getTodos(user, date));
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<TodoDto.Response> createTodo(
            @Valid @RequestBody TodoDto.CreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(todoService.createTodo(user, request));
    }

    // PATCH /api/todos/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<TodoDto.Response> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(todoService.updateTodo(id, request));
    }

    // DELETE /api/todos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok("삭제되었습니다.");
    }
}
