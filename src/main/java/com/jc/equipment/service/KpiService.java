package com.jc.equipment.service;

import com.jc.equipment.dao.KpiMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class KpiService {

    @Autowired
    KpiMapper kpiMapper;


    public List<Map<String,Object>> getEquipmentList(){
        return kpiMapper.getEquipmentList();
    }

    public List<Map<String,Object>> getCareList(){
        return kpiMapper.getCareList();
    }

    public List<Map<String,Object>> getSuccessCare(){
        return kpiMapper.getSuccessCare();
    }

    public List<Map<String,Object>> getRepairList(){
        return kpiMapper.getRepairList();
    }

    public List<Map<String,Object>> getCareRepair(){
        return kpiMapper.getCareRepair();
    }

    public List<Map<String,Object>> getCare(Map<String,Object> map){
        return kpiMapper.getCare(map);
    }

    public String getSuccess(Map<String,Object> map){
        return kpiMapper.getSuccess(map);
    }

    public List<Map<String,Object>> getPartName(List<Map<String,Object>> list){
        return kpiMapper.getPartName(list);
    }

    public String getName(Map<String,Object> map){
        return kpiMapper.getName(map);
    }

}
