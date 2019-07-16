package com.jc.equipment.controller;


import com.jc.equipment.service.EquipmentService;
import com.jc.equipment.service.UserService;
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
import java.io.IOException;
import java.util.*;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    EquipmentService equipmentService;

    @RequestMapping("/")
    public String login(HttpServletRequest request){
        Enumeration em = request.getSession().getAttributeNames();
        while(em.hasMoreElements()){
            request.getSession().removeAttribute(em.nextElement().toString());
        }
        return "redirect:/login";
    }


    @RequestMapping("/login")
    public String getLogin(){
        return "/jsp/login";
    }


    @RequestMapping("/loginError")
    public String getError(){
        return "/jsp/error";
    }


    /**
     * 跳转用户页面
     * @param session
     * @return
     */
    @RequestMapping("/user")
    public String getUserHtml(HttpSession session){
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
        return "/jsp/user";
    }




    /**
     * 获取对应部门下得用户
     * @param response
     * @param request
     */
    @RequestMapping("/getDepartmentUser")
    public void getDepartmentUser(HttpServletResponse response, HttpServletRequest request){
        String departmentID = request.getParameter("departmentID");
        Map<String,Object> map = new HashMap<>();
        map.put("departmentID",departmentID);
        try {
            List<Map<String,Object>> list = userService.getDepartmentUser(map);
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 用户列表
     * @return
     */
    @ResponseBody
    @RequestMapping("/getUserList")
    public Map<String,Object> getUserList(HttpServletRequest request){
        String username = request.getParameter("username");
        Map<String,Object> map = new HashMap<>();
        map.put("username",username);
        Map<String,Object> resultMap = new HashMap<>();
        try{
            List<Map<String,Object>> list = userService.getUserList(map);
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
     * 获取用户权限列表
     * @param response
     */
    @RequestMapping("/getRoleList")
    public void getRoleList(HttpServletResponse response){
        try{
            List<Map<String,Object>> list =  userService.getRoleList();
            JSONObject obj = new JSONObject();
            obj.put("list",list);
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 单个用户(新增、编辑)
     * @param response
     * @param request
     */
    @RequestMapping("editUser")
    public void editUser(HttpServletResponse response,HttpServletRequest request){
        String edit = request.getParameter("edit");
        String user_ID = request.getParameter("user_ID");
        String user_name = request.getParameter("user_name");
        String department = request.getParameter("department");
        String user_type = request.getParameter("user_type");
        String user_role = request.getParameter("user_role");
        Map<String,Object> map = new HashMap<>();
        map.put("user_ID",user_ID);
        map.put("user_name",user_name);
        map.put("department",department);
        map.put("user_type",user_type);
        map.put("user_role",user_role);
        try{
            if(edit.equals("insert")){
                //添加用户
                userService.insertUser(map);
                //添加用户权限
                userService.insertRole(map);
            }else if(edit.equals("update")){
                //更改用户
                userService.updateUser(map);
                //更改用户权限
                userService.updateRole(map);
            }
            JSONObject obj = new JSONObject();
            obj.put("msg","成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }



    @RequestMapping("/boolUser")
    public void boolUser(HttpServletRequest request,HttpServletResponse response){
        String user_ID = request.getParameter("user_ID");
        Map<String,Object> map = new HashMap<>();
        map.put("user_ID",user_ID);
        try {
            int x = userService.boolUser(map);
            JSONObject obj = new JSONObject();
            if(x>0){
                obj.put("msg","0");
            }else{
                obj.put("msg","1");
            }
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    @RequestMapping("/deleteUser")
    public void deleteUser(HttpServletResponse response,HttpServletRequest request){
        String id = request.getParameter("id");
        String ID[] = id.split("[,]");
        List<Map<String,Object>> list = new ArrayList<>();
        for(int i =0;i<ID.length;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("ID",ID[i]);
            list.add(map);
        }
        try{
            userService.deleteUser(list);
            JSONObject obj = new JSONObject();
            obj.put("msg","删除成功");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().println(obj);
        }catch (Exception e){
            e.printStackTrace();
        }

    }


    @RequestMapping("/changePassword")
    public void changePassword(HttpServletRequest request,HttpServletResponse response) throws IOException {
        String user = request.getParameter("user");
        String pass1 = request.getParameter("pass1");
        String pass2 = request.getParameter("pass2");
        Map<String,Object> map = new HashMap<>();
        map.put("user",user);
        map.put("pass2",pass2);
        String password = userService.getUserPassword(map);
        String msg = "0";
        if(pass1.equals(password)){
            //进行修改秘密
            userService.changePassword(map);
            msg = "1";
        }
        JSONObject obj = new JSONObject();
        obj.put("msg", msg);
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().println(obj.toString());
    }


}
