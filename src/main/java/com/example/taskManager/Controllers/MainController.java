package com.example.taskManager.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.taskManager.Repositories.UserRepository;
import com.example.taskManager.Services.UserServiceImpl;
import java.util.List;
import com.example.taskManager.Entities.User;

import jakarta.annotation.*;

@RestController
public class MainController {
    
    private UserServiceImpl service;

    @Autowired
    public MainController(UserServiceImpl service){
        this.service = service;
    }

    @GetMapping("/health-check")
    public String healthCheck(){
        return "Ok";
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return service.createUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        return "helo";
    }
}
