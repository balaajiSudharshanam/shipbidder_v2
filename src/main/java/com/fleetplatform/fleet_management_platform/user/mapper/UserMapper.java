package com.fleetplatform.fleet_management_platform.user.mapper;

import com.fleetplatform.fleet_management_platform.user.api.UserResponse;
import com.fleetplatform.fleet_management_platform.user.domain.User;

public class UserMapper {
    private UserMapper(){

    }
    public static UserResponse toResponse(User user){
        if(user==null){
            return null;
        }
        return new UserResponse(
                user.getEmail(),
                user.getName(),
                user.getRole()
        );
    }
}
