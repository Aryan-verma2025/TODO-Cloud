package com.example.taskManager.Services;


import com.example.taskManager.Entities.User;

public interface UserServices {
    
    public User createUser(User user);

    public User checkCredentials(User user);

}
