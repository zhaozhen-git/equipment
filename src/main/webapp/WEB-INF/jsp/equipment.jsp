<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>设备管理</title>
    <link rel="stylesheet" href="layui/css/layui.css">
    <%--<link rel="stylesheet" type="text/css" href="css/bootstrap.css">--%>
    <script src="js/jquery-1.11.3.js"></script>
    <script src="layui/layui.js"></script>
    <script src="js/bootstrap.js"></script>

    <style>
        /*保养项样式*/
        img:hover{
            cursor:pointer;
        }
        .btn-group span{
            margin-top: 5px;
        }
        .btn-group button{
            margin-right: 5px;
        }
        .span_style{
            border: 4px solid #93D1FF;
            border-radius: 5px;
            width:800px;
            height: 150px;
            margin-top: 10px;
        }
        #initNewMte{
            border: 1px solid #C9C9C9;
            margin: 20px 10px 0 10px;
            float: left;
        }
        /*月份框样式*/
        .Months-group{
            margin-top:20px;
        }
        /*#January,#February,#March,#April,#May,#June,#July,#August,#September,#October,#November,#December*/
        .months>div{
            display: inline-block;
            border: 3px solid #93D1FF;
            border-radius: 5px;
            width: 420px;
            height: 120px;
            overflow-x: hidden;
            overflow-y: auto;
            margin-right: 15px;
            margin-bottom: 15px;
        }
        .months b{
            float: left;
            width: 37px;
            height: 22px;
            margin-top:8px;margin-left:5px;
            background-color:#ec971f;
            border-radius: 5px;
            font-size: 18px;
        }
        /*月份内保养项样式*/
        #newAddMte{
            margin: 2px;
            background-color: #f7ecb5;
            margin-left: 5px;
            margin-top: 5px;
            float: left;
        }
        .displayChange{
            display: block;
        }
        .btn{
            padding:6px 12px
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
            <li class="layui-nav-item layui-this"><a href="/equipment">设备管理</a></li>
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
            <ul class="layui-tab-title" style="width: 50%;display: inline-block">
                <li id="page_1" class="layui-this">设备列表</li>
                <li id="page_2">设备保养项计划</li>
            </ul>
            <div class="demoTable" style="float: right;display: inline-block;margin-right: 20px">
                按设备名称/部门/负责人：
                <div class="layui-inline">
                    <input class="layui-input" name="id" id="demoReload" autocomplete="off">
                </div>
                <button class="layui-btn" data-type="reload">搜索</button>
            </div>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show" id="one">
                    <table id="equipment" lay-filter="equipment"></table>
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

<!-- --------------------------------------------------------------------------- -->
<!--新增-->
<div style="display: none" id="layer_add">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label"><span style="color: red">*</span>设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_ID" lay-verify="required" placeholder="请输入设备编号" class="layui-input">
            </div>

            <!--设备名称-->
            <label class="layui-form-label"><span style="color: red">*</span>设备名称:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_name" lay-verify="required" placeholder="请输入设备名称" class="layui-input">
            </div>

            <!--设备类型-->
            <label class="layui-form-label"><span style="color: red">*</span>设备类型:</label>
            <div class="layui-input-inline">
                <select name="equipment_type" lay-filter="type" lay-verify="required" lay-search="">
                    <option value=""></option>
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <!--设备规格-->
            <label class="layui-form-label"><span style="color: red">*</span>设备规格:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_size" lay-verify="required" placeholder="请输入设备规格" class="layui-input">
            </div>

            <!--设备厂家-->
            <label class="layui-form-label"><span style="color: red">*</span>设备厂家:</label>
            <div class="layui-input-inline">
                <input type="text" style="width: 264%" name="equipment_company" lay-verify="required" placeholder="请输入设备厂家" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--所属部门-->
            <label class="layui-form-label"><span style="color: red">*</span>所属部门:</label>
            <div class="layui-input-inline">
                <select name="departmentID" id="departmentID" lay-filter="departmentID" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--负责人-->
            <label class="layui-form-label"><span style="color: red">*</span>负责人:</label>
            <div class="layui-input-inline">
                <select name="userID" id="userID" lay-filter="userID" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--购买日期-->
            <label class="layui-form-label">购买日期:</label>
            <div class="layui-input-inline">
                <input type="text" name="date" id="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>

        <!--备注-->
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注:</label>
            <div class="layui-input-inline">
                <textarea placeholder="请输入备注内容" class="layui-textarea" style="width: 500px;height:200px" name="remark"></textarea>
            </div>
        </div>

        <!--文件-->
        <div class="row">
            <!--文件上传-->
            <div class="layui-upload">
                <button type="button" class="layui-btn layui-btn-normal" id="supplierList">选择文件上传(小于50MB)</button>
                <button type="button" class="layui-btn" id="supplierListAction">开始上传</button>
                <div class="layui-upload-list">
                    <table class="layui-table">
                        <thead>
                        <tr><th>文件名</th>
                            <th>大小</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr></thead>
                        <tbody id="file"></tbody>
                    </table>
                </div>
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


<!--编辑-->
<div style="display: none" id="layer_edit">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备编号-->
            <label class="layui-form-label"><span style="color: red">*</span>设备编号:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_ID" id="equipment_ID" lay-verify="required" placeholder="请输入设备编号" class="layui-input">
            </div>

            <!--设备名称-->
            <label class="layui-form-label"><span style="color: red">*</span>设备名称:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_name" id="equipment_name" lay-verify="required" placeholder="请输入设备名称" class="layui-input">
            </div>

            <!--设备类型-->
            <label class="layui-form-label"><span style="color: red">*</span>设备类型:</label>
            <div class="layui-input-inline">
                <select name="equipment_type" id="equipment_type" lay-filter="type" lay-verify="required" lay-search="">
                    <option value=""></option>
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
        </div>

        <div class="layui-form-item">
            <!--设备规格-->
            <label class="layui-form-label"><span style="color: red">*</span>设备规格:</label>
            <div class="layui-input-inline">
                <input type="text" name="equipment_size" id="equipment_size" lay-verify="required" placeholder="请输入设备规格" class="layui-input">
            </div>

            <!--设备厂家-->
            <label class="layui-form-label"><span style="color: red">*</span>设备厂家:</label>
            <div class="layui-input-inline">
                <input type="text" style="width: 264%" id="equipment_company" name="equipment_company" lay-verify="required" placeholder="请输入设备厂家" class="layui-input">
            </div>
        </div>

        <div class="layui-form-item">
            <!--所属部门-->
            <label class="layui-form-label"><span style="color: red">*</span>所属部门:</label>
            <div class="layui-input-inline">
                <select name="departmentID" id="departmentID1" lay-filter="departmentID1" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--负责人-->
            <label class="layui-form-label"><span style="color: red">*</span>负责人:</label>
            <div class="layui-input-inline">
                <select name="userID" lay-filter="userID" id="userID1" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>

            <!--购买日期-->
            <label class="layui-form-label">购买日期:</label>
            <div class="layui-input-inline">
                <input type="text" name="date" id="date1" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
            </div>
        </div>

        <!--备注-->
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注:</label>
            <div class="layui-input-inline">
                <textarea placeholder="请输入备注内容" id="remark" class="layui-textarea" style="width: 500px;height:200px" name="remark"></textarea>
            </div>
        </div>

        <!--文件-->
        <div class="row">
            <!--文件上传-->
            <div class="layui-upload">
                <button type="button" class="layui-btn layui-btn-normal" id="supplierList1">选择文件上传(小于50MB)</button>
                <button type="button" class="layui-btn" id="supplierListAction1">开始上传</button>
                <div class="layui-upload-list">
                    <table class="layui-table">
                        <thead>
                        <tr><th>文件名</th>
                            <th>大小</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr></thead>
                        <tbody id="file1"></tbody>
                    </table>
                </div>
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


<!--保养项列表-->
<div style="display: none" id="care">
    <table id="careTable" lay-filter="careTable"></table>
</div>

<!--新增保养项-->
<div style="display: none" id="index_add">
    <form class="layui-form" action="" style="margin: 20px">
        <input style="display: none" id="equipment_add" name="equipment_ID">
        <div class="layui-form-item">
            <!--设备保养项-->
            <label class="layui-form-label"><span style="color: red">*</span>保养项计划:</label>
            <div class="layui-input-inline">
                <input type="text" name="careData" lay-verify="required" placeholder="请输入保养项计划内容" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo3">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>


<!--编辑保养项-->
<div style="display: none" id="index_edit">
    <form class="layui-form" action="" style="margin: 20px">
        <input style="display: none" id="equipment_edit" name="equipment_ID">
        <input style="display: none" id="care_edit" name="care_ID">
        <div class="layui-form-item">
            <!--设备保养项-->
            <label class="layui-form-label"><span style="color: red">*</span>保养项计划:</label>
            <div class="layui-input-inline">
                <input type="text" name="careData" id="careData" lay-verify="required" placeholder="请输入保养项计划内容" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo4">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>




<!--设备保养项计划----------------------------------------->
<div id="plan_add" style="display: none">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备保养项-->
            <label class="layui-form-label"><span style="color: red">*</span>选择设备:</label>
            <div class="layui-input-inline">
                <select name="equipmentID" id="equipmentID" lay-filter="equipmentID" lay-verify="required" lay-search="">
                    <option value=""></option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="btn-group">
                <span style="float: left;">保养项操作按钮：</span>
                <button type="button" class="btn" onclick="showAddBtn()"  id="new_btn" style="border-radius: 5px;background-color: #3c763d;color: white">新增</button>
                <button type="button" class="btn" id="showDelBtn" style="border-radius: 5px;background-color: #c9302c;color: white" onclick="showDeleteBtn()">删除</button>
            </div>
        </div>
        <!--保养项目组-->
        <div class="row">
            <div class="col-lg-12 col-md-6 Maintenance-group">
                <div class="span_style" id="careGroup">
                </div>
            </div>
        </div>
        <!--月份项目组-->
        <div class="row">
            <div class="col-lg-12 col-md-6 Months-group">
                <div class="months">
                    <div id="January" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="1月">
                        <b id="mon">一月</b>
                    </div>
                    <div id="February" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="2月">
                        <b id="mon">二月</b>
                    </div>
                    <div id="March" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="3月">
                        <b id="mon">三月</b>
                    </div>
                    <div id="April" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="4月">
                        <b id="mon">四月</b>
                    </div>
                    <div id="May" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="5月">
                        <b id="mon">五月</b>
                    </div>
                    <div id="June" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="6月">
                        <b id="mon">六月</b>
                    </div>
                    <div id="July" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="7月">
                        <b id="mon">七月</b>
                    </div>
                    <div id="August" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="8月">
                        <b id="mon">八月</b>
                    </div>
                    <div id="September" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="9月">
                        <b id="mon">九月</b>
                    </div>
                    <div id="October" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="10月">
                        <b id="mon">十月</b>
                    </div >
                    <div id="November" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="11月">
                        <b id="mon" style="width:55px;">十一月</b>
                    </div>
                    <div id="December" ondrop="drop(this)" ondragover="allowDrop(event,this)" value="12月">
                        <b id="mon" style="width:55px;">十二月</b>
                    </div>
                </div>
            </div>
        </div>
        <%--<!--文件-->--%>
        <%--<div class="row">--%>
            <%--<!--文件上传-->--%>
            <%--<div class="layui-upload">--%>
                <%--<button type="button" class="layui-btn layui-btn-normal" id="supplierList">选择文件上传(小于50MB)</button>--%>
                <%--<button type="button" class="layui-btn" id="supplierListAction">开始上传</button>--%>
                <%--<div class="layui-upload-list">--%>
                    <%--<table class="layui-table">--%>
                        <%--<thead>--%>
                        <%--<tr><th>文件名</th>--%>
                            <%--<th>大小</th>--%>
                            <%--<th>状态</th>--%>
                            <%--<th>操作</th>--%>
                        <%--</tr></thead>--%>
                        <%--<tbody id="file"></tbody>--%>
                    <%--</table>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo6">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
</div>


<div style="display: none" id="care_add">
    <form class="layui-form" action="" style="margin: 20px">
        <div class="layui-form-item">
            <!--设备保养项-->
            <label class="layui-form-label"><span style="color: red">*</span>保养项:</label>
            <div class="layui-input-inline">
                <input type="text" name="careData" id="addCareData" lay-verify="required" placeholder="请输入保养项内容" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo5">确定</button>
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


<script>
    var id = "<%=session.getAttribute("account")%>";
    var username = "<%=session.getAttribute("username")%>"
</script>


<script type="text/html" id="toolbarDemo">
    <div class="layui-btn-container">
        <button class="layui-btn" lay-event="add"><i class="layui-icon layui-icon-add-1"></i>新增</button>
        <button class="layui-btn layui-btn-warm" lay-event="update"><i class="layui-icon layui-icon-edit"></i>编辑</button>
        <button class="layui-btn layui-btn-danger" lay-event="delete"><i class="layui-icon layui-icon-delete"></i>删除</button>
        <button class="layui-btn" lay-event="care"><i class="layui-icon layui-icon-edit"></i>编辑设备保养项</button>
    </div>
</script>

<script type="text/html" id="toolbar">
    <div class="layui-btn-container">
        <button class="layui-btn" lay-event="add"><i class="layui-icon layui-icon-add-1"></i>新增</button>
        <button class="layui-btn layui-btn-warm" lay-event="update"><i class="layui-icon layui-icon-edit"></i>编辑</button>
        <button class="layui-btn layui-btn-danger" lay-event="delete"><i class="layui-icon layui-icon-delete"></i>删除</button>
    </div>
</script>

<script type="text/html" id="toolbarList">
    <div class="layui-btn-container">
        <button class="layui-btn" lay-event="add"><i class="layui-icon layui-icon-add-1"></i>编辑设备计划</button>
        <button class="layui-btn layui-btn-danger" lay-event="delete"><i class="layui-icon layui-icon-delete"></i>删除</button>
    </div>
</script>

<script src="js/equipment.js"></script>
</body>
</html>
