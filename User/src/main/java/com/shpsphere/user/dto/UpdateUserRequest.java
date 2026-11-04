package com.shpsphere.user.dto;


import com.shpsphere.user.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank
    @Size(max = 150)
    private String firstName;
    @Size(max = 150)
    private String lastName;
    @NotBlank
    @Email
    private String email;
    @Size(max = 15)
    private String phone;
    @NotNull
    private UserRole role;
    private String profileImageUrl;
    private String profileImageName;
}
