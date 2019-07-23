<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>维修管理</title>
    <link rel="stylesheet" href="layui/css/layui.css">
    <script src="js/jquery-1.11.3.js"></script>
    <script src="layui/layui.js"></script>
    <style>
        img:hover{
            cursor:pointer;
        }
        .btn-group span{
            margin-top: 5px;
            margin-left:30px
        }
        .btn-group button{
            margin-left:10px;
            margin-right: 5px;
            padding:6px 12px;
        }
        .span_style{
            border: 1px solid #e2e7d7;
            border-radius: 5px;
            width:500px;
            height: 150px;
            margin-top: 10px;
            margin-left: 110px;
        }
        #initNewMte{
            border: 1px solid #C9C9C9;
            margin: 20px 10px 0 10px;
            float: left;
        }
        .layui-table-cell {
            height: 80px;
            line-height: 80px;
        }
    </style>
</head>
<body class="layui-layout-body">
<div class="layui-layout layui-layout-admin">
    <div class="layui-header">
        <div class="layui-logo">设备保养管理项目</div>
        <!-- 头部区域（可配合layui已有的水平导航） -->
        <ul class="layui-nav layui-layout-left">
            <li class="layui-nav-item"><a href="/kpi">首页</a></li>
            <li class="layui-nav-item"><a href="/equipment">设备管理</a></li>
            <li class="layui-nav-item"><a href="/care">保养项管理</a></li>
            <li class="layui-nav-item layui-this"><a href="/repair">维修管理</a></li>
            <li class="layui-nav-item"><a href="/part">零件管理</a></li>
            <li class="layui-nav-item"><a href="/department">部门管理</a></li>
            <li class="layui-nav-item"><a href="/user">人员管理</a></li>
        </ul>

        <ul class="layui-nav layui-layout-right">
            <li class="layui-nav-item">
                <a href="javascript:;">
                    <img src="//tva1.sinaimg.cn/crop.0.0.118.118.180/5db11ff4gw1e77d3nqrv8j203b03cweg.jpg" class="layui-nav-img">
                    <%=session.getAttribute("username")%>
                </a>
                <dl class="layui-nav-child" style="text-align: center;">
                    <dd><span onclick="setPassword()" style="color: #00db42;cursor: pointer">修改密码</span></dd>
                </dl>
            </li>
            <li class="layui-nav-item"><a href="/">退出登录</a></li>
        </ul>
    </div>

    <div style="margin: 10px">
        <!-- 内容主体区域 -->
        <div class="demoTable" style="float: right;display: block;margin-right: 20px">
            按设备名称/部门/负责人：
            <div class="layui-inline">
                <input class="layui-input" name="id" id="demoReload" autocomplete="off">
            </div>
            <button class="layui-btn" data-type="reload">搜索</button>
        </div>
        <div class="layui-tab layui-tab-brief" style="padding-top:30px">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <table id="repair" lay-filter="repair"></table>
                </div>
            </div>

        </div>

        <div class="layui-footer" style="left:10px">
            <!-- 底部固定区域 -->
            © 捷昌线性驱动有限公司
        </div>
    </div>
</div>

<!--添加维修单-->
<div style="display: none" id="layer_add">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label"><span style="color: red">*</span>设备编号:</label>
            <div class="layui-input-inline">
                <select name="equipment_ID" id="equipment_add" lay-filter="equipmentID" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="btn-group">
                <label class="layui-form-label">更换零件：</label>
                <button type="button" class="btn" onclick="showAddBtn()"  id="new_btn" style="border-radius: 5px;background-color: #3c763d;color: white">新增</button>
                <button type="button" class="btn" id="showDelBtn" style="border-radius: 5px;background-color: #c9302c;color: white" onclick="showDeleteBtn()">删除</button>
            </div>
        </div>

        <div class="layui-form-item">
            <!--保养项目组-->
            <div class="row">
                <div class="col-lg-12 col-md-6 Maintenance-group">
                    <div class="span_style" id="careGroup">
                    </div>
                </div>
            </div>
        </div>


        <div class="layui-form-item">
            <label class="layui-form-label">选择图片:</label>
            <div class="layui-upload">
                <button type="button" class="layui-btn" id="photoList">多图片上传</button>
                <blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;margin-left: 110px;width:600px;">
                    预览图：
                    <div class="layui-upload-list" id="photo"></div>
                </blockquote>
            </div>
        </div>


        <div class="layui-form-item">
            <!--备注-->
            <label class="layui-form-label">填写备注:</label>
            <div class="layui-input-inline">
                <textarea name="reason" id="reason" placeholder="请输入备注" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>


