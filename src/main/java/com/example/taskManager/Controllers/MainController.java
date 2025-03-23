package com.example.taskManager.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.taskManager.Services.UserServiceImpl;
import com.example.taskManager.Entities.User;
import com.example.taskManager.Jwt.JwtUtil;


@RestController
public class MainController {
    
    private UserServiceImpl service;

    @Autowired
    private JwtUtil jwtUtility;

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
    public ResponseEntity<String> login(@RequestBody User user){

        User returnedUser = service.checkCredentials(user);

        if(returnedUser == null){
            return new ResponseEntity<>("Invalid Username or Password",HttpStatus.UNAUTHORIZED);
        }
        String token = jwtUtility.generateToken(user.getUsername());

        return new ResponseEntity<>(token,HttpStatus.OK);
    }
}
