package com.jc.equipment.service;

import com.jc.equipment.dao.DepartmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DepartmentService {

    @Autowired
    DepartmentMapper departmentMapper;

    public List<Map<String,Object>> getDepartmentList(){
        return departmentMapper.getDepartmentList();
    }

    public int getMaxNumber(){
        return departmentMapper.getMaxNumber();
    }

    public void insertDepartment(Map<String,Object> map){
        departmentMapper.insertDepartment(map);
    }

    public void updateDepartment(Map<String,Object> map){
        departmentMapper.updateDepartment(map);
    }

    public void deleteDepartment(List<Map<String,Object>> list){
        departmentMapper.deleteDepartment(list);
    }

}
