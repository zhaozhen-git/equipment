package com.jc.equipment.service;

import com.jc.equipment.dao.CarePlansMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CarePlansService {

    @Autowired
    CarePlansMapper carePlansMapper;


    public List<Map<String, Object>> getCarePlansList(Map<String, Object> map) {
        return carePlansMapper.getCarePlansList(map);
    }

    public List<Map<String,Object>> getPhotoList(Map<String,Object> map){
        return carePlansMapper.getPhotoList(map);
    }

    public void successCarePlansState(Map<String, Object> map) {
        carePlansMapper.successCarePlansState(map);
    }

    public void unSuccessCarePlansState(Map<String, Object> map) {
        carePlansMapper.unSuccessCarePlansState(map);
    }

    public void insertCareRecord(Map<String, Object> map) {
        carePlansMapper.insertCareRecord(map);
    }

    public void deleteCareRecord(Map<String, Object> map) {
        carePlansMapper.deleteCareRecord(map);
    }

    public List<Map<String, Object>> getCareRecord(Map<String, Object> map) {
        return carePlansMapper.getCareRecord(map);
    }

    public void cancelRepairBill(Map<String, Object> map) {
        carePlansMapper.cancelRepairBill(map);
    }

    public int getPhoto(Map<String,Object> map){
        return carePlansMapper.getPhoto(map);
    }

    public void updatePhoto(Map<String,Object> map){
        carePlansMapper.updatePhoto(map);
    }

    public void insertPhoto(Map<String,Object> map){
        carePlansMapper.insertPhoto(map);
    }

    public void cancelPhoto(Map<String,Object> map){
        carePlansMapper.cancelPhoto(map);
    }
}