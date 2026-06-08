package com.yestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class CategoryDto {

    @Getter @Setter
    public static class CreateRequest {
        @NotBlank(message = "카테고리 이름을 입력해주세요.")
        private String name;
        private String color = "#6C63FF";
    }

    @Getter @Setter
    public static class UpdateRequest {
        private String name;
        private String color;
    }

    @Getter @Setter
    public static class Response {
        private Long   id;
        private String name;
        private String color;

        public Response(com.yestion.entity.Category category) {
            this.id    = category.getId();
            this.name  = category.getName();
            this.color = category.getColor();
        }
    }
}
