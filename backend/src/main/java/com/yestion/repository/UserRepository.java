package com.yestion.repository;

import com.yestion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository<엔티티, PK타입>
// save(), findById(), findAll(), delete() 등 기본 CRUD 자동 제공
public interface UserRepository extends JpaRepository<User, Long> {

    // 메서드 이름만으로 쿼리 자동 생성
    // → SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
