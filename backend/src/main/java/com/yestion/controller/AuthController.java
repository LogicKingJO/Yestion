package com.yestion.controller;

import com.yestion.dto.AuthDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// TODO: AuthService 구현 후 주입
// @RequiredArgsConstructor

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // TODO: private final AuthService authService;

    // ── POST /api/auth/signup ─────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody AuthDto.SignupRequest request) {
        // TODO: return ResponseEntity.ok(authService.signup(request));
        return ResponseEntity.ok("signup 구현 예정");
    }

    // ── POST /api/auth/login ──────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        // TODO: return ResponseEntity.ok(authService.login(request));
        return ResponseEntity.ok("login 구현 예정");
    }
}
