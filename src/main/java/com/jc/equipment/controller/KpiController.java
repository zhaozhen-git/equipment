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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            //list->设备ID(equipment_ID),设备名称(equipment_name),部门(department_name),购买时间(equipment_date)
            List<Map<String,Object>> list = kpiService.getEquipmentList();

            //list1->设备ID,保养年份,保养(一月份设备、二月份设备、。。。十二月份设备)，保养(一月份状态，二月份状态，。。。十二月状态)
            List<Map<String,Object>> list1 = kpiService.getCareList();

            //successList->保养项完成记录表
            List<Map<String,Object>> successList = kpiService.getSuccessCare();

            //list2->故障设备、计划年、计划月、维修零件
            List<Map<String,Object>> list2 = kpiService.getRepairList();


            //将保养完成项记录得延迟与否进行判断
            if(successList.size()!=0){
                successList = getSuccessCare(successList);
            }

            //将保养设备得状态合并（successList和list1）
            if(list1.size()!=0 && successList.size()!=0){
                list1 = getNewCareState(successList,list1);
            }

            //将保养项和维修项合并(list1和list2)
            if(list1.size()!=0 && list2.size()!=0){
                list1 = getAll(list1,list2);
            }

            //同一个设备得各年记录合并
            if(list1.size()!=0){
                list1 = Merged(list1);
            }

            //设备保养项和设备详情合并
            if(list.size()!=0 && list1.size()!=0){
                list1 = getCare(list,list1);
            }
            //维修得还没有搞好，谨记
            JSONObject obj = new JSONObject();
            obj.put("list1",list1);
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
    public List<Map<String,Object>> getAll(List<Map<String,Object>> list1,List<Map<String,Object>> list2){
        for(int i=0;i<list2.size();i++){
            String repairPlans_successDate = String.valueOf(list2.get(i).get("repairPlans_successDate"));
            String repairPlans_equipmentID = String.valueOf(list2.get(i).get("repairPlans_equipmentID"));
            String repairPlans_careYear = String.valueOf(list2.get(i).get("repairPlans_careYear"));
            for(int j=0;j<list1.size();j++){
                String carePlans_equipmentID = String.valueOf(list1.get(j).get("carePlans_equipmentID"));
                String carePlans_year = String.valueOf(list1.get(j).get("carePlans_year"));
                if(repairPlans_equipmentID.equals(carePlans_equipmentID) && repairPlans_careYear.equals(carePlans_year)){
                    String repairPlans_state = String.valueOf(list2.get(i).get("repairPlans_state"));
                    String repairPlans_careMonth = String.valueOf(list2.get(i).get("repairPlans_careMonth"));
                    String repairPlans_partID = String.valueOf(list2.get(i).get("repairPlans_partID"));
                    String month = "";
                    switch (repairPlans_careMonth){
                        case "一月":
                            month = "Jan";
                            break;
                        case "二月":
                            month = "Feb";
                            break;
                        case "三月":
                            month = "March";
                            break;
                        case "四月":
                            month = "April";
                            break;
                        case "五月":
                            month = "May";
                            break;
                        case "六月":
                            month = "June";
                            break;
                        case "七月":
                            month = "July";
                            break;
                        case "八月":
                            month = "August";
                            break;
                        case "九月":
                            month = "Sept";
                            break;
                        case "十月":
                            month = "Oct";
                            break;
                        case "十一月":
                            month = "Nov";
                            break;
                        case "十二月":
                            month = "Dec";
                            break;
                    }
                    if(!"null".equals(repairPlans_partID)){
                        list1.get(j).put(month,5);
                    }else{
                        if(repairPlans_state=="0"){
                            list1.get(j).put(month,0);
                        }else{
                            list1.get(j).put(month,1);
                        }
                    }
                    list1.get(j).put("repairPlans_successDate",repairPlans_successDate);
                    break;
                }
            }
        }
        return list1;
    }


    public List<Map<String,Object>> getCare(List<Map<String,Object>> list,List<Map<String,Object>> list1){
        for(int i=0;i<list1.size();i++){
            String carePlans_equipmentID = String.valueOf(list1.get(i).get("carePlans_equipmentID"));
            for(int j=0;j<list.size();j++){
                String equipment_ID = String.valueOf(list.get(j).get("equipment_ID"));
                String equipment_name = String.valueOf(list.get(j).get("equipment_name"));
                String department_name = String.valueOf(list.get(j).get("department_name"));
                String equipment_date = String.valueOf(list.get(j).get("equipment_date"));
                if(carePlans_equipmentID.equals(equipment_ID)){
                    list1.get(i).put("equipment_name",equipment_name);
                    list1.get(i).put("department_name",department_name);
                    list1.get(i).put("equipment_date",equipment_date);
                    break;
                }else{
                    continue;
                }
            }
        }
        return list1;
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
