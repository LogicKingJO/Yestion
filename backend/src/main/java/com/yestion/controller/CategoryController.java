package com.yestion.controller;

import com.yestion.dto.CategoryDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // TODO: private final CategoryService categoryService;

    // ── GET /api/categories ───────────────────
    @GetMapping
    public ResponseEntity<List<?>> getCategories() {
        // TODO: return ResponseEntity.ok(categoryService.getCategories(userId));
        return ResponseEntity.ok(List.of());
    }

    // ── POST /api/categories ──────────────────
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDto.CreateRequest request) {
        // TODO: return ResponseEntity.ok(categoryService.createCategory(userId, request));
        return ResponseEntity.ok("createCategory 구현 예정");
    }

    // ── PATCH /api/categories/{id} ────────────
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDto.UpdateRequest request
    ) {
        // TODO: return ResponseEntity.ok(categoryService.updateCategory(id, request));
        return ResponseEntity.ok("updateCategory 구현 예정");
    }

    // ── DELETE /api/categories/{id} ───────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        // TODO: categoryService.deleteCategory(id);
        return ResponseEntity.ok("deleteCategory 구현 예정");
    }
}
