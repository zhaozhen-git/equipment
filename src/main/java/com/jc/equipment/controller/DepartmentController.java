package com.jc.equipment.controller;

import com.jc.equipment.service.DepartmentService;
import com.jc.equipment.service.EquipmentService;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class DepartmentController {



    @Autowired
    DepartmentService departmentService;

    @Autowired
    EquipmentService equipmentService;



    /**
     * 跳转部门列表页面
     * @param session
     * @return
     */
    @RequestMapping("/department")
    public String getDepartmentHtml(HttpSession session){
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
        return "/jsp/department";
    }




    /**
     * 得到部门列表
     * @param response
     */
    @RequestMapping("/getDepartmentList")
    public void getDepartmentList(HttpServletResponse response){
        try {
            List<Map<String,Object>> list = departmentService.getDepartmentList();
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 表格展示部门列表
     * @return
     */
    @ResponseBody
    @RequestMapping("/getDepartment")
    public Map<String,Object> getDepartment(){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String,Object>> list = departmentService.getDepartmentList();
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
     * 部门(新增、编辑)
     * @param request
     * @param response
     */
    @RequestMapping("/editDepartment")
    public void editDepartment(HttpServletRequest request,HttpServletResponse response){
        String edit = request.getParameter("edit");
        String department_name = request.getParameter("department_name");
        Map<String,Object> map = new HashMap<>();
        map.put("department_name",department_name);
        try{
            if(edit.equals("insert")){
                int num = 0;
                num = departmentService.getMaxNumber();
                map.put("userID",num+1);
                departmentService.insertDepartment(map);
            }else if(edit.equals("update")){
                String userID = request.getParameter("department_ID");
                map.put("userID",userID);
                departmentService.updateDepartment(map);
            }
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 删除部门
     * @param response
     * @param request
     */
    @RequestMapping("/deleteDepartment")
    public void deleteDepartment(HttpServletResponse response,HttpServletRequest request){
        String id = request.getParameter("id");
        String ID[] = id.split("[,]");
        List<Map<String,Object>> list = new ArrayList<>();
        for(int i =0;i<ID.length;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("ID",ID[i]);
            list.add(map);
        }
        try{
            departmentService.deleteDepartment(list);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



}
