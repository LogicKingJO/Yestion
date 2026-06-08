package com.yestion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor   // 기본 생성자 자동 생성 (JPA 필수)
@AllArgsConstructor  // 전체 필드 생성자 자동 생성
@Builder             // Builder 패턴 자동 생성
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private String password;  // BCrypt 해시 저장

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist  // INSERT 직전 자동 실행
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 연관관계 — 나중에 구현
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private List<Todo> todos;

    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private List<Category> categories;
}
