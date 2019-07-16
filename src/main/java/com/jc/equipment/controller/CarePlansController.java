package com.jc.equipment.controller;

import com.jc.equipment.service.CarePlansService;
import com.jc.equipment.service.EquipmentService;
import com.jc.equipment.service.RepairPlansService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class CarePlansController {

    @Autowired
    CarePlansService carePlansService;

    @Autowired
    EquipmentService equipmentService;

    @Autowired
    RepairPlansService repairPlansService;


    /**
     * 跳转保养项页面
     * @param session
     * @return
     */
    @RequestMapping("/care")
    public String getCareHtml(HttpSession session){
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
        return "/jsp/care";
    }



    @ResponseBody
    @RequestMapping("/getCarePlansList")
    public Map<String,Object> getCarePlansList(HttpServletRequest request){
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("userID",userID);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = carePlansService.getCarePlansList(map);
//            List<Map<String,Object>> list1 = new ArrayList<>();
//            for(int i =0;i<list.size();i++){
//                String file = String.valueOf(list.get(i).get("carePlans_file"));
//                if(file.length()!=0 && !"null".equals(file)){
//                    String fileData[] =file.split(";");
//                    String filename = "";
//                    String filepath = "/uploadFile/";
//                    for(int j =0;j<fileData.length;j++){
//                        if(fileData[j].equals("")){
//                            continue;
//                        }else{
//                            Map<String,Object> map1 = new HashMap<>();
//                            String path = filepath + fileData[j];
//                            filename = fileData[j].substring(36);
//                            map1.put("filepath",path);
//                            map1.put("filename",filename);
//                            list1.add(map1);
//                        }
//                    }
//                    list.get(i).put("carePlans_file",list1);
//                }
//            }
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
     * 待保养
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping("/getWaitCare")
    public Map<String,Object> getWaitCare(HttpServletRequest request){
        String userID = request.getParameter("userID");
        Calendar cale = Calendar.getInstance();
        int year = cale.get(Calendar.YEAR);
        int month = cale.get(Calendar.MONTH) + 1;
        Map<String,Object> map = new HashMap<>();
        map.put("userID",userID);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            //得到设备保养项计划
            List<Map<String,Object>> list = carePlansService.getCarePlansList(map);
            //得到设备得维修单
            List<Map<String,Object>> repairList = repairPlansService.getRepairPlansList(map);
            //将小于当年得数据放在list1中
            List<Map<String,Object>> list1 = new ArrayList<>();
            //将等于当年得数据放在list2中
            List<Map<String,Object>> list2 = new ArrayList<>();
            for(int i=0;i<list.size();i++){
                int getYear = Integer.valueOf(list.get(i).get("carePlans_year").toString());
                if(year>getYear){
                    list1.add(list.get(i));
                }else if(year==getYear){
                    list2.add(list.get(i));
                }
            }
            //处理比今年小得年份得数据
            List<Map<String,Object>> list3 = getLittle(list1);
            //处理跟今年一样得数据
            List<Map<String,Object>> list4 = getBig(list2,month);
            list3.addAll(list4);
            if(repairList.size()!=0){
                for(int j=0;j<repairList.size();j++){
                    String repairPlans_equipmentID = String.valueOf(repairList.get(j).get("repairPlans_equipmentID"));
                    String repairPlans_year = String.valueOf(repairList.get(j).get("repairPlans_careYear"));
                    String repairPlans_month = String.valueOf(repairList.get(j).get("repairPlans_careMonth"));
                    for(int k=0;k<list3.size();k++){
                        String carePlans_equipmentID = String.valueOf(list3.get(k).get("carePlans_equipmentID"));
                        String carePlans_year = String.valueOf(list3.get(k).get("year"));
                        String carePlans_month = String.valueOf(list3.get(k).get("month"));
                        if(repairPlans_equipmentID.equals(carePlans_equipmentID) && repairPlans_year.equals(carePlans_year) && repairPlans_month.equals(carePlans_month)){
                            String repairPlans_state = String.valueOf(repairList.get(j).get("repairPlans_state"));
                            if("0".equals(repairPlans_state)){
                                list3.get(k).put("sign",1);
                            }else if("1".equals(repairPlans_state)){
                                list3.get(k).put("sign",2);
                            }else if("2".equals(repairPlans_state)){
                                list3.get(k).put("sign",3);
                            }
                            break;
                        }
                    }
                }
            }
            resultMap.put("data", list3);
            resultMap.put("code", "0");
            resultMap.put("msg", "");
            resultMap.put("count", "1");
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }



    //得到小于今年得数据
    public List<Map<String,Object>> getLittle(List<Map<String,Object>> list){
        List<Map<String,Object>> list1 = new ArrayList<>();
        for(int j=0;j<list.size();j++){
            Map<String,Object> map2 = new HashMap<>();
            String carePlans_equipmentID = String.valueOf(list.get(j).get("carePlans_equipmentID"));
            String year = String.valueOf(list.get(j).get("carePlans_year"));
            String department_ID = String.valueOf(list.get(j).get("department_ID"));
            String department_name = String.valueOf(list.get(j).get("department_name"));
            String user_name = String.valueOf(list.get(j).get("user_name"));
            map2.put("carePlans_equipmentID",carePlans_equipmentID);
            map2.put("year",year);
            map2.put("department_ID",department_ID);
            map2.put("department_name",department_name);
            map2.put("user_name",user_name);
            map2.put("sign",0);
            if(String.valueOf(list.get(j).get("Jan_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Jan"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","一月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("Feb_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Feb"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","二月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("March_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_March"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","三月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("April_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_April"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","四月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("May_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_May"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","五月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("June_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_June"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","六月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("July_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_July"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","七月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("August_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_August"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","八月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("Sept_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Sept"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","九月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("Oct_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Oct"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","十月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("Nov_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Nov"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","十一月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
            if(String.valueOf(list.get(j).get("Dec_state")).equals("0")){
                String data = String.valueOf(list.get(j).get("carePlans_Dec"));
                if(!"null".equals(data) && !"".equals(data)){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("month","十二月");
                    map1.put("data",data);
                    map1.putAll(map2);
                    list1.add(map1);
                }
            }
        }
        return list1;
    }


    public List<Map<String,Object>> getBig(List<Map<String,Object>> list,int month){
        List<Map<String,Object>> list1 = new ArrayList<>();
        String Month[] = {"一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"};
        for(int i=0;i<list.size();i++){
            Map<String,Object> map2 = new HashMap<>();
            String carePlans_equipmentID = String.valueOf(list.get(i).get("carePlans_equipmentID"));
            String year = String.valueOf(list.get(i).get("carePlans_year"));
            String department_ID = String.valueOf(list.get(i).get("department_ID"));
            String department_name = String.valueOf(list.get(i).get("department_name"));
            String user_name = String.valueOf(list.get(i).get("user_name"));
            map2.put("carePlans_equipmentID",carePlans_equipmentID);
            map2.put("year",year);
            map2.put("department_ID",department_ID);
            map2.put("department_name",department_name);
            map2.put("user_name",user_name);
            map2.put("sign",0);
            String a[] = new String[12];
            if(String.valueOf(list.get(i).get("Jan_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Jan"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[0] = data;
                }else{
                    a[0] = "";
                }
            }else{
                a[0] = "";
            }
            if(String.valueOf(list.get(i).get("Feb_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Feb"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[1] = data;
                }else{
                    a[1] = "";
                }
            }else{
                a[1] = "";
            }
            if(String.valueOf(list.get(i).get("March_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_March"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[2] = data;
                }else{
                    a[2] = "";
                }
            }else{
                a[2] = "";
            }
            if(String.valueOf(list.get(i).get("April_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_April"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[3] = data;
                }else{
                    a[3] = "";
                }
            }else{
                a[3] = "";
            }
            if(String.valueOf(list.get(i).get("May_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_May"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[4] = data;
                }else{
                    a[4] = "";
                }
            }else{
                a[4] = "";
            }
            if(String.valueOf(list.get(i).get("June_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_June"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[5] = data;
                }else{
                    a[5] = "";
                }
            }else{
                a[5] = "";
            }
            if(String.valueOf(list.get(i).get("July_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_July"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[6] = data;
                }else{
                    a[6] = "";
                }
            }else{
                a[6] = "";
            }
            if(String.valueOf(list.get(i).get("August_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_August"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[7] = data;
                }else{
                    a[7] = "";
                }
            }else{
                a[7] = "";
            }
            if(String.valueOf(list.get(i).get("Sept_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Sept"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[8] = data;
                }else{
                    a[8] = "";
                }
            }else{
                a[8] = "";
            }
            if(String.valueOf(list.get(i).get("Oct_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Oct"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[9] = data;
                }else{
                    a[9] = "";
                }
            }else{
                a[9] = "";
            }
            if(String.valueOf(list.get(i).get("Nov_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Nov"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[10] = data;
                }else{
                    a[10] = "";
                }
            }else{
                a[10] = "";
            }
            if(String.valueOf(list.get(i).get("Dec_state")).equals("0")){
                String data = String.valueOf(list.get(i).get("carePlans_Dec"));
                if(!"null".equals(data) && !"".equals(data)){
                    a[11] = data;
                }else{
                    a[11] = "";
                }
            }else{
                a[11] = "";
            }
            for(int j=0;j<month;j++){
                Map<String,Object> map = new HashMap<>();
                if(!"".equals(a[j])) {
                    map.put("month", Month[j]);
                    map.put("data", a[j]);
                    map.putAll(map2);
                    list1.add(map);
                }
            }
        }
        return list1;
    }



    //完成
    @RequestMapping("/successCarePlansState")
    public void successCarePlansState(HttpServletRequest request, HttpServletResponse response){
        String carePlans_equipmentID = request.getParameter("carePlans_equipmentID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        String data = request.getParameter("data");
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("carePlans_equipmentID",carePlans_equipmentID);
        map.put("year",year);
        map.put("data",data);
        map.put("userID",userID);
        Calendar cal = Calendar.getInstance();
        String date = cal.get(Calendar.YEAR)+"-"+(cal.get(Calendar.MONTH)+1)+"-"+cal.get(Calendar.DATE);
        map.put("date",date);
        map.put("careMonth",month);
        switch (month){
            case "一月":
                map.put("month","Jan_state");
                break;
            case "二月":
                map.put("month","Feb_state");
                break;
            case "三月":
                map.put("month","March_state");
                break;
            case "四月":
                map.put("month","April_state");
                break;
            case "五月":
                map.put("month","May_state");
                break;
            case "六月":
                map.put("month","June_state");
                break;
            case "七月":
                map.put("month","July_state");
                break;
            case "八月":
                map.put("month","August_state");
                break;
            case "九月":
                map.put("month","Sept_state");
                break;
            case "十月":
                map.put("month","Oct_state");
                break;
            case "十一月":
                map.put("month","Nov_state");
                break;
            case "十二月":
                map.put("month","Dec_state");
                break;
        }
        try{
            //改变完成状态
            carePlansService.successCarePlansState(map);
            //插入记录列表
            carePlansService.insertCareRecord(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    //取消完成
    @RequestMapping("/unSuccessCarePlansState")
    public void unSuccessCarePlansState(HttpServletRequest request, HttpServletResponse response){
        String carePlans_equipmentID = request.getParameter("carePlans_equipmentID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("carePlans_equipmentID",carePlans_equipmentID);
        map.put("careMonth",month);
        map.put("year",year);
        switch (month){
            case "一月":
                map.put("month","Jan_state");
                break;
            case "二月":
                map.put("month","Feb_state");
                break;
            case "三月":
                map.put("month","March_state");
                break;
            case "四月":
                map.put("month","April_state");
                break;
            case "五月":
                map.put("month","May_state");
                break;
            case "六月":
                map.put("month","June_state");
                break;
            case "七月":
                map.put("month","July_state");
                break;
            case "八月":
                map.put("month","August_state");
                break;
            case "九月":
                map.put("month","Sept_state");
                break;
            case "十月":
                map.put("month","Oct_state");
                break;
            case "十一月":
                map.put("month","Nov_state");
                break;
            case "十二月":
                map.put("month","Dec_state");
                break;
        }
        map.put("userID",userID);
        try{
            //取消完成
            carePlansService.unSuccessCarePlansState(map);
            //删除记录列表
            carePlansService.deleteCareRecord(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @ResponseBody
    @RequestMapping("/getCareRecord")
    public Map<String,Object> getCareRecord(HttpServletRequest request){
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("userID",userID);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = carePlansService.getCareRecord(map);
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
     * 撤销维修单
     * @param request
     * @param response
     */
    @RequestMapping("/cancelRepairBill")
    public void cancelRepairBill(HttpServletRequest request,HttpServletResponse response){
        String carePlans_equipmentID = request.getParameter("carePlans_equipmentID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        Map<String,Object> map = new HashMap<>();
        map.put("carePlans_equipmentID",carePlans_equipmentID);
        map.put("year",year);
        map.put("month",month);
        try{
            carePlansService.cancelRepairBill(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
