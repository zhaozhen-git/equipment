<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<html>
<head>
    <title>部门管理</title>
    <link rel="stylesheet" href="layui/css/layui.css">
    <script src="js/jquery-1.11.3.js"></script>
    <script src="layui/layui.js"></script>
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
            <li class="layui-nav-item"><a href="/repair">维修管理</a></li>
            <li class="layui-nav-item"><a href="/part">零件管理</a></li>
            <li class="layui-nav-item layui-this"><a href="/department">部门管理</a></li>
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

    <div>
        <!-- 内容主体区域 -->
        <div class="layui-tab layui-tab-brief" style="padding: 10px;">
            <table id="department" lay-filter="department"></table>
        </div>

        <div class="layui-footer" style="left:10px">
            <!-- 底部固定区域 -->
            © 捷昌线性驱动有限公司
        </div>
    </div>
</div>


<!----------------------------------------------------------------------------------------------->


<!--新增部门-->
<div style="display: none" id="layer_add">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--部门名称-->
            <label class="layui-form-label"><span style="color: red">*</span>部门名称:</label>
            <div class="layui-input-inline">
                <input type="text" name="department_name" lay-verify="required" placeholder="请输入部门名称" class="layui-input">
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


<!--编辑部门-->
<div style="display: none" id="layer_edit">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--部门名称-->
            <label class="layui-form-label"><span style="color: red">*</span>部门名称:</label>
            <div class="layui-input-inline">
                <input type="text" name="department_name" id="department_name" lay-verify="required" placeholder="请输入部门名称" class="layui-input">
                <input type="text" name="department_ID" id="department_ID" style="display: none">
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo2">立即提交</button>
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



<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-container">
        <button class="layui-btn" lay-event="add"><i class="layui-icon layui-icon-add-1"></i>新增</button>
        <button class="layui-btn layui-btn-warm" lay-event="update"><i class="layui-icon layui-icon-edit"></i>编辑</button>
        <button class="layui-btn layui-btn-danger" lay-event="delete"><i class="layui-icon layui-icon-delete"></i>删除</button>
    </div>
</script>


<script>
    var id = "<%=session.getAttribute("account")%>";
    var username = "<%=session.getAttribute("username")%>"
</script>
<script src="js/department.js"></script>

</body>
</html>
