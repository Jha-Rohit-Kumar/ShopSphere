package com.shpsphere.user.controller;


import com.shpsphere.user.dto.UpdateUserRequest;
import com.shpsphere.user.entity.User;
import com.shpsphere.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable UUID id){
        return userService.getUserbyId(id);
    }

    @GetMapping
    public List<User> getAllUser(){
        return userService.getAllUser();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request){
        return userService.updateUserById(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable UUID id){
        userService.deleteUserById(id);
    }

    //------------------------------------- profile photo

    @PostMapping("/{id}/photo")
    public User uploadUserPhoto(@PathVariable UUID id, @RequestParam("file") MultipartFile file){
        return userService.saveUserPhoto(id, file);
    }

    @GetMapping("/{id}/photo")
    public Resource getUserPhoto(@PathVariable UUID id){
        return userService.getUserPhoto(id);
    }

    @DeleteMapping("/{id}/photo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserPhoto(@PathVariable UUID id){
        userService.deleteUserPhoto(id);
    }
}
