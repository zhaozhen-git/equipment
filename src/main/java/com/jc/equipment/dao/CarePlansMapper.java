package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface CarePlansMapper {

    List<Map<String,Object>> getCarePlansList(Map<String,Object> map);

    void successCarePlansState(Map<String,Object> map);

    void unSuccessCarePlansState(Map<String,Object> map);

    void insertCareRecord(Map<String,Object> map);

    void deleteCareRecord(Map<String,Object> map);

    List<Map<String,Object>> getCareRecord(Map<String,Object> map);

    void cancelRepairBill(Map<String,Object> map);

}
