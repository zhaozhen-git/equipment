package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface DepartmentMapper {

    //获取部门列表
    List<Map<String,Object>> getDepartmentList();

    //得到最大序号
    int getMaxNumber();

    //部门插入
    void insertDepartment(Map<String,Object> map);

    //部门编辑
    void updateDepartment(Map<String,Object> map);

    //部门删除
    void deleteDepartment(List<Map<String,Object>> list);
}
