package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface UserMapper {

    List<Map<String,Object>> findUserName(Map<String,Object> map);

    //获取对应部门下得用户
    List<Map<String,Object>> getDepartmentUser(Map<String,Object> map);

    //获取用户列表
    List<Map<String,Object>> getUserList(Map<String,Object> map);

    //获取用户权限列表
    List<Map<String,Object>> getRoleList();

    //添加用户
    void insertUser(Map<String,Object> map);

    //添加对应用户权限
    void insertRole(Map<String,Object> map);

    //编辑用户
    void updateUser(Map<String,Object> map);

    //编辑用户对应权限
    void updateRole(Map<String,Object> map);

    //判断工号是否已使用
    int boolUser(Map<String,Object> map);

    //删除用户
    void deleteUser(List<Map<String,Object>> list);

    //获取部门ID
    String getDepartmentID(Map<String,Object> map);

    //插入多用户
    void info(List<Map<String,Object>> list);

    //插入多用户权限
    void infoRole(List<Map<String,Object>> list);

    //得到用户密码
    String getUserPassword(Map<String,Object> map);

    //修改用户密码
    void changePassword(Map<String,Object> map);
}
