package com.shpsphere.user.service;

import com.shpsphere.user.dto.AuthResponse;
import com.shpsphere.user.dto.LoginRequest;
import com.shpsphere.user.dto.RegisterAuthRequest;
import com.shpsphere.user.entity.User;
import com.shpsphere.user.enums.UserRole;
import com.shpsphere.user.exception.InvalidPasswordException;
import com.shpsphere.user.exception.UserAlreadyAvailableException;
import com.shpsphere.user.exception.UserNotFoundException;
import com.shpsphere.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registerUser(RegisterAuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyAvailableException("User already exists with email: " + email);
        }

        if (request.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new InvalidPasswordException("Password must not exceed 72 UTF-8 bytes");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER);

        User savedUser = userRepository.save(user);

        return getAuthResponse(savedUser);

    }

    private AuthResponse getAuthResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setEmail(user.getEmail());

        response.setAccessToken(jwtService.generateToken(user));

        return response;
    }

    public AuthResponse loginUser(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User doesn't exist with mail id " + request.getEmail()));

        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new InvalidPasswordException("Password provide for the user " + request.getEmail() + " is not correct");
        }
        return getAuthResponse(user);
    }
}
