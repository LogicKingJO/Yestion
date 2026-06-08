package com.yestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class TodoDto {

    // ── 생성 요청 ─────────────────────────────
    @Getter @Setter
    public static class CreateRequest {
        @NotBlank(message = "할 일 제목을 입력해주세요.")
        private String title;

        private String memo;
        private String dueDate;     // "YYYY-MM-DD"
        private String date;        // "YYYY-MM-DD"
        private Long   categoryId;
    }

    // ── 수정 요청 ─────────────────────────────
    @Getter @Setter
    public static class UpdateRequest {
        private String  title;
        private String  memo;
        private String  dueDate;
        private String  date;
        private Long    categoryId;
        private Boolean done;
    }

    // ── 응답 ──────────────────────────────────
    @Getter @Setter
    public static class Response {
        private Long    id;
        private String  title;
        private String  memo;
        private String  dueDate;
        private String  date;
        private Boolean done;
        private CategoryDto.Response category;

        // Entity → DTO 변환 생성자
        public Response(com.yestion.entity.Todo todo) {
            this.id       = todo.getId();
            this.title    = todo.getTitle();
            this.memo     = todo.getMemo();
            this.dueDate  = todo.getDueDate();
            this.date     = todo.getDate();
            this.done     = todo.getDone();
            if (todo.getCategory() != null) {
                this.category = new CategoryDto.Response(todo.getCategory());
            }
        }
    }
}
