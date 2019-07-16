package com.jc.equipment.controller;


import com.jc.equipment.service.EquipmentService;
import com.jc.equipment.service.PartService;
import net.sf.json.JSONObject;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PartController {


    @Autowired
    PartService partService;

    @Autowired
    EquipmentService equipmentService;


    /**
     * 跳转零件页面
     * @param session
     * @return
     */
    @RequestMapping("/part")
    public String getPartHtml(HttpSession session){
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
        return "/jsp/part";
    }


    /**
     * 零件表格
     * @return
     */
    @ResponseBody
    @RequestMapping("/getPartList")
    public Map<String,Object> getPartList(){
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = partService.getPartList();
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
     * 插入零件信息
     * @param response
     * @param request
     */
    @RequestMapping("/insertPart")
    public void insertPart(HttpServletResponse response, HttpServletRequest request){
        String partName = request.getParameter("partName");
        String partDes = request.getParameter("partDes");
        try{
            Map<String,Object> map = new HashMap<>();
            int num = 1;
            String s = partService.getNum();
            if(s!=null){
                num = num + Integer.valueOf(s);
            }
            map.put("num",num);
            map.put("partName",partName);
            map.put("partDes",partDes);
            partService.insertPart(map);
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @RequestMapping("/deletePart")
    public void deletePart(HttpServletRequest request,HttpServletResponse response){
        String id = request.getParameter("id");
        String ID[] = id.split("[,]");
        List<Map<String,Object>> list = new ArrayList<>();
        for(int i =0;i<ID.length;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("ID",ID[i]);
            list.add(map);
        }
        try{
            partService.deletePart(list);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 得到零件
     * @param response
     */
    @RequestMapping("/getPart")
    public void getPart(HttpServletResponse response){
        try{
            List<Map<String,Object>> list =  partService.getPart();
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
