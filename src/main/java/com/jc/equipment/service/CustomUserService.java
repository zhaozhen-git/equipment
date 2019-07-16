package com.jc.equipment.service;

import com.jc.equipment.dao.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomUserService implements UserDetailsService {


    @Autowired
    UserMapper userMapper;

    List<Map<String,Object>> list = new ArrayList<>();


    @Override
    public UserDetails loadUserByUsername(String username){
        Map<String,Object> map = new HashMap<>();
        map.put("username",username);
        list = userMapper.findUserName(map);
        if(list.size()==0){
            return null;
        }else{
            //用于添加用户权限
            String role = list.get(0).get("name").toString();
            String password = list.get(0).get("user_password").toString();
            Collection<? extends GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(role);
            return new User(list.get(0).get("user_ID").toString(),password, authorities);
        }
    }
}
