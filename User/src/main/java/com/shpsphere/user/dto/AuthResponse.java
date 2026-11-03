package com.shpsphere.user.dto;

import com.shpsphere.user.enums.UserRole;
import lombok.Data;

import java.util.UUID;


@Data
public class AuthResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    //Regarding the JWT token
    private String accessToken;
    private String tokenType = "Bearer";
}
