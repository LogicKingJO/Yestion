package com.yestion.repository;

import com.yestion.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // 특정 유저의 전체 할 일 조회
    List<Todo> findByUserId(Long userId);

    // 특정 유저의 특정 날짜 할 일 조회
    // → SELECT * FROM todos WHERE user_id = ? AND date = ?
    List<Todo> findByUserIdAndDate(Long userId, String date);
}
