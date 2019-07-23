package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface RepairPlansMapper {

    List<Map<String,Object>> getRepairPlansList(Map<String,Object> map);

    void insertRepairPlans(Map<String,Object> map);

    List<Map<String,Object>> LookRepairPlans(Map<String,Object> map);

    List<Map<String,Object>> getWaitRepair(Map<String,Object> map);

    void deleteRepair(Map<String,Object> map);

    void repairBill(Map<String,Object> map);

    String getNum();

    void updateBill(Map<String,Object> map);

    String getUsername(Map<String,Object> map);

    List<Map<String,Object>> getRepairRecord(Map<String,Object> map);

    void changeState(Map<String,Object> map);

    void insertRepairBill(Map<String,Object> map);

    String getOperator(Map<String,Object> map);

    String getEquipmentName(Map<String,Object> map);

    List<Map<String,Object>> getEquipmentID(Map<String,Object> map);

    List<Map<String,Object>> getList(List<Map<String,Object>> list);

    List<Map<String,Object>> getPartName(List<Map<String,Object>> list);

    List<Map<String,Object>> getEquipmentList(Map<String,Object> map);

    List<Map<String,Object>> getCare(List<Map<String,Object>> list);

    String getPartDes(Map<String,Object> map);
}
