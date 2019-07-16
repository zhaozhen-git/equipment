package com.jc.equipment.controller;
import com.jc.equipment.service.UserService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.Iterator;
import java.util.UUID;

@Controller
public class UploadController {


    @Autowired
    UserService userService;


    @ResponseBody
    @RequestMapping("/upload")
    public JSONObject uploadFile(HttpServletRequest request){
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //检查form中是否有enctype="multipart/form-data"
        JSONObject res = new JSONObject();
        JSONObject resUrl = new JSONObject();
        if(multipartResolver.isMultipart(request)){
            //将request变成多request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest)request;
            //获取multiRequest中所有的文件名
            Iterator iter = multiRequest.getFileNames();
            while(iter.hasNext()){
                //一次遍历所有的文件
                MultipartFile file = multiRequest.getFile(iter.next().toString());

                if(null== file) {
                    res.put("msg", "上传失败！");
                }else if(file!=null){
                    String filename = file.getOriginalFilename();//获取文件的名字
//                    String suffixFile = filename.substring(filename.lastIndexOf(".")+1);
                    String filePath = request.getSession().getServletContext().getRealPath("/uploadFile");
                    String newFileName = UUID.randomUUID()+filename;
                    File file1 = new File(filePath);
                    if (!file1.exists()){
                        file1.mkdirs();
                    }
                    String newFilePath = filePath + "\\"+ newFileName; //新文件的路径
                    try{
                        file.transferTo(new File(newFilePath));
                        resUrl.put("src", newFileName);
                        res.put("code", 0);
                        res.put("msg", "");
                        res.put("data", resUrl);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
        return res;
    }


    @RequestMapping(value="/uploadFile")
    public void uploadFile(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws Exception{
        String fileName = file.getOriginalFilename();
        JSONObject obj = new JSONObject();
        response.setContentType("text/html;charset=UTF-8");
        try{
            userService.info(fileName,file);
            obj.put("res","0");
            response.getWriter().println(obj);
        }catch (Exception e){
            obj.put("res",e.getCause().getMessage());
            response.getWriter().println(obj);
            e.printStackTrace();
        }

    }
}
