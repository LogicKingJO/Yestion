package com.yestion.service;

import com.yestion.dto.AuthDto;
import com.yestion.entity.User;
import com.yestion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor  // final 필드 생성자 자동 주입
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // TODO: private final JwtUtil jwtUtil;

    // ── 회원가입 ──────────────────────────────
    public User signup(AuthDto.SignupRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 해싱 후 저장
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    // ── 로그인 ────────────────────────────────
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // TODO: JWT 토큰 생성
        // String token = jwtUtil.generateToken(user.getId());
        String token = "TODO: JWT 구현 예정";

        return new AuthDto.LoginResponse(token, user.getName(), user.getEmail());
    }
}
