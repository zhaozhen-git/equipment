package com.jc.equipment.service;

import com.jc.equipment.dao.UserMapper;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    UserMapper userMapper;


    public List<Map<String,Object>> getDepartmentUser(Map<String,Object> map){
        return userMapper.getDepartmentUser(map);
    }

    public List<Map<String,Object>> getUserList(Map<String,Object> map){
        return userMapper.getUserList(map);
    }

    public List<Map<String,Object>> getRoleList(){
        return userMapper.getRoleList();
    }

    public void insertUser(Map<String,Object> map){
        userMapper.insertUser(map);
    }

    public void insertRole(Map<String,Object> map){
        userMapper.insertRole(map);
    }

    public void updateUser(Map<String,Object> map){
        userMapper.updateUser(map);
    }

    public void updateRole(Map<String,Object> map){
        userMapper.updateRole(map);
    }

    public int boolUser(Map<String,Object> map){
        return userMapper.boolUser(map);
    }

    public void deleteUser(List<Map<String,Object>> list){
        userMapper.deleteUser(list);
    }

    public String getUserPassword(Map<String,Object> map){
        return userMapper.getUserPassword(map);
    }

    public void changePassword(Map<String,Object> map){
        userMapper.changePassword(map);
    }



    //以文件得形式插入用户
    public void info(String fileName, MultipartFile file) throws Exception{
        if (!fileName.matches("^.+\\.(xls)$") && !fileName.matches("^.+\\.(?i)(xlsx)$")) {
            throw new Exception("上传文件格式不正确");
        }
        boolean isExcel2003 = true;
        if (fileName.matches("^.+\\.(?i)(xlsx)$")) {
            isExcel2003 = false;
        }
        InputStream is = file.getInputStream();
        Sheet sheet = null;
        if (isExcel2003) {
            HSSFWorkbook wb = new HSSFWorkbook(is);
            sheet = wb.getSheetAt(0);
        } else {
            XSSFWorkbook wb = new XSSFWorkbook(is);
            sheet = wb.getSheetAt(0);
        }
        List<Map<String, Object>> list = new ArrayList<>();
        for (int r = 1; r <= sheet.getLastRowNum(); r++) {
            Map<String,Object> map = new HashMap<>();
            Row row = sheet.getRow(r);
            if (row == null) {
                continue;
            }
            String user = String.valueOf(row.getCell(1).toString()).trim();
            if(user.indexOf(".")>0){
                user = user.substring(0,user.indexOf("."));
            }
            map.put("department", String.valueOf(row.getCell(0)).trim());
            map.put("user_id", user);
            map.put("user_name", String.valueOf(row.getCell(2)).trim());
            String departmentID = String.valueOf(userMapper.getDepartmentID(map));
            map.put("departmentID",departmentID);
            list.add(map);
        }
        //插入用户
        userMapper.info(list);
        //插入角色权限
        userMapper.infoRole(list);
    }
}
