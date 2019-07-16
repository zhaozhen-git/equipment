package com.jc.equipment.service;

import com.jc.equipment.dao.RepairPlansMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RepairPlansService {

    @Autowired
    RepairPlansMapper repairPlansMapper;

    public List<Map<String, Object>> getRepairPlansList(Map<String, Object> map) {
        return repairPlansMapper.getRepairPlansList(map);
    }

    public void insertRepairPlans(Map<String, Object> map) {
        repairPlansMapper.insertRepairPlans(map);
    }

    public List<Map<String, Object>> LookRepairPlans(Map<String, Object> map) {
        return repairPlansMapper.LookRepairPlans(map);
    }

    public List<Map<String,Object>> getWaitRepair(){
        return repairPlansMapper.getWaitRepair();
    }

    public void deleteRepair(Map<String,Object> map){
        repairPlansMapper.deleteRepair(map);
    }


    public void repairBill(Map<String,Object> map){
        repairPlansMapper.repairBill(map);
    }

    public String getUsername(Map<String,Object> map){
        return repairPlansMapper.getUsername(map);
    }

    public List<Map<String,Object>> getRepairRecord(Map<String,Object> map){
        return repairPlansMapper.getRepairRecord(map);
    }

    public void changeState(Map<String,Object> map){
        repairPlansMapper.changeState(map);
    }

    public void insertRepairBill(Map<String,Object> map){
        repairPlansMapper.insertRepairBill(map);
    }

    public String getOperator(Map<String,Object> map){
        return repairPlansMapper.getOperator(map);
    }

    public String getEquipmentName(Map<String,Object> map){
        return repairPlansMapper.getEquipmentName(map);
    }

    public List<Map<String,Object>> getEquipmentID(Map<String,Object> map){
        return repairPlansMapper.getEquipmentID(map);
    }

    public List<Map<String,Object>> getList(List<Map<String,Object>> list){
        return repairPlansMapper.getList(list);
    }

    public List<Map<String,Object>> getPartName(List<Map<String,Object>> list){
        return repairPlansMapper.getPartName(list);
    }
}
