package com.jc.equipment.service;

import com.jc.equipment.dao.PartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PartService {

    @Autowired
    PartMapper partMapper;


    public List<Map<String,Object>> getPartList(){
        return partMapper.getPartList();
    }

    public String getNum(){
        return partMapper.getNum();
    }

    public void insertPart(Map<String,Object> map){
        partMapper.insertPart(map);
    }

    public void deletePart(List<Map<String,Object>> list){
        partMapper.deletePart(list);
    }

    public List<Map<String,Object>> getPart(){
        return partMapper.getPart();
    }
}
