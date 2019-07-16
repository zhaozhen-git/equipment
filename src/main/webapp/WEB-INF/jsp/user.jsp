<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <meta charset="UTF-8">
    <title>人员管理</title>
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
            <li class="layui-nav-item"><a href="/department">部门管理</a></li>
            <li class="layui-nav-item layui-this"><a href="/user">人员管理</a></li>
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
        <div class="layui-upload" style="display: inline-block">
            <button class="layui-btn layui-btn-warm layui-btn-radius" onclick="window.open('content/model.xlsx')"><i class="layui-icon layui-icon-template-1"></i>下载Excel模板</button>
            <button class="layui-btn layui-btn-normal layui-btn-radius" lay-event="file" id="file"><i class="layui-icon layui-icon-table"></i>选择文件</button><span id="fileName"></span>
            <button class="layui-btn layui-btn-radius" id="uploadFile" lay-event="uploadFile"><i class="layui-icon layui-icon-upload-circle"></i>开始上传</button>
        </div>
        <div class="demoTable" style="float: right;display: inline-block">
            按姓名/部门：
            <div class="layui-inline">
                <input class="layui-input" name="id" id="demoReload" autocomplete="off">
            </div>
            <button class="layui-btn" data-type="reload">搜索</button>
        </div>
        <!-- 内容主体区域 -->
        <div class="layui-tab layui-tab-brief">
            <table id="user" lay-filter="user"></table>
        </div>

        <div class="layui-footer" style="left:10px">
            <!-- 底部固定区域 -->
            © 捷昌线性驱动有限公司
        </div>
    </div>
</div>

<!-------------------------------------------------------------------------------------------->
<!--添加用户-->
<div style="display: none" id="layer_add">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--用户编号-->
            <label class="layui-form-label"><span style="color: red">*</span>员工工号:</label>
            <div class="layui-input-inline">
                <input type="text" name="user_ID" id="user_ID" lay-verify="required" placeholder="请输入员工工号" class="layui-input">
            </div>

            <!--姓名-->
            <label class="layui-form-label"><span style="color: red">*</span>员工姓名:</label>
            <div class="layui-input-inline">
                <input type="text" name="user_name" lay-verify="required" placeholder="请输入员工姓名" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--部门-->
            <label class="layui-form-label"><span style="color: red">*</span>选择部门:</label>
            <div class="layui-input-inline">
                <select name="department" id="department" lay-filter="department" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--员工类型-->
            <label class="layui-form-label"><span style="color: red">*</span>员工类型:</label>
            <div class="layui-input-inline">
                <select name="user_type" lay-filter="user_type" lay-verify="required" lay-search="">
                    <option value=""></option>
                    <option value="0">实习员工</option>
                    <option value="1">正式员工</option>
                </select>
            </div>

            <!--员工权限-->
            <label class="layui-form-label"><span style="color: red">*</span>员工权限:</label>
            <div class="layui-input-inline">
                <select name="user_role" id="user_role" lay-filter="user_role" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
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



<!--编辑用户-->
<div style="display: none" id="layer_edit">
    <form class="layui-form" action="" style="margin: 20px">
        <input type="text" name="user_ID" id="user_ID1" style="display:none;">
        <div class="layui-form-item">
            <!--姓名-->
            <label class="layui-form-label"><span style="color: red">*</span>员工姓名:</label>
            <div class="layui-input-inline">
                <input type="text" name="user_name" id="user_name" lay-verify="required" placeholder="请输入员工姓名" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--部门-->
            <label class="layui-form-label"><span style="color: red">*</span>选择部门:</label>
            <div class="layui-input-inline">
                <select name="department" id="department1" lay-filter="department1" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--员工类型-->
            <label class="layui-form-label"><span style="color: red">*</span>员工类型:</label>
            <div class="layui-input-inline">
                <select name="user_type" id="user_type" lay-filter="user_type1" lay-verify="required" lay-search="">
                    <option value=""></option>
                    <option value="0">实习员工</option>
                    <option value="1">正式员工</option>
                </select>
            </div>

            <!--员工权限-->
            <label class="layui-form-label"><span style="color: red">*</span>员工权限:</label>
            <div class="layui-input-inline">
                <select name="user_role" id="user_role1" lay-filter="user_role1" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
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
<script src="js/user.js"></script>

</body>
</html>
