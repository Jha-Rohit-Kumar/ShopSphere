package com.shpsphere.user.service;

import com.shpsphere.user.dto.CreateUserRequest;
import com.shpsphere.user.dto.UpdateUserRequest;
import com.shpsphere.user.entity.User;
import com.shpsphere.user.enums.UserRole;
import com.shpsphere.user.exception.*;
import com.shpsphere.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(CreateUserRequest request) {

        // Only ADMIN can create users
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User authenticatedUser) ||
                authenticatedUser.getRole() != UserRole.ADMIN) {

            throw new AccessDeniedException(
                    "Only administrators can create users"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        // Check duplicate email
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyAvailableException(
                    "User already exists with email: " + email
            );
        }

        // Validate password byte length
        if (request.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new InvalidPasswordException(
                    "Password must not exceed 72 UTF-8 bytes"
            );
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(email);

        String phone = request.getPhone();

        user.setPhone(
                phone == null || phone.isBlank()
                        ? null
                        : phone.trim()
        );

        user.setRole(request.getRole());

        // Always encode the password
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }


    public User getUserbyId(UUID id) {
        validateOwnership(id);
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User doesn't exist"));
    }

    public List<User> getAllUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User authenticatedUser) ||
                authenticatedUser.getRole() != UserRole.ADMIN) {

            throw new AccessDeniedException("Only administrators can access the customer listing");
        }

        return userRepository.findAll();
    }

    public User updateUserById(UUID id, UpdateUserRequest request) {
        User user = getUserbyId(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        String phone = request.getPhone();

        user.setPhone(
                phone == null || phone.isBlank()
                        ? null
                        : phone.trim()
        );

        user.setRole(request.getRole());
        return userRepository.save(user);
    }

    public void deleteUserById(UUID id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getId().equals(id)) {
            throw new AccessDeniedException(
                    "You cannot delete your own account."
            );
        }

        User user = getUserbyId(id);
        userRepository.delete(user);
    }

    public User saveUserPhoto(UUID id, MultipartFile file){
        User user = getUserbyId(id);

        // 1. Validate empty file
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please upload a valid image");
        }

        // 2. Validate file size (2 MB)
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new FileSizeExceededException("Image size cannot exceed 2 MB");
        }

        // 3. Validate content type
        String contentType = file.getContentType();

        if (contentType == null ||
                !List.of("image/jpeg", "image/png", "image/webp").contains(contentType)) {
            throw new InvalidFileException("Only JPG, PNG and WebP images are allowed");
        }

        // 4. Create upload directory
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        // 5. Generate a safe filename
        String extension = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new InvalidFileException("Unsupported image format");
        };

        String fileName = id + extension;
        Path filePath = uploadPath.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadPath)) {
            throw new InvalidFileException("Invalid image path");
        }

        // 6. Save image
        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new FileNotSavedException("Unable to store profile photo", ex);
        }

        user.setProfileImageName(fileName);
        user.setProfileImageUrl("/api/v1/user/" + id + "/photo");
        return userRepository.save(user);
    }

    public Resource getUserPhoto(UUID id) {
        User user = getUserbyId(id);

        if (user.getProfileImageName() == null || user.getProfileImageName().isBlank()) {
            throw new PhotoNotFoundException("Profile photo not found");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path imagePath = uploadPath.resolve(user.getProfileImageName()).normalize();

        if (!imagePath.startsWith(uploadPath)) {
            throw new InvalidFileException("Invalid image path");
        }

        try {
            if (Files.isRegularFile(imagePath)) {
                return new UrlResource(imagePath.toUri());
            }
        } catch (MalformedURLException e) {
            throw new FileNotHandledActionException("Unable to perform fetch operation for profile photo", e);
        }

        throw  new PhotoNotFoundException("Profile photo not found");
    }

    public void deleteUserPhoto(UUID id) {
        User user = getUserbyId(id);

        if (user.getProfileImageName() != null && !user.getProfileImageName().isBlank()) {

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path imagePath = uploadPath.resolve(user.getProfileImageName()).normalize();

            if (!imagePath.startsWith(uploadPath)) {
                throw new InvalidFileException("Invalid image path for delete operation");
            }

            try {
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                throw new FileNotHandledActionException("Unable to perform delete operation for profile photo", e);
            }

            user.setProfileImageName(null);
            user.setProfileImageUrl(null);
            userRepository.save(user);
        }
    }

    private void validateOwnership(UUID requestedUserId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User authenticatedUser)) {
            throw new AccessDeniedException("Authentication required");
        }

        // ADMIN can access any user's profile
        if (authenticatedUser.getRole() == UserRole.ADMIN) {
            return;
        }

        // CUSTOMER can access only their own profile
        if (!authenticatedUser.getId().equals(requestedUserId)) {
            throw new AccessDeniedException(
                    "You are not authorized to access this user's profile"
            );
        }
    }
}
