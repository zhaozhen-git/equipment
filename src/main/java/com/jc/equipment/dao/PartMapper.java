package com.jc.equipment.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@Mapper
public interface PartMapper {

    List<Map<String,Object>> getPartList();

    String getNum();

    void insertPart(Map<String,Object> map);

    void deletePart(List<Map<String,Object>> list);

    List<Map<String,Object>> getPart();
}
