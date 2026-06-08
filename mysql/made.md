# 🗄️ Yestion 데이터베이스 설계

---

## 테이블 목록

| 테이블명 | 설명 |
|----------|------|
| `users` | 회원 정보 |
| `categories` | 카테고리 정보 |
| `todos` | 할 일 정보 |

---

## users

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | 이메일 (로그인 ID) |
| `name` | VARCHAR(50) | NOT NULL | 닉네임 |
| `password` | VARCHAR(255) | NOT NULL | BCrypt 해시된 비밀번호 |
| `created_at` | DATETIME | NOT NULL | 가입 일시 |

---

## categories

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| `user_id` | BIGINT | NOT NULL, FK → users.id | 카테고리 소유자 |
| `name` | VARCHAR(50) | NOT NULL | 카테고리 이름 |
| `color` | VARCHAR(7) | NOT NULL | HEX 색상 코드 (예: #6C63FF) |

---

## todos

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | 고유 식별자 |
| `user_id` | BIGINT | NOT NULL, FK → users.id | 할 일 소유자 |
| `category_id` | BIGINT | FK → categories.id | 카테고리 (선택) |
| `title` | VARCHAR(255) | NOT NULL | 할 일 제목 |
| `memo` | TEXT | NULL 허용 | 상세 메모 |
| `due_date` | VARCHAR(10) | NULL 허용 | 마감일 (YYYY-MM-DD) |
| `date` | VARCHAR(10) | NOT NULL | 표시 날짜 (YYYY-MM-DD) |
| `done` | BOOLEAN | NOT NULL, DEFAULT false | 완료 여부 |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |

---

## 테이블 관계 (ERD 요약)

```
users ──────< categories
  │               │
  └──────< todos >┘
```

- `users` : `categories` = **1 : N** (한 유저가 여러 카테고리 소유)
- `users` : `todos` = **1 : N** (한 유저가 여러 할 일 소유)
- `categories` : `todos` = **1 : N** (한 카테고리에 여러 할 일)
- `categories.id` 는 `todos` 에서 **선택(NULL 허용)**

---

## 삭제 정책

| 상황 | 처리 |
|------|------|
| `users` 삭제 | 해당 유저의 `todos`, `categories` 전부 삭제 (CASCADE) |
| `categories` 삭제 | 해당 카테고리의 `todos.category_id` 를 NULL로 변경 (SET NULL) |
