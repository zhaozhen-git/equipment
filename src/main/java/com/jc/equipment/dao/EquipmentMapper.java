package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface EquipmentMapper {

    //获取设备列表
    List<Map<String,Object>> getEquipmentList(Map<String,Object> map);

    //获取账户信息
    Map<String,Object> getAccount(Map<String,Object> map);

    //判断设备ID是否已经存在
    int boolEquipment(Map<String,Object> map);

    //插入设备数据
    void insertEquipment(Map<String,Object> map);

    //更新设备数据
    void updateEquipment(Map<String,Object> map);

    //删除设备数据
    void deleteEquipment(List<Map<String,Object>> list);

    //得到设备保养项
    List<Map<String,Object>> getCareList(Map<String,Object> map);

    //得到设备中最大序列号
    String getCareNum(Map<String,Object> map);

    //插入设备保养项
    void insertCare(Map<String,Object> map);

    //更改设备保养项
    void updateCare(Map<String,Object> map);

    //得到设备列表
    List<Map<String,Object>> getEquipmentCare(Map<String,Object> map);

    //得到未删除得设备
    List<Map<String,Object>> getList(Map<String,Object> map);

    //删除设备保养项
    void deleteCareList(List<Map<String,Object>> list);

    //插入设备保养计划
    void insertCareList(List<Map<String,Object>> list);

    //更改某年得设备计划
    String boolCare(Map<String,Object> map);

    //更该某年设备保养项计划
    void updateCarePlan(Map<String,Object> map);

    //插入某年得计划
    void insertCarePlan(Map<String,Object> map);

    //得到设备得当年得计划
    List<Map<String,Object>> getCarePlans(Map<String,Object> map);

    //删除设备保养项计划
    void deleteCarePlans(Map<String,Object> map);

    //加载设备保养记录
    List<Map<String,Object>> getEquipmentTime(Map<String,Object> map);

    //加载维修记录
    List<Map<String,Object>> getEquipmentRepair(Map<String,Object> map);

    //得到文件列表
    List<Map<String,Object>> getFile(Map<String,Object> map);

    //得到零件项
    List<Map<String,Object>> getPart(List<Map<String,Object>> list);
}
