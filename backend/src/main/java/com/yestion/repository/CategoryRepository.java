package com.yestion.repository;

import com.yestion.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // 특정 유저의 카테고리 전체 조회
    // → SELECT * FROM categories WHERE user_id = ?
    List<Category> findByUserId(Long userId);
}
