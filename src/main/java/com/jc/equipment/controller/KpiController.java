package com.jc.equipment.controller;

import com.jc.equipment.service.EquipmentService;
import com.jc.equipment.service.KpiService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class KpiController {

    @Autowired
    EquipmentService equipmentService;

    @Autowired
    KpiService kpiService;


    /**
     * 跳转kpi页面
     * @param session
     * @return
     */
    @RequestMapping("/kpi")
    public String getKpiHtml(HttpSession session){
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
        return "/jsp/kpi";
    }



    @RequestMapping("/getKpi")
    public void getKpi(HttpServletResponse response){
        try {
            //list:设备信息
            List<Map<String,Object>> list = kpiService.getEquipmentList();

            //list1:保养计划
            List<Map<String,Object>> list1 = kpiService.getCareList();

            //successList：完成列表
            List<Map<String,Object>> successList = kpiService.getSuccessCare();

            //list2：维修
            List<Map<String,Object>> list2 = kpiService.getRepairList();

            //list3：保养维修
            List<Map<String,Object>> list3 = kpiService.getCareRepair();


            //将list2中得零件全部改成零件名
            if(list2.size()!=0){
                for(int i=0;i<list2.size();i++){
                    String partID[] = String.valueOf(list2.get(i).get("repairRecord_partData")).split(",");
                    String partName = "";
                    for(int j=0;j<partID.length;j++){
                        Map<String,Object> map = new HashMap<>();
                        map.put("part",partID[j]);
                        partName += kpiService.getName(map) + ";";
                    }
                    list2.get(i).put("eq_partName",partName);
                }
            }

            //将保养完成项记录得延迟与否进行判断
            if(successList.size()!=0){
                successList = getSuccessCare(successList);
            }

            //将保养设备得状态合并（successList和list1）
            if(list1.size()!=0 && successList.size()!=0){
                list1 = getNewCareState(successList,list1);
            }

            //将保养项和维修项合并
            if(list1.size()!=0 && list2.size()!=0){
                list1 = getList(list1,list2);
            }

            //将保养项和保养维修合并(list1和list3)
            if(list1.size()!=0 && list3.size()!=0){
                list1 = getAll(list1,list3);
            }

            //同一个设备得各年记录合并
            if(list1.size()!=0){
                list1 = Merged(list1);
            }


            //将list2里面得零件id变成零件名称
//            if(list2.size()!=0){
//                for(int i =0;i<list2.size();i++){
//                    List<Map<String,Object>> list4 = new ArrayList<>();
//                    String part = list2.get(i).get("repairRecord_partData").toString();
//                    String data[] = part.split(",");
//                    if(data.length!=0){
//                        for(int j=0;j<data.length;j++){
//                            Map<String,Object> map = new HashMap<>();
//                            map.put("part",data[j]);
//                            list4.add(map);
//                        }
//                    }
//                    list4 = kpiService.getPartName(list4);
//                    list2.get(i).put("partName",list4);
//                }
//            }


            //设备保养项和设备详情合并
            if(list.size()!=0 && list1.size()!=0){
                list = getCare(list,list1);
            }



            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }




    //保养项延期情况
    public List<Map<String,Object>> getSuccessCare(List<Map<String,Object>> list){
        for(int i=0;i<list.size();i++){
            //计划完成月
            String careRecord_month = String.valueOf(list.get(i).get("careRecord_month"));
            switch (careRecord_month){
                case "一月":
                    careRecord_month="1";
                    break;
                case "二月":
                    careRecord_month="2";
                    break;
                case "三月":
                    careRecord_month="3";
                    break;
                case "四月":
                    careRecord_month="4";
                    break;
                case "五月":
                    careRecord_month="5";
                    break;
                case "六月":
                    careRecord_month="6";
                    break;
                case "七月":
                    careRecord_month="7";
                    break;
                case "八月":
                    careRecord_month="8";
                    break;
                case "九月":
                    careRecord_month="9";
                    break;
                case "十月":
                    careRecord_month="10";
                    break;
                case "十一月":
                    careRecord_month="11";
                    break;
                case "十二月":
                    careRecord_month="12";
                    break;
            }
            //实际完成月
            String month = String.valueOf(list.get(i).get("careRecord_date")).split("-")[1];
            String sign = "3";
            //如果月份相同，则如期完成
            if(careRecord_month.equals(month)){
                sign = "2";
            }
            list.get(i).put("successDate",list.get(i).get("careRecord_date"));
            list.get(i).put("sign",sign);
        }
        return list;
    }


    //合并保养项状态
    public List<Map<String,Object>> getNewCareState(List<Map<String,Object>> successList,List<Map<String,Object>> list1){
        for(int i=0;i<list1.size();i++){
            String carePlans_equipmentID = String.valueOf(list1.get(i).get("carePlans_equipmentID"));
            String carePlans_year = String.valueOf(list1.get(i).get("carePlans_year"));
            for(int j=0;j<successList.size();j++){
                String equipmentID = String.valueOf(successList.get(j).get("careRecord_equipmentID"));
                String year = String.valueOf(successList.get(j).get("careRecord_year"));
                //首先判断设备和年份是否相同，相同合并数据
                if(!carePlans_equipmentID.equals(equipmentID) || !carePlans_year.equals(year)){
                    continue;
                }
                String sign = String.valueOf(successList.get(j).get("sign"));
                String month = String.valueOf(successList.get(j).get("careRecord_month"));
                switch (month){
                    case "一月":
                        month = "Jan_state";
                        break;
                    case "二月":
                        month = "Feb_state";
                        break;
                    case "三月":
                        month = "March_state";
                        break;
                    case "四月":
                        month = "April_state";
                        break;
                    case "五月":
                        month = "May_state";
                        break;
                    case "六月":
                        month = "June_state";
                        break;
                    case "七月":
                        month = "July_state";
                        break;
                    case "八月":
                        month = "August_state";
                        break;
                    case "九月":
                        month = "Sept_state";
                        break;
                    case "十月":
                        month = "Oct_state";
                        break;
                    case "十一月":
                        month = "Nov_state";
                        break;
                    case "十二月":
                        month = "Dec_state";
                        break;
                }
                //延期
                if("3".equals(sign)){
                    list1.get(i).put(month,2);
                }else if("2".equals(sign)){
                    //如期
                    list1.get(i).put(month,1);
                }
                list1.get(i).put("successDate",successList.get(j).get("successDate"));
            }
        }
        return list1;
    }


    //保养项和维修项合并
    public List<Map<String,Object>> getAll(List<Map<String,Object>> list1,List<Map<String,Object>> list3){
        for(int i=0;i<list3.size();i++){
            String equipmentID = String.valueOf(list3.get(i).get("equipmentID"));
            String year = String.valueOf(list3.get(i).get("year"));
            String month = String.valueOf(list3.get(i).get("month"));
            for(int j=0;j<list1.size();j++){
                String carePlans_equipmentID = String.valueOf(list1.get(j).get("carePlans_equipmentID"));
                String carePlans_year = String.valueOf(list1.get(j).get("carePlans_year"));
                if(equipmentID.equals(carePlans_equipmentID) && year.equals(carePlans_year)){
                    switch (month){
                        case "一月":
                            month = "JanCare";
                            break;
                        case "二月":
                            month = "FebCare";
                            break;
                        case "三月":
                            month = "MarchCare";
                            break;
                        case "四月":
                            month = "AprilCare";
                            break;
                        case "五月":
                            month = "MayCare";
                            break;
                        case "六月":
                            month = "JuneCare";
                            break;
                        case "七月":
                            month = "JulyCare";
                            break;
                        case "八月":
                            month = "AugustCare";
                            break;
                        case "九月":
                            month = "SeptCare";
                            break;
                        case "十月":
                            month = "OctCare";
                            break;
                        case "十一月":
                            month = "NovCare";
                            break;
                        case "十二月":
                            month = "DecCare";
                            break;
                    }
                    String photo = String.valueOf(list3.get(i).get("photo"));
                    String remark = String.valueOf(list3.get(i).get("remark"));
                    list1.get(j).put(month+"pic",photo);
                    list1.get(j).put(month+"remark",remark);
                    break;
                }
            }
        }
        return list1;
    }



    public List<Map<String,Object>> getList(List<Map<String,Object>> list,List<Map<String,Object>> list1){
        for(int i=0;i<list1.size();i++){
            String equipmentID = String.valueOf(list1.get(i).get("repairRecord_equipmentID"));
            String date = String.valueOf(list1.get(i).get("repairRecord_date"));
            String year = date.split("-")[0];
            for(int j=0;j<list.size();j++){
                String id = String.valueOf(list.get(j).get("carePlans_equipmentID"));
                String Year = String.valueOf(list.get(j).get("carePlans_year"));
                if(equipmentID.equals(id) && year.equals(Year)){
                    String month = date.split("-")[1];
                    String month_data = "";
                    switch (month){
                        case "1":
                            month_data = "JanData";
                            break;
                        case "2":
                            month_data = "FebData";
                            break;
                        case "3":
                            month_data = "MarchData";
                            break;
                        case "4":
                            month_data = "AprilData";
                            break;
                        case "5":
                            month_data = "MayData";
                            break;
                        case "6":
                            month_data = "JuneData";
                            break;
                        case "7":
                            month_data = "JulyData";
                            break;
                        case "8":
                            month_data = "AugustData";
                            break;
                        case "9":
                            month_data = "SeptData";
                            break;
                        case "10":
                            month_data = "OctData";
                            break;
                        case "11":
                            month_data = "NovData";
                            break;
                        case "12":
                            month_data = "DecData";
                            break;
                    }
                    Map<String,Object> map = new HashMap<>();
                    List<Map<String,Object>> list2 = new ArrayList<>();
                    if(list1.get(i).containsKey("repairRecord_des")){
                        String repairRecord_des = String.valueOf(list1.get(i).get("repairRecord_des"));
                        map.put("repairRecord_des",repairRecord_des);
                    }
                    if(list1.get(i).containsKey("repairRecord_pic")){
                        String repairRecord_pic = String.valueOf(list1.get(i).get("repairRecord_pic"));
                        map.put("repairRecord_pic",repairRecord_pic);
                    }
                    if(list1.get(i).containsKey("eq_partName")){
                        String eq_partName = String.valueOf(list1.get(i).get("eq_partName"));
                        map.put("eq_partName",eq_partName);
                    }
                    String username = String.valueOf(list1.get(i).get("user_name"));
                    map.put("username",username);
                    map.put("year",year);
                    List<Map<String,Object>> list3 = new ArrayList<>();
                    list3.add(map);
                    list2.addAll(list3);
                    if(list.get(j).containsKey(month_data)){
                        //判断是否该月有数据，有数据就叠加
                        Map<String,Object> map3 = new HashMap<>();
                        List<Map<String,Object>> list4 = new ArrayList<>();
                        String s[] = list.get(j).get(month_data).toString().split("=");
                        String PIC =  s[1].split(",")[0];
                        String YEAR = s[2].split(",")[0];
                        String PART = s[3].split(",")[0];
                        String DES = s[4].split(",")[0];
                        String NAME = s[5].split("}]")[0];
                        map3.put("repairRecord_pic",PIC);
                        map3.put("year",YEAR);
                        map3.put("eq_partName",PART);
                        map3.put("repairRecord_des",DES);
                        map3.put("username",NAME);
                        list4.add(map3);
                        list2.addAll(list4);
                    }
                    list.get(j).put(month_data,list2);
                    break;
                }
            }
        }
        return list;
    }


    public List<Map<String,Object>> getCare(List<Map<String,Object>> list,List<Map<String,Object>> list1){
        for(int i=0;i<list.size();i++){
            String equipment_ID = String.valueOf(list.get(i).get("equipment_ID"));
            for(int j=0;j<list1.size();j++){
                String carePlans_equipmentID = String.valueOf(list1.get(j).get("carePlans_equipmentID"));
                if(carePlans_equipmentID.equals(equipment_ID)){
                    Map<String,Object> map = new HashMap<>();
                    map.put("list",list1.get(j).get("list"));
                    list.get(i).put("list",map);
                    break;
                }else{
                    continue;
                }
            }
        }
        return list;
    }


    //将同一个设备得不同年计划合并
    public List<Map<String,Object>> Merged(List<Map<String,Object>> list){
        List<Map<String,Object>> totalList = new ArrayList<>();
        while(0<list.size()){
            List<Map<String,Object>> list1 = new ArrayList<>();
            Map<String,Object> map = new HashMap<>();
            for(int i=0;i<list.size();i++){
                if(list1.size()!=0){
                    String carePlans_equipmentID = String.valueOf(list.get(i).get("carePlans_equipmentID"));
                    String equipmentID = String.valueOf(list1.get(0).get("carePlans_equipmentID"));
                    if(carePlans_equipmentID.equals(equipmentID)){
                        list1.add(list.get(i));
                        list.remove(i);
                        i--;
                    }
                }else{
                    list1.add(list.get(i));
                    String carePlans_equipmentID = String.valueOf(list1.get(0).get("carePlans_equipmentID"));
                    map.put("carePlans_equipmentID",carePlans_equipmentID);
                    list.remove(i);
                    i--;
                }
            }
            map.put("list",list1);
            totalList.add(map);
        }
        return totalList;
    }



    //得到保养项某年某月得详情
    @RequestMapping("/LookCare")
    public void LookCare(HttpServletResponse response, HttpServletRequest request){
        String equipment = request.getParameter("equipmentID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipment);
        map.put("year",year);
        try{
            List<Map<String,Object>> list = kpiService.getCare(map);
            String state = "";
            String Month = "";
            String month_care = "";
            switch (month){
                case "1":
                    state = "Jan_state";
                    Month = "一月";
                    month_care = "carePlans_Jan";
                    break;
                case "2":
                    state = "Feb_state";
                    Month = "二月";
                    month_care = "carePlans_Feb";
                    break;
                case "3":
                    state = "March_state";
                    Month = "三月";
                    month_care = "carePlans_March";
                    break;
                case "4":
                    state = "April_state";
                    Month = "四月";
                    month_care = "carePlans_April";
                    break;
                case "5":
                    state = "May_state";
                    Month = "五月";
                    month_care = "carePlans_May";
                    break;
                case "6":
                    state = "June_state";
                    Month = "六月";
                    month_care = "carePlans_June";
                    break;
                case "7":
                    state = "July_state";
                    Month = "七月";
                    month_care = "carePlans_July";
                    break;
                case "8":
                    state = "August_state";
                    Month = "八月";
                    month_care = "carePlans_August";
                    break;
                case "9":
                    state = "Sept_state";
                    Month = "九月";
                    month_care = "carePlans_Sept";
                    break;
                case "10":
                    state = "Oct_state";
                    Month = "十月";
                    month_care = "carePlans_Oct";
                    break;
                case "11":
                    state = "Nov_state";
                    Month = "十一月";
                    month_care = "carePlans_Nov";
                    break;
                case "12":
                    state = "Dec_state";
                    Month = "十二月";
                    month_care = "carePlans_Dec";
                    break;
            }
            String successDate = "";
            state = list.get(0).get(state).toString();
            if("0".equals(state)){

            }else{
                map.put("month",Month);
                String time = kpiService.getSuccess(map);
                successDate = time;
            }
            list.get(0).put("Month",Month);
            list.get(0).put("month_care",list.get(0).get(month_care));
            list.get(0).put("planDate",year+"年"+Month);
            list.get(0).put("successDate",successDate);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
