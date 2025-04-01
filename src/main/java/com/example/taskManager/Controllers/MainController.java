package com.example.taskManager.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){

        if(service.findUsername(user.getUsername())){
            return new ResponseEntity<>("username is already registered",HttpStatus.CONFLICT);
        }

        try{
            service.createUser(user);
            return new ResponseEntity<>("Registration Success",HttpStatus.CREATED);
        }catch(IllegalArgumentException | DataIntegrityViolationException e){

            return new ResponseEntity<>("Bad Request",HttpStatus.BAD_REQUEST);

        }
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
