package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface KpiMapper {

    List<Map<String,Object>> getEquipmentList();

    List<Map<String,Object>> getCareList();

    List<Map<String,Object>> getSuccessCare();

    List<Map<String,Object>> getRepairList();

    List<Map<String,Object>> getCare(Map<String,Object> map);

    String getSuccess(Map<String,Object> map);
}
