package com.jc.equipment.service;

import com.jc.equipment.dao.EquipmentMapper;
import org.omg.CORBA.OBJ_ADAPTER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EquipmentService {

    @Autowired
    EquipmentMapper equipmentMapper;


    public List<Map<String,Object>> getEquipmentList(Map<String,Object> map){
        return equipmentMapper.getEquipmentList(map);
    }

    public Map<String,Object> getAccount(Map<String,Object> map){
        return equipmentMapper.getAccount(map);
    }

    public int boolEquipment(Map<String,Object> map){
        return equipmentMapper.boolEquipment(map);
    }
    public void insertEquipment(Map<String,Object> map){
        equipmentMapper.insertEquipment(map);
    }

    public void updateEquipment(Map<String,Object> map){
        equipmentMapper.updateEquipment(map);
    }

    public void deleteEquipment(List<Map<String,Object>> list){
        equipmentMapper.deleteEquipment(list);
    }

    public List<Map<String,Object>> getCareList(Map<String,Object> map){
        return equipmentMapper.getCareList(map);
    }

    public String getCareNum(Map<String,Object> map){
        return equipmentMapper.getCareNum(map);
    }

    public void insertCare(Map<String,Object> map){
        equipmentMapper.insertCare(map);
    }

    public void updateCare(Map<String,Object> map){
        equipmentMapper.updateCare(map);
    }

    public List<Map<String,Object>> getEquipmentCare(Map<String,Object> map){
        return equipmentMapper.getEquipmentCare(map);
    }

    public List<Map<String,Object>> getList(Map<String,Object> map){
        return equipmentMapper.getList(map);
    }

    public void deleteCareList(List<Map<String,Object>> list){
        equipmentMapper.deleteCareList(list);
    }

    public void insertCareList(List<Map<String,Object>> list){
        equipmentMapper.insertCareList(list);
    }

    public String boolCare(Map<String,Object> map){
        return equipmentMapper.boolCare(map);
    }

    public void updateCarePlan(Map<String,Object> map){
        equipmentMapper.updateCarePlan(map);
    }

    public void insertCarePlan(Map<String,Object> map){
        equipmentMapper.insertCarePlan(map);
    }

    public List<Map<String,Object>> getCarePlans(Map<String,Object> map){
        return equipmentMapper.getCarePlans(map);
    }


    public void deleteCarePlans(Map<String,Object> map){
        equipmentMapper.deleteCarePlans(map);
    }

    public List<Map<String,Object>> getEquipmentTime(Map<String,Object> map){
        return equipmentMapper.getEquipmentTime(map);
    }

    public List<Map<String,Object>> getFile(Map<String,Object> map){
        return equipmentMapper.getFile(map);
    }
}