<!--编辑维修单-->
<div style="display: none" id="layer_edit">
    <form class="layui-form" action="" style="margin: 20px">
        <input style="display: none" id="equipment_edit" name="equipment_ID">
        <input id="id" style="display: none" name="id">
        <div class="layui-form-item">
            <div class="btn-group">
                <label class="layui-form-label">更换零件：</label>
                <button type="button" class="btn" onclick="showAddBtn()"  id="new_btn1" style="border-radius: 5px;background-color: #3c763d;color: white">新增</button>
                <button type="button" class="btn" id="showDelBtn1" style="border-radius: 5px;background-color: #c9302c;color: white" onclick="showDeleteBtn1()">删除</button>
            </div>
        </div>

        <div class="layui-form-item">
            <!--保养项目组-->
            <div class="row">
                <div class="col-lg-12 col-md-6 Maintenance-group">
                    <div class="span_style" id="editGroup">
                    </div>
                </div>
            </div>
        </div>


        <div class="layui-form-item">
            <label class="layui-form-label">选择图片:</label>
            <div class="layui-upload">
                <button type="button" class="layui-btn" id="editPic">多图片上传</button>
                <blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;margin-left: 110px;width:600px;">
                    预览图：
                    <div class="layui-upload-list" id="pic"></div>
                </blockquote>
            </div>
        </div>


        <div class="layui-form-item">
            <!--备注-->
            <label class="layui-form-label">填写备注:</label>
            <div class="layui-input-inline">
                <textarea name="reason" id="remark" placeholder="请输入备注" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo1">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>



<div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:999;width:100%;height:100%;display:none;">
    <div id="innerdiv" style="position:absolute;">
        <img id="bigimg" style="border:5px solid #fff;" src="" />
    </div>
</div>



<%--<!--维修单-->--%>
<%--<div id="repairBill" style="display: none">--%>
    <%--<form class="layui-form" action="" style="margin: 20px">--%>
        <%--<div class="layui-form-item">--%>
            <%--<!--申请部门-->--%>
            <%--<label class="layui-form-label">申请部门:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="department_name" id="department_name" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>

            <%--<!--要求日期-->--%>
            <%--<label class="layui-form-label">要求日期:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="required_date" id="required_date" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--设备编号-->--%>
            <%--<label class="layui-form-label">设备编号:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="repair_equipmentID" id="repair_equipmentID" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--故障描述-->--%>
            <%--<label class="layui-form-label">故障描述:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<textarea type="text" name="repair_des" id="repair_des" disabled="disabled" class="layui-textarea" style="width: 500px"></textarea>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--申请人-->--%>
            <%--<label class="layui-form-label">申请人:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="repair_username" id="repair_username" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--维修记录-->--%>
            <%--<label class="layui-form-label">维修记录:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<textarea type="text" name="repair_reason" id="repair_reason" disabled="disabled" class="layui-textarea" style="width: 500px"></textarea>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--更换零件-->--%>
            <%--<label class="layui-form-label">更换零件:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<textarea type="text" name="change_part" id="change_part" disabled="disabled" class="layui-textarea" style="width: 500px"></textarea>--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--维修人-->--%>
            <%--<label class="layui-form-label">维修人:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="repair_operator" id="repair_operator" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>
        <%--</div>--%>

        <%--<div class="layui-form-item">--%>
            <%--<!--完成日期-->--%>
            <%--<label class="layui-form-label">完成日期:</label>--%>
            <%--<div class="layui-input-inline">--%>
                <%--<input type="text" name="repair_successDate" id="repair_successDate" disabled="disabled" class="layui-input">--%>
            <%--</div>--%>
        <%--</div>--%>
    <%--</form>--%>
<%--</div>--%>


<!--添加零件-->
<div id="part_add" style="display: none">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <label class="layui-form-label">选择零件:</label>
            <div class="layui-input-inline">
                <select name="part" id="part" lay-filter="part" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <!--零件详情-->
            <label class="layui-form-label">零件详情:</label>
            <div class="layui-input-inline">
                <textarea name="partDes" id="partDes" disabled="disabled" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo2">确定</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>



<!--密码-->
<div id="passwordHtml" style="display: none">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--原密码-->
            <label class="layui-form-label" style="width: auto;"><span style="color: red">*</span>请输入原密码:</label>
            <div class="layui-input-inline">
                <input type="text" name="password1" id="password1" lay-verify="required" autocomplete="off" placeholder="请输入原密码" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <!--新密码-->
            <label class="layui-form-label" style="width: auto"><span style="color: red">*</span>请输入新密码:</label>
            <div class="layui-input-inline">
                <input type="text" name="password2" id="password2" lay-verify="required" autocomplete="off" placeholder="请输入新密码" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo7">确定</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>


<!--时间线-->
<div style="display: none" id="timeLine">
    <div style="padding: 30px" id="timeData"></div>
</div>

<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-container">
        <button class="layui-btn" lay-event="add"><i class="layui-icon layui-icon-add-1"></i>新增</button>
        <button class="layui-btn" lay-event="update"><i class="layui-icon layui-icon-edit"></i>编辑</button>
        <button class="layui-btn layui-btn-danger" lay-event="delete"><i class="layui-icon layui-icon-delete"></i>删除</button>
    </div>
</script>



<script>
    var id = "<%=session.getAttribute("account")%>";
    var username = "<%=session.getAttribute("username")%>"
</script>

<script src="js/repair.js"></script>
</body>
</html>
