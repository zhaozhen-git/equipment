<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>保养项管理</title>
    <link rel="stylesheet" href="layui/css/layui.css">
    <script src="js/jquery-1.11.3.js"></script>
    <script src="layui/layui.js"></script>
    <script src="js/bootstrap.js"></script>
</head>
<body class="layui-layout-body">
<div class="layui-layout layui-layout-admin">
    <div class="layui-header">
        <div class="layui-logo">设备保养管理项目</div>
        <!-- 头部区域（可配合layui已有的水平导航） -->
        <ul class="layui-nav layui-layout-left">
            <li class="layui-nav-item"><a href="/kpi">首页</a></li>
            <li class="layui-nav-item"><a href="/equipment">设备管理</a></li>
            <li class="layui-nav-item layui-this"><a href="/care">保养项管理</a></li>
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
            <ul class="layui-tab-title">
                <li id="page_1" class="layui-this">待保养列表</li>
                <li id="page_2">保养记录</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" id="one">
                    <table id="waitCare" lay-filter="waitCare"></table>
                </div>
                <div class="layui-tab-item" id="two">
                    <table id="carePlans" lay-filter="carePlans"></table>
                </div>
            </div>
        </div>

        <div class="layui-footer" style="left:10px">
            <!-- 底部固定区域 -->
            © 捷昌线性驱动有限公司
        </div>
    </div>
</div>


<!--新增维修单-->
<div style="display: none" id="repair_add">
    <form class="layui-form" action="" style="margin: 20px">
        <input id="department_ID" name="department_ID" style="display: none">
        <input id="year" name="year" style="display: none">
        <input id="user_ID" name="user_ID" style="display: none">
        <input id="month" name="month" style="display: none">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label">设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_ID" id="equipment_ID" disabled="disabled" class="layui-input">
            </div>

            <!--申请部门-->
            <label class="layui-form-label">申请部门:</label>
            <div class="layui-input-inline">
                <input type="text" name="department_name" id="department_name" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--申请人-->
            <label class="layui-form-label">申请人:</label>
            <div class="layui-input-inline">
                <input type="text" name="user_name" id="user_name" disabled="disabled" class="layui-input">
            </div>

            <!--要求完成日期-->
            <label class="layui-form-label">要求日期:</label>
            <div class="layui-input-inline">
                <input type="text" name="date" id="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--故障描述-->
            <label class="layui-form-label"><span style="color: red">*</span>故障描述:</label>
            <div class="layui-input-inline">
                <textarea  name="repairReason" id="repairReason" placeholder="请输入故障描述" class="layui-textarea" style="width: 500px"></textarea>
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


<!--查看维修单-->
<div style="display: none" id="repair_look">
    <form class="layui-form" action="" style="margin: 20px">
        <input id="look_year" style="display: none">
        <input id="look_month" style="display: none">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label">设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" id="equipmentID" disabled="disabled" class="layui-input">
            </div>

            <!--申请部门-->
            <label class="layui-form-label">申请部门:</label>
            <div class="layui-input-inline">
                <input type="text" id="departmentName" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--申请人-->
            <label class="layui-form-label">申请人:</label>
            <div class="layui-input-inline">
                <input type="text" id="userName" disabled="disabled" class="layui-input">
            </div>

            <!--要求完成日期-->
            <label class="layui-form-label">要求日期:</label>
            <div class="layui-input-inline">
                <input type="text" id="date1" disabled="disabled" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--故障描述-->
            <label class="layui-form-label">故障描述:</label>
            <div class="layui-input-inline">
                <textarea  id="repairDes" disabled="disabled" placeholder="请输入故障描述" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">维修操作:</label>
            <div class="layui-input-inline">
                <textarea  id="repair_reason" disabled="disabled" placeholder="无" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <label class="layui-form-label">更换零件:</label>
            <div class="layui-input-inline">
                <textarea  id="repair_part" disabled="disabled" placeholder="无" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <!--维修人-->
            <label class="layui-form-label">维修人:</label>
            <div class="layui-input-inline">
                <input type="text" id="repairOperator" disabled="disabled" placeholder="无" autocomplete="off" class="layui-input">
            </div>

            <!--维修人-->
            <label class="layui-form-label">维修日期:</label>
            <div class="layui-input-inline">
                <input type="text" id="repairDate" disabled="disabled" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item" id="success">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo2">确认维修单</button>
                <button class="layui-btn" lay-submit="" lay-filter="demo1">关闭</button>

            </div>
        </div>
    </form>
</div>


<!--确认维修单--->
<div style="display:none;" id="repairBill">
    <form class="layui-form" action="" style="margin: 20px">
        <input style="display: none" id="idBill" name="equipmentID">
        <input style="display: none" id="yearBill" name="yearBill">
        <input style="display: none" id="monthBill" name="monthBill">
        <input style="display: none" id="receiverID" name="receiverID">
        <div class="layui-form-item">
            <label class="layui-form-label">验收情况</label>
            <div class="layui-input-inline">
                <select name="state" lay-verify="required" lay-search="">
                    <option value="">验收情况</option>
                    <option value="0">符合要求</option>
                    <option value="1">不符合要求</option>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <!--简要说明-->
            <label class="layui-form-label">简要说明:</label>
            <div class="layui-input-inline">
                <textarea name="describe" id="describe" placeholder="请输入简要说明" class="layui-textarea" style="width: 500px"></textarea>
            </div>
        </div>

        <div class="layui-form-item">
            <!--验收人-->
            <label class="layui-form-label">验收人:</label>
            <div class="layui-input-inline">
                <input type="text" name="receiver" id="receiver" disabled="disabled" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo3">确认</button>
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


<script>
    var id = "<%=session.getAttribute("account")%>";
    var username = "<%=session.getAttribute("username")%>"
</script>

<script src="js/care.js"></script>
</body>
</html>
