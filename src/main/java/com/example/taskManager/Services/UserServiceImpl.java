package com.example.taskManager.Services;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.taskManager.Repositories.UserRepository;

import com.example.taskManager.Entities.User;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserServices{

    private UserRepository userRepo;

    @Autowired
    public UserServiceImpl(UserRepository userRepo){
        this.userRepo = userRepo;
    }

    @Override
    public User createUser(User user){
        return userRepo.save(user);
    }

    @Override
    public User checkCredentials(User user){
        var existingUser = userRepo.findByUsernameAndPassword(user.getUsername(),user.getPassword());
        
        if(existingUser.isPresent()){
            return existingUser.get();
        }
        return null;
    }
}
