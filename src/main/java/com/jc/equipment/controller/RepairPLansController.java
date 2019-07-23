package com.jc.equipment.controller;

import com.jc.equipment.service.EquipmentService;
import com.jc.equipment.service.RepairPlansService;
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
import java.io.IOException;
import java.util.*;

@Controller
public class RepairPLansController {

    @Autowired
    RepairPlansService repairPlansService;

    @Autowired
    EquipmentService equipmentService;


    /**
     * 跳转维修页面
     * @param session
     * @return
     */
    @RequestMapping("/repair")
    public String getRepairHtml(HttpSession session){
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
        return "/jsp/repair";
    }



    @ResponseBody
    @RequestMapping("/getWaitRepair")
    public Map<String,Object> getWaitRepair(HttpServletRequest request){
        String username =request.getParameter("username");
        Map<String,Object> map2 = new HashMap<>();
        map2.put("username",username);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = repairPlansService.getWaitRepair(map2);
            if(list.size()!=0){
                for(int i=0;i<list.size();i++){
                    List<Map<String,Object>> list1 = new ArrayList<>();
                    List<Map<String,Object>> list3 = new ArrayList<>();
                    List<Map<String,Object>> list2 = new ArrayList<>();
                    String partData = String.valueOf(list.get(i).get("repairRecord_partData"));
                    String equipmentID = String.valueOf(list.get(i).get("repairRecord_equipmentID"));
                    if(partData.length()>0){
                        String data[] = partData.split(",");
                        for(int k =0;k<data.length;k++){
                            Map<String,Object> map = new HashMap<>();
                            map.put("data",data[k]);
                            list2.add(map);
                        }
                        list3 = repairPlansService.getCare(list2);
                    }
                    list.get(i).put("careList",list3);
                    String photo = String.valueOf(list.get(i).get("repairRecord_pic"));
                    if (photo.length() != 0 && !"null".equals(photo)) {
                        String fileData[] = photo.split(";");
                        String filename = "";
                        String filepath = "/uploadFile/";
                        for (int s = 0; s < fileData.length; s++) {
                            if (fileData[s].equals("")) {
                                continue;
                            } else {
                                Map<String, Object> map1 = new HashMap<>();
                                String path = filepath + fileData[s];
                                filename = fileData[s].substring(36);
                                map1.put("filepath", path);
                                map1.put("filename", filename);
                                list1.add(map1);
                            }
                        }
                        list.get(i).put("equipment_file",list1);
                    }else{
                        list.get(i).put("equipment_file","");
                    }
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
     * 删除记录单
     * @param request
     * @param response
     */
    @RequestMapping("/deleteRepair")
    public void deleteRepair(HttpServletRequest request,HttpServletResponse response) throws IOException {
        String id = request.getParameter("id");
        String repairRecord_pic = request.getParameter("repairRecord_pic");
        Map<String,Object> map = new HashMap<>();
        map.put("id",id);
        map.put("repairRecord_pic",repairRecord_pic);
        //删除本地图片
        if(repairRecord_pic.length()!=0){
            System.out.println(repairRecord_pic);
            String picList[] = repairRecord_pic.split(";");
            for(int i =0;i<picList.length;i++){
                String filepath = "/src/main/webapp/uploadFile/";
                filepath = filepath+picList[i];
                File file = new File("");
                String path = file.getCanonicalPath();
                String filePath1 = path.replace("\\","/");
                filepath = filePath1 + filepath;
                File file1 = new File(filepath);
                file1.delete();
            }
        }
        try {
            repairPlansService.deleteRepair(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 添加维修计划
     * @param request
     * @param response
     */
    @RequestMapping("/repairCarePlans")
    public void repairCarePlans(HttpServletRequest request, HttpServletResponse response){
        String equipment_ID = request.getParameter("equipment_ID");
        String department_ID = request.getParameter("department_ID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        String user_ID = request.getParameter("user_ID");
        String date = request.getParameter("date");
        String repairReason = request.getParameter("repairReason");
        Map<String,Object> map = new HashMap<>();
        map.put("equipment_ID",equipment_ID);
        map.put("department_ID",department_ID);
        map.put("user_ID",user_ID);
        map.put("repairReason",repairReason);
        map.put("year",date);
        map.put("careYear",year);
        map.put("careMonth",month);
        try{
            repairPlansService.insertRepairPlans(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","添加成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 查看维修计划
     * @param response
     * @param request
     */
    @RequestMapping("/LookRepairPlans")
    public void LookRepairPlans(HttpServletResponse response,HttpServletRequest request){
        String carePlans_equipmentID = request.getParameter("carePlans_equipmentID");
        String year = request.getParameter("year");
        String month = request.getParameter("month");
        Map<String,Object> map = new HashMap<>();
        map.put("carePlans_equipmentID",carePlans_equipmentID);
        map.put("year",year);
        map.put("month",month);
        try{
            List<Map<String,Object>> list = repairPlansService.LookRepairPlans(map);
            String partID = String.valueOf(list.get(0).get("repairPlans_partID"));
            String partData[] = partID.split(",");
            if(partData.length!=0){
                List<Map<String,Object>> list1 = new ArrayList<>();
                for(int i=0;i<partData.length;i++){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("partID",partData[i]);
                    list1.add(map1);
                }
                List<Map<String,Object>> list2 = repairPlansService.getPartName(list1);
                if(list2.size()!=0){
                    String s = "";
                    for(int j=0;j<list2.size();j++){
                        s+= list2.get(j).get("eq_partName")+",";
                    }
                    s = s.substring(0,s.length()-1);
                    list.get(0).put("partName",s);
                }
            }
            map.put("operatorID",String.valueOf(list.get(0).get("repairPlans_operatorID")));
            String operator = repairPlansService.getOperator(map);
            list.get(0).put("operator",operator);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 插入维修单
     * @param response
     * @param request
     */
    @RequestMapping("/repairBill")
    public void repairBill(HttpServletResponse response,HttpServletRequest request){
        //图片
        String photo = request.getParameter("photoList");
        String edit = request.getParameter("edit");
        String equipmentID = request.getParameter("equipment_ID");
        String reason = request.getParameter("reason");
        String partData = request.getParameter("partData");
        String userID = request.getParameter("userID");
        Calendar cal=Calendar.getInstance();
        String date = cal.get(Calendar.YEAR)+ "-" +(cal.get(Calendar.MONTH)+1) + "-" + cal.get(Calendar.DATE);
        Map<String,Object> map = new HashMap<>();
        map.put("equipmentID",equipmentID);
        if(photo.length()!=0){
            photo = photo.replaceAll("[;]{2,}",";");
            if(photo.substring(photo.length()-1)==";"){
                photo = photo.substring(0,photo.length()-1);
            }
        }
        map.put("photo",photo);
        map.put("reason",reason);
        map.put("date",date);
        map.put("partData",partData);
        map.put("userID",userID);
        try{
            if(edit.equals("insert")){
                int id = 0;
                String num = repairPlansService.getNum();
                if(num!=null){
                    id = Integer.valueOf(num) + 1;
                }
                map.put("id",id);
                repairPlansService.repairBill(map);
            }else if(edit.equals("update")){
                String id = request.getParameter("id");
                map.put("id",id);
                repairPlansService.updateBill(map);
            }

            JSONObject obj = new JSONObject();
            obj.put("msg","插入成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @RequestMapping("/getUsername")
    public void getUsername(HttpServletRequest request,HttpServletResponse response){
        String repairPlans_operatorID = request.getParameter("repairPlans_operatorID");
        Map<String,Object> map = new HashMap<>();
        map.put("repairPlans_operatorID",repairPlans_operatorID);
        try{
            String username = String.valueOf(repairPlansService.getUsername(map));
            JSONObject obj = new JSONObject();
            obj.put("username",username);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @RequestMapping("/getRepairRecord")
    @ResponseBody
    public Map<String,Object> getRepairRecord(HttpServletRequest request){
        String user_ID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("user_ID",user_ID);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = repairPlansService.getRepairRecord(map);
            if(list.size()!=0){
                for(int i=0;i<list.size();i++){
                    String operatorID = String.valueOf(list.get(i).get("repairPlans_operatorID"));
                    map.put("repairPlans_operatorID",operatorID);
                    String operator = repairPlansService.getUsername(map);
                    list.get(i).put("operator",operator);
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
     * 确认维修单
     * @param request
     * @param response
     */
    @Transactional
    @RequestMapping("/submitBill")
    public void submitBill(HttpServletRequest request,HttpServletResponse response){
        String idBill = request.getParameter("equipmentID");
        String yearBill = request.getParameter("yearBill");
        String monthBill = request.getParameter("monthBill");
        String state = request.getParameter("state");
        String describe = request.getParameter("describe");
        String receiverID = request.getParameter("receiverID");
        //日期这边要后台获取当天得日期
        Calendar cal = Calendar.getInstance();
        String date = cal.get(Calendar.YEAR)+"-"+(cal.get(Calendar.MONTH)+1)+"-"+cal.get(Calendar.DATE);
        Map<String,Object> map = new HashMap<>();
        map.put("idBill",idBill);
        map.put("yearBill",yearBill);
        map.put("monthBill",monthBill);
        //验收情况
        map.put("state",state);
        map.put("describe",describe);
        map.put("receiver",receiverID);
        map.put("receiveDate",date);
        try{
            //先改变状态
            repairPlansService.changeState(map);
            //再插入数据
            repairPlansService.insertRepairBill(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            throw new RuntimeException("确认维修单出错！");
        }
    }


    /**
     * 得到同款设备得维修记录
     * @param response
     * @param request
     */
    @RequestMapping("/getRepairWays")
    public void getRepairWays(HttpServletResponse response,HttpServletRequest request){
        String repairPlans_equipmentID = request.getParameter("repairPlans_equipmentID");
        Map<String,Object> map = new HashMap<>();
        map.put("repairPlans_equipmentID",repairPlans_equipmentID);
        try{
            String equipmentName = repairPlansService.getEquipmentName(map);
            map.put("equipmentName",equipmentName);
            List<Map<String,Object>> list = repairPlansService.getEquipmentID(map);
            List<Map<String,Object>> list1 = new ArrayList<>();
            if(list.size()!=0){
                for(int i=0;i<list.size();i++){
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("equipmentID",list.get(i).get("equipment_ID"));
                    list1.add(map1);
                }
            }
            //得到相应设备的维修记录
            List<Map<String,Object>> list2 = repairPlansService.getList(list1);
            if(list2.size()!=0){
                for(int j=0;j<list2.size();j++){
                    String operatorID = String.valueOf(list2.get(j).get("repairPlans_operatorID"));
                    Map<String,Object> map1 = new HashMap<>();
                    map1.put("repairPlans_operatorID",operatorID);
                    String operator = repairPlansService.getUsername(map1);
                    list2.get(j).put("operator",operator);
                }
                //得到更换零件得记录
                String partID = String.valueOf(list2.get(0).get("repairPlans_partID"));
                String partData[] = partID.split(",");
                if(partData.length!=0){
                    List<Map<String,Object>> list3 = new ArrayList<>();
                    for(int i=0;i<partData.length;i++){
                        Map<String,Object> map1 = new HashMap<>();
                        map1.put("partID",partData[i]);
                        list3.add(map1);
                    }
                    List<Map<String,Object>> list4 = repairPlansService.getPartName(list3);
                    if(list4.size()!=0){
                        String s = "";
                        for(int j=0;j<list4.size();j++){
                            s+= list4.get(j).get("eq_partName")+",";
                        }
                        s = s.substring(0,s.length()-1);
                        list2.get(0).put("partName",s);
                    }
                }
            }
            JSONObject obj = new JSONObject();
            obj.put("list",list2);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            throw new RuntimeException("获取维修记录出错！");
        }
    }


    /**
     * 得到对应用户相应得部门设备
     * @param response
     * @param request
     */
    @RequestMapping("/equipmentList")
    public void equipmentList(HttpServletResponse response,HttpServletRequest request){
        String userID = request.getParameter("userID");
        Map<String,Object> map = new HashMap<>();
        map.put("userID",userID);
        try{
            List<Map<String,Object>> list = repairPlansService.getEquipmentList(map);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 联动加载零件详情
     * @param request
     * @param response
     */
    @RequestMapping("/getPartDes")
    public void getPartDes(HttpServletRequest request,HttpServletResponse response){
        String part = request.getParameter("part");
        Map<String,Object> map = new HashMap<>();
        map.put("part",part);
        try{
            String data = repairPlansService.getPartDes(map);
            JSONObject obj = new JSONObject();
            obj.put("data",data);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
