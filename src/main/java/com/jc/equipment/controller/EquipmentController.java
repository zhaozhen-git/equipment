package com.jc.equipment.controller;

import com.jc.equipment.service.EquipmentService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.*;

@Controller
public class EquipmentController {

    @Autowired
    EquipmentService equipmentService;


    /**
     * 根据登录用户获取对应得设备列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping("/getEquipmentList")
    public Map<String,Object> getEquipmentList(HttpServletRequest request){
        //用户ID
        String username = request.getParameter("userID");
        //模糊搜索字段
        String data = request.getParameter("username");
        Map<String,Object> map = new HashMap<>();
        map.put("username",username);
        map.put("data",data);
        Map<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = equipmentService.getEquipmentList(map);
            List<Map<String,Object>> list1 = new ArrayList<>();
            for(int i =0;i<list.size();i++){
                String file = String.valueOf(list.get(i).get("equipment_file"));
                if(file.length()!=0 && !"null".equals(file)){
                    String fileData[] =file.split(";");
                    String filename = "";
                    String filepath = "/uploadFile/";
                    for(int j =0;j<fileData.length;j++){
                        if(fileData[j].equals("")){
                            continue;
                        }else{
                            Map<String,Object> map1 = new HashMap<>();
                            String path = filepath + fileData[j];
                            filename = fileData[j].substring(36);
                            map1.put("filepath",path);
                            map1.put("filename",filename);
                            list1.add(map1);
                        }
                    }
                    list.get(i).put("equipment_file",list1);
                }
            }
            resultMap.put("data", list);
            resultMap.put("code", "0");
            resultMap.put("msg", "");
            resultMap.put("count", "1");
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }


    /**
     * 设备（新增、编辑）
     * @param request
     * @param response
     */
    @RequestMapping("/editEquipment")
    public void insertEquipment(HttpServletRequest request,HttpServletResponse response){
        //操作
        String edit = request.getParameter("edit");
        //设备编号
        String equipment_ID = request.getParameter("equipment_ID");
        //设备名称
        String equipment_name = request.getParameter("equipment_name");
        //设备类型
        String equipment_type = request.getParameter("equipment_type");
        //设备规格
        String equipment_size = request.getParameter("equipment_size");
        //设备厂家
        String equipment_company = request.getParameter("equipment_company");
        //所属部门
        String departmentID = request.getParameter("departmentID");
        //负责人
        String userID = request.getParameter("userID");
        //购买日期
        String date = request.getParameter("date");
        //备注
        String remark = request.getParameter("remark");
        //文件
        String file = request.getParameter("file");
        Map<String,Object> map = new HashMap<>();
        map.put("equipment_ID",equipment_ID);
        map.put("equipment_name",equipment_name);
        map.put("equipment_type",equipment_type);
        map.put("equipment_size",equipment_size);
        map.put("equipment_company",equipment_company);
        map.put("departmentID",departmentID);
        map.put("userID",userID);
        map.put("date",date);
        map.put("remark",remark);
        //文件处理
        if(file!=null){
            if(!"".equals(file) && !";".equals(file)){
                file = file.replaceAll("[;]{2,}",";");
                if(file.substring(0,1).equals(";")){
                    file = file.substring(1);
                }
                file = file.substring(0,file.length()-1);
                map.put("file",file);
            }else{
                map.put("file",file);
            }
        }
        try{
            String msg = "0";
            if(edit.equals("insert")){
                //判断插入得设备ID是否已经存在
                int x = equipmentService.boolEquipment(map);
                if(x>0){
                    msg = "1";
                }else{
                    equipmentService.insertEquipment(map);
                }

            }else if(edit.equals("update")){
                equipmentService.updateEquipment(map);
            }
            JSONObject obj = new JSONObject();
            obj.put("msg",msg);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @RequestMapping("/deleteEquipment")
    public void deleteEquipment(HttpServletRequest request,HttpServletResponse response){
        String id = request.getParameter("id");
        String ID[] = id.split("[,]");
        List<Map<String,Object>> list = new ArrayList<>();
        for(int i =0;i<ID.length;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("ID",ID[i]);
            list.add(map);
        }
        try{
            equipmentService.deleteEquipment(list);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }

    }


    /**
     * 跳转设备列表页面
     * @param session
     * @return
     */
    @RequestMapping("/equipment")
    public String getEquipmentHtml(HttpSession session){
        try{
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
            String name = SecurityContextHolder.getContext().getAuthentication().getName();
            Map<String,Object> map = new HashMap<>();
            map.put("name",name);
            Map<String,Object> username = equipmentService.getAccount(map);
            session.setAttribute("username",username.get("user_name"));
            session.setAttribute("account",name);
            session.setAttribute("rolename",username.get("name"));
        }catch (Exception e){
            return "redirect:/login";
        }
        return "/jsp/equipment";
    }


    /**
     * 加载对应设备得保养项
     * @param request
     */
    @ResponseBody
    @RequestMapping("/getCareList")
    public Map<String,Object> getCareList(HttpServletRequest request){
        String equipment_ID = request.getParameter("equipment_ID");
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipment_ID);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = equipmentService.getCareList(map);
            resultMap.put("data", list);
            resultMap.put("code", "0");
            resultMap.put("msg", "");
            resultMap.put("count", "1");
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }


    /**
     * 根据设备获取设备保养项
     * @param response
     * @param request
     */
    @RequestMapping("/getCare")
    public void getCare(HttpServletResponse response,HttpServletRequest request){
        String equipmentID = request.getParameter("equipmentID");
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipmentID);
        try{
            List<Map<String,Object>> list = equipmentService.getCareList(map);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @RequestMapping("/getEquipmentCare")
    public void getEquipmentCare(HttpServletRequest request,HttpServletResponse response){
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("user_ID",userID);
        try{
            List<Map<String,Object>> list =equipmentService.getEquipmentCare(map);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }




    /**
     * 设备保养项(新增、编辑)
     * @param response
     * @param request
     */
    @RequestMapping("/editCare")
    public void editCare(HttpServletResponse response,HttpServletRequest request){
        String edit = request.getParameter("edit");
        String equipment_ID = request.getParameter("equipment_ID");
        String careData = request.getParameter("careData");
        Map<String,Object> map = new HashMap<>();
        map.put("equipment_ID",equipment_ID);
        map.put("careData",careData);
        try{
            if(edit.equals("insert")){
                //得到设备保养项最大得编号
                String s = equipmentService.getCareNum(map);
                if(s==null){
                    map.put("care_ID",0);
                }else{
                    map.put("care_ID",Integer.valueOf(s)+1);
                }
                equipmentService.insertCare(map);
            }else if(edit.equals("update")){
                String care_ID = request.getParameter("care_ID");
                map.put("care_ID",care_ID);
                equipmentService.updateCare(map);
            }
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @RequestMapping("/deleteCare")
    public void deleteCare(HttpServletRequest request,HttpServletResponse response){
        String equipment_ID = request.getParameter("equipment_ID");
        String id = request.getParameter("id");
        String ID[] = id.split("[,]");
        List<Map<String,Object>> list = new ArrayList<>();
        for(int i =0;i<ID.length;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("equipmentID",equipment_ID);
            map.put("care_ID",ID[i]);
            list.add(map);
        }
        try{
            equipmentService.deleteCareList(list);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @Transactional
    @RequestMapping("/editCarePlans")
    public void editCarePlans(HttpServletRequest request,HttpServletResponse response){
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        String userID = request.getParameter("userID");
        String data = request.getParameter("data");
        String equipmentID = request.getParameter("equipmentID");
        String Jan = request.getParameter("Jan");
        String Feb = request.getParameter("Feb");
        String March = request.getParameter("March");
        String April = request.getParameter("April");
        String May = request.getParameter("May");
        String June = request.getParameter("June");
        String July = request.getParameter("July");
        String August = request.getParameter("August");
        String Sept = request.getParameter("Sept");
        String Oct = request.getParameter("Oct");
        String Nov = request.getParameter("Nov");
        String Dec = request.getParameter("Dec");
        String file = request.getParameter("file");
        Map<String,Object> map = new HashMap<>();
        map.put("userID",userID);
        map.put("year",year);
        map.put("equipment_ID",equipmentID);
        map.put("Jan",Jan);
        map.put("Feb",Feb);
        map.put("March",March);
        map.put("April",April);
        map.put("May",May);
        map.put("June",June);
        map.put("July",July);
        map.put("August",August);
        map.put("Sept",Sept);
        map.put("Oct",Oct);
        map.put("Nov",Nov);
        map.put("Dec",Dec);
        //文件处理
        if(file!=null){
            if(file!=""){
                file = file.replaceAll("[;]{2,}",";");
                if(file.substring(0,1).equals(";")){
                    file = file.substring(1);
                }
                file = file.substring(0,file.length()-1);
                map.put("file",file);
            }else{
                map.put("file",file);
            }
        }
        try{
            String[] a = data.split(",");
            List<Map<String,Object>> list = equipmentService.getList(map);
            List<Map<String,Object>> list1 = new ArrayList<>();
            Map<String,Object> map1 = new HashMap<>();
            //拿到传过来得设备保养项再数据库没有的，将数据库得注销
            for(int i =0;i<list.size();i++){
                String care_name = String.valueOf(list.get(i).get("care_name"));
                for(int j =0;j<a.length;j++){
                    String carename = a[j];
                    if(care_name.equals(carename)){
                        break;
                    }
                    if(j==a.length-1){
                        String care_ID = String.valueOf(list.get(i).get("care_ID"));
                        map1.put("care_ID",care_ID);
                        map1.put("equipmentID",equipmentID);
                        list1.add(map1);
                        break;
                    }
                }
            }
            //先得到数据库中最大项得保养项编号
            int num = 0;
            //拿到传过来得数据，再数据库中没有得，进行插入
            List<Map<String,Object>> list2 = new ArrayList<>();
            if(list.size()!=0) {
                num = Integer.valueOf(equipmentService.getCareNum(map));
                for(int i = 0;i<a.length;i++){
                    String care_name = a[i];
                    for(int j=0;j<list.size();j++){
                        String carename = String.valueOf(list.get(j).get("care_name"));
                        if(care_name.equals(carename)){
                            break;
                        }else if(j==list.size()-1){
                            Map<String,Object> map2 = new HashMap<>();
                            num = num+1;
                            map2.put("equipmentID",equipmentID);
                            map2.put("care_ID",num);
                            map2.put("care_name",care_name);
                            list2.add(map2);
                            list.add(map2);
                            break;
                        }
                    }
                }
            }else{
                for(int i = 0;i<a.length;i++) {
                    String care_name = a[i];
                    Map<String, Object> map2 = new HashMap<>();
                    num = num + 1;
                    map2.put("equipmentID", equipmentID);
                    map2.put("care_ID", num);
                    map2.put("care_name", care_name);
                    list2.add(map2);
                }
            }
            if(list1.size()!=0){
                //先注销相应得设备
                equipmentService.deleteCareList(list1);
            }
            if(list2.size()!=0){
                //插入新增得保养计划
                equipmentService.insertCareList(list2);
            }
            //判断是否有该设备该年得计划
            String plan = equipmentService.boolCare(map);
            if(plan!=null){
                //如果存在就更改数据
                equipmentService.updateCarePlan(map);
            }else{
                //不存在则插入数据
                equipmentService.insertCarePlan(map);
            }
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            throw new RuntimeException("出错！");

        }
    }


    /**
     * 得到最新得一年得某个设备得每个月得保养计划
     * @param response
     * @param request
     */
    @RequestMapping("/getCarePlans")
    public void getCarePlans(HttpServletResponse response,HttpServletRequest request){
        String equipmentID = request.getParameter("equipmentID");
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipmentID);
        map.put("year",year);
        JSONObject obj = new JSONObject();
        try{
            List<Map<String,Object>> list = equipmentService.getCarePlans(map);
            //文件存放路径
//            String filePath = request.getSession().getServletContext().getRealPath("");
//            if(list.size()!=0){
//                String carePlans_file = String.valueOf(list.get(0).get("carePlans_file"));
//                if(!"null".equals(carePlans_file) && !"".equals(carePlans_file)){
//                    List<Map<String,Object>> list1 = new ArrayList<>();
//                    String data1[] = null;
//                    data1 = carePlans_file.split(";");
//                    for(int i=0;i<data1.length;i++){
//                        File file = new File(filePath+"\\uploadFile\\"+data1[i]);
//                        String size = String.valueOf(file.length());
//                        String filename = data1[i];
//                        String name = data1[i].substring(36);
//                        Map<String,Object> map1 = new HashMap<>();
//                        map1.put("size",size);
//                        map1.put("name",name);
//                        map1.put("filename",filename);
//                        list1.add(map1);
//                    }
//                    obj.put("list1",list1);
//                }
//            }
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 删除保养项计划
     * @param request
     * @param response
     */
    @RequestMapping("/deleteCarePlans")
    public void deleteCarePlans(HttpServletRequest request,HttpServletResponse response){
        String id = request.getParameter("id");
        String year = request.getParameter("year");
        Map<String,Object> map = new HashMap<>();
        map.put("id",id);
        map.put("year",year);
        try{
            equipmentService.deleteCarePlans(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    //设备保养记录
    @RequestMapping("/getEquipmentTime")
    public void getEquipmentTime(HttpServletRequest request,HttpServletResponse response){
        String equipmentID = request.getParameter("equipmentID");
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipmentID);
        try{
            List<Map<String,Object>> list = equipmentService.getEquipmentTime(map);
            List<Map<String,Object>> list1 = equipmentService.getEquipmentRepair(map);
            //将零件得ID变成零件项
            if(list1.size()!=0){
                for(int i =0;i<list1.size();i++){
                    List<Map<String,Object>> list2 = new ArrayList<>();
                    String partID = list1.get(i).get("repairRecord_partData").toString();
                    String part[] = partID.split(",");
                    for(int j=0;j<part.length;j++){
                        Map<String,Object> map1 = new HashMap<>();
                        map1.put("part",part[j]);
                        list2.add(map1);
                    }
                    list2 = equipmentService.getPart(list2);
                    list1.get(i).put("part",list2);
                }

            }
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            obj.put("list1",list1);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @RequestMapping("/getFile")
    public void getFile(HttpServletRequest request,HttpServletResponse response){
        String equipmentID = request.getParameter("equipment_ID");
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipmentID);
        try {
            List<Map<String,Object>> list = equipmentService.getFile(map);
            //文件存放路径
            String filePath = request.getSession().getServletContext().getRealPath("");
            JSONObject obj = new JSONObject();
            if(list.size()!=0){
                String equipment_file = String.valueOf(list.get(0).get("equipment_file"));
                if(!"null".equals(equipment_file) && !"".equals(equipment_file)){
                    List<Map<String,Object>> list1 = new ArrayList<>();
                    String data1[] = null;
                    data1 = equipment_file.split(";");
                    for(int i=0;i<data1.length;i++){
                        File file = new File(filePath+"\\uploadFile\\"+data1[i]);
                        String size = String.valueOf(file.length());
                        String filename = data1[i];
                        String name = data1[i].substring(36);
                        Map<String,Object> map1 = new HashMap<>();
                        map1.put("size",size);
                        map1.put("name",name);
                        map1.put("filename",filename);
                        list1.add(map1);
                    }
                    obj.put("list",list1);
                }
            }
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
