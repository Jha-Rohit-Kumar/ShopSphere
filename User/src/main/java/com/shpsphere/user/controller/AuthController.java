package com.shpsphere.user.controller;

import com.shpsphere.user.dto.AuthResponse;
import com.shpsphere.user.dto.LoginRequest;
import com.shpsphere.user.dto.RegisterAuthRequest;
import com.shpsphere.user.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerUser(@Valid @RequestBody RegisterAuthRequest request){
        return authService.registerUser(request);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(@Valid @RequestBody LoginRequest request){
        return authService.loginUser(request);
    }

}
