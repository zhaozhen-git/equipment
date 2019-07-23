<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>首页</title>
    <link rel="stylesheet" href="layui/css/layui.css">
    <script src="js/jquery-1.11.3.js"></script>
    <script src="layui/layui.js"></script>
    <script src="js/bootstrap.js"></script>
    <style>
        td{text-align: center;height: 30px;min-width: 30px}
        th{min-width: 100px;}
    </style>
</head>
<body class="layui-layout-body">
<div class="layui-layout layui-layout-admin">
    <div class="layui-header">
        <div class="layui-logo">设备保养管理项目</div>
        <!-- 头部区域（可配合layui已有的水平导航） -->
        <ul class="layui-nav layui-layout-left">
            <li class="layui-nav-item layui-this"><a href="/kpi">首页</a></li>
            <li class="layui-nav-item"><a href="/equipment">设备管理</a></li>
            <li class="layui-nav-item"><a href="/care">保养项管理</a></li>
            <li class="layui-nav-item"><a href="/repair">维修管理</a></li>
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

    <div>
        <!-- 内容主体区域 -->
        <div class="layui-tab layui-tab-brief" style="padding: 10px;">
            <div style="height: 5%;margin-left: 10px;display: inline-block;width: 60%">
                <button style="width: 40px;height:20px;background-color: #007DDB"></button><label>&nbsp;计划保养项</label>
                <span style="margin-left:30px;border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span><label>&nbsp;未完成</label>
                <span style="margin-left:30px;border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span><label>&nbsp;如期完成</label>
                <span style="margin-left:30px;border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span><label>&nbsp;延期完成</label>
                <span style="margin-left:30px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span><label>&nbsp;已维修</label>
                <span style="margin-left:30px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span><label>&nbsp;零件更改</label>
            </div>
            <div style="height: 5%;margin-right: 20px;float: right;display: inline-block">
                <input style="height: 30px;padding: 5px" type="text" placeholder="请输入设备编号" id="text"><button onclick="findEquipment()" value="查询" style="width: 60px;height: 30px;background-color: #007DDB;color: white;border: 0px solid;cursor: pointer">查询</button>
            </div>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" style=" overflow:scroll;height: 80%">
                    <table id="kpi" lay-filter="kpi" border="1" style="border: #007DDB;"></table>
                </div>
            </div>
        </div>

        <div class="layui-footer" style="left:10px">
            <!-- 底部固定区域 -->
            © 捷昌线性驱动有限公司
        </div>
    </div>
</div>



<div id="care_look" style="display: none;">
    <form class="layui-form" action="" style="margin: 20px">
        <input style="display: none" id="year">
        <input style="display: none" id="month">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label">设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_ID" id="equipment_ID" disabled="disabled" class="layui-input">
            </div>

            <!--部门-->
            <label class="layui-form-label">部门:</label>
            <div class="layui-input-inline">
                <input type="text" name="department_name" id="department_name" disabled="disabled" class="layui-input">
            </div>

            <!--负责人-->
            <label class="layui-form-label">负责人:</label>
            <div class="layui-input-inline">
                <input type="text" name="user_name" id="user_name" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--要求完成日期-->
            <label class="layui-form-label">要求日期:</label>
            <div class="layui-input-inline">
                <input type="text" name="date" id="date" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item" style="display: none" id="state1">
            <!--完成时间-->
            <label class="layui-form-label">完成时间:</label>
            <div class="layui-input-inline">
                <input type="text" name="successDate" id="successDate" class="layui-input" disabled="disabled"></input>
            </div>
        </div>

        <div class="layui-form-item" style="display: none" id="state2">
            <!--保养项-->
            <label class="layui-form-label">保养项:</label>
            <div class="layui-input-inline">
                <textarea type="text" name="care" id="care" style="width: 500px" disabled="disabled" class="layui-textarea"></textarea>
            </div>
        </div>

        <div class="layui-form-item" style="display: none" id="state3">
            <!--图片-->
            <label class="layui-form-label">图片:</label>
            <div class="layui-upload">
                <blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;margin-left: 110px;width:600px;">
                    预览图：
                    <div class="layui-upload-list" id="pic"></div>
                </blockquote>
            </div>
        </div>

        <div class="layui-form-item" style="display: none" id="state4">
            <!--备注-->
            <label class="layui-form-label">备注:</label>
            <div class="layui-input-inline">
                <textarea type="text" name="remark" id="remark" style="width: 500px" disabled="disabled" class="layui-textarea"></textarea>
            </div>
        </div>

        <div class="layui-form-item" style="display: none" id="state5">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo4">确认保养完成</button>
            </div>
        </div>
    </form>
</div>



<div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:999;width:100%;height:100%;display:none;">
    <div id="innerdiv" style="position:absolute;">
        <img id="bigimg" style="border:5px solid #fff;" src="" />
    </div>
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


<!--维修查看-->
<div id="repairLook" style="display: none">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label">设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" id="eq_ID" disabled="disabled" class="layui-input">
            </div>

            <!--用户名-->
            <label class="layui-form-label">用户名:</label>
            <div class="layui-input-inline">
                <input type="text" id="eq_name" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--保养项-->
            <label class="layui-form-label">更换零件:</label>
            <div class="layui-input-inline">
                <textarea type="text" id="eq_part" style="width: 500px" disabled="disabled" class="layui-textarea"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <!--备注-->
            <label class="layui-form-label">备注:</label>
            <div class="layui-input-inline">
                <textarea type="text" id="eq_remark" style="width: 500px" disabled="disabled" class="layui-textarea"></textarea>
            </div>
        </div>

        <label class="layui-form-label">图片:</label>
        <div class="layui-upload">
            <blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;margin-left: 110px;width:600px;">
                预览图：
                <div class="layui-upload-list" id="eq_pic"></div>
            </blockquote>
        </div>
    </form>
</div>



<script>
    var id = "<%=session.getAttribute("account")%>";
    var username = "<%=session.getAttribute("username")%>"
</script>
<script src="js/kpi.js"></script>

</body>
</html>
