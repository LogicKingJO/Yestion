package com.yestion.service;

import com.yestion.dto.CategoryDto;
import com.yestion.entity.Category;
import com.yestion.entity.User;
import com.yestion.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 카테고리 목록 조회
    public List<CategoryDto.Response> getCategories(User user) {
        return categoryRepository.findByUserId(user.getId())
                .stream()
                .map(CategoryDto.Response::new)
                .collect(Collectors.toList());
    }

    // 카테고리 생성
    public CategoryDto.Response createCategory(User user, CategoryDto.CreateRequest request) {
        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .color(request.getColor())
                .build();

        return new CategoryDto.Response(categoryRepository.save(category));
    }

    // 카테고리 수정
    @Transactional
    public CategoryDto.Response updateCategory(Long categoryId, CategoryDto.UpdateRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        if (request.getName()  != null) category.setName(request.getName());
        if (request.getColor() != null) category.setColor(request.getColor());

        return new CategoryDto.Response(category);
    }

    // 카테고리 삭제
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        categoryRepository.delete(category);
    }
}
