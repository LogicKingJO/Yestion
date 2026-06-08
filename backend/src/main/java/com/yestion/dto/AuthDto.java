package com.yestion.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class AuthDto {

    // ── 회원가입 요청 ──────────────────────────
    @Getter @Setter
    public static class SignupRequest {
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(max = 16, message = "닉네임은 16자 이하여야 합니다.")
        private String name;

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Size(min = 6, message = "비밀번호는 6자 이상이어야 합니다.")
        private String password;
    }

    // ── 로그인 요청 ───────────────────────────
    @Getter @Setter
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;
    }

    // ── 로그인 응답 (JWT 토큰) ─────────────────
    @Getter @Setter
    public static class LoginResponse {
        private String accessToken;
        private String name;
        private String email;

        public LoginResponse(String accessToken, String name, String email) {
            this.accessToken = accessToken;
            this.name = name;
            this.email = email;
        }
    }
}
