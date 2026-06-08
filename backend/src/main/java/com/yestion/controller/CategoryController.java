package com.yestion.controller;

import com.yestion.dto.CategoryDto;
import com.yestion.entity.User;
import com.yestion.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories
    @GetMapping
    public ResponseEntity<List<CategoryDto.Response>> getCategories(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(categoryService.getCategories(user));
    }

    // POST /api/categories
    @PostMapping
    public ResponseEntity<CategoryDto.Response> createCategory(
            @Valid @RequestBody CategoryDto.CreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(categoryService.createCategory(user, request));
    }

    // PATCH /api/categories/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<CategoryDto.Response> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    // DELETE /api/categories/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("삭제되었습니다.");
    }
}
