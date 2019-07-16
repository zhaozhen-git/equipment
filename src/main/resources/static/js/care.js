var node;
var index;

//添加维修单
function addRepair(carePlans_equipmentID,year,month,department_name,department_ID) {
    layui.use('layer',function () {
        var layer = layui.layer;
        $("#equipment_ID").val(carePlans_equipmentID);
        $("#department_name").val(department_name);
        $("#department_ID").val(department_ID);
        $("#year").val(year);
        $("#user_name").val(username);
        $("#user_ID").val(id);
        $("#month").val(month);
        node = layer.open({
            title: '添加维修单'
            , type: 1
            , shift: 4
            , area: ['800px', '500px'] //宽高
            , content: $('#repair_add')
            ,cancel: function(index, layero){
                layer.close(node);
            }
        });
    })
}

//已维修单
function look(carePlans_equipmentID,year,month) {
    layui.use(['layer','form'],function () {
        var layer = layui.layer;
        var form = layui.form;
        //得到对应得维修单
        $.ajax({
                type: "post",
                url: 'LookRepairPlans?carePlans_equipmentID='+carePlans_equipmentID + '&year='+year+'&month='+month,
                dataType: "json",
                async: false,
                success: function (data) {
                    var data = data.list;
                    $("#look_year").val(year);
                    $("#look_month").val(month);
                    $("#equipmentID").val(data[0].repairPlans_equipmentID);
                    $("#departmentName").val(data[0].department_name);
                    $("#userName").val(data[0].user_name);
                    $("#date1").val(data[0].repairPlans_year);
                    $("#repairDes").val(data[0].repairPlans_des);
                    $("#repair_reason").val(data[0].repairPlans_reason);
                    $("#repairOperator").val(data[0].operator);
                    $("#repairDate").val(data[0].repairPlans_successDate);
                    $("#repair_part").val(data[0].partName);
                    form.render();
                    node = layer.open({
                        title: '查看维修单'
                        , type: 1
                        , shift: 4
                        , area: ['800px', '750px'] //宽高
                        , content: $('#repair_look')
                        ,cancel: function(index, layero){
                            layer.close(node);
                        }
                    });
                }
        })
    })
}



//查看维修单
function lookSuccess(carePlans_equipmentID,year,month) {
    layui.use(['layer','form'],function () {
        var layer = layui.layer;
        var form = layui.form;
        //得到对应得维修单
        $.ajax({
            type: "post",
            url: 'LookRepairPlans?carePlans_equipmentID='+carePlans_equipmentID + '&year='+year+'&month='+month,
            dataType: "json",
            async: false,
            success: function (data) {
                var data = data.list;
                $("#look_year").val(year);
                $("#look_month").val(month);
                $("#equipmentID").val(data[0].repairPlans_equipmentID);
                $("#departmentName").val(data[0].department_name);
                $("#userName").val(data[0].user_name);
                $("#date1").val(data[0].repairPlans_year);
                $("#repairDes").val(data[0].repairPlans_des);
                $("#repair_reason").val(data[0].repairPlans_reason);
                $("#repairOperator").val(data[0].operator);
                $("#repairDate").val(data[0].repairPlans_successDate);
                $("#success").css("display","none");
                form.render();
                node = layer.open({
                    title: '查看维修单'
                    , type: 1
                    , shift: 4
                    , area: ['800px', '600px'] //宽高
                    , content: $('#repair_look')
                    ,cancel: function(index, layero){
                        layer.close(node);
                    }
                });
            }
        })
    })
}

//完成
function success(carePlans_equipmentID,year,month,data) {
    layui.use(['layer','table'],function () {
        var layer = layui.layer;
        var table = layui.table;
        //完成对应得保养项
        node = layer.confirm('是否完成选中的保养项计划', {
            btn: ['确定', '取消'], title: "完成", btn1: function (index, layero) {
                $.ajax({
                    type: "post",
                    url: 'successCarePlansState?carePlans_equipmentID=' + carePlans_equipmentID + '&year='+ year + '&month='+month + '&data='+data+'&userID='+id,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        layer.close(node);
                        layer.msg('成功', {icon: 1});
                        table.reload('textReload', {
                            url: '/getWaitCare?userID=' + id,
                            method: 'post',
                        });
                        table.reload('repairRecord', {
                            url: '/getCareRecord?userID=' + id,
                            method: 'post',
                        });
                    }
                })
            },
            btn2: function (index, layero) {
                layer.close(node);
                table.reload('textReload', {
                    url: '/getWaitCare?userID=' + id,
                    method: 'post',
                });
            }
        });
    })
}




//撤销维修单
function cancel(carePlans_equipmentID,year,month) {
    layui.use(['layer','table'],function () {
        var layer = layui.layer;
        var table = layui.table;
        //完成对应得保养项
        node = layer.confirm('是否撤销选中的维修单', {
            btn: ['确定', '取消'], title: "完成", btn1: function (index, layero) {
                $.ajax({
                    type: "post",
                    url: 'cancelRepairBill?carePlans_equipmentID=' + carePlans_equipmentID + '&year='+ year + '&month='+month,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        layer.close(node);
                        layer.msg('成功', {icon: 1});
                        table.reload('textReload', {
                            url: '/getWaitCare?userID=' + id,
                            method: 'post',
                        });
                        table.reload('repairRecord', {
                            url: '/getCareRecord?userID=' + id,
                            method: 'post',
                        });
                    }
                })
            },
            btn2: function (index, layero) {
                layer.close(node);
                table.reload('textReload', {
                    url: '/getWaitCare?userID=' + id,
                    method: 'post',
                });
            }
        });
    })
}




//取消完成
function unSuccess(careRecord_equipmentID,year,month) {
    layui.use(['layer','table'],function () {
        var layer = layui.layer;
        var table = layui.table;
        //完成对应得保养项
        node = layer.confirm('是否取消完成选中的保养项记录', {
            btn: ['确定', '取消'], title: "完成", btn1: function (index, layero) {
                $.ajax({
                    type: "post",
                    url: 'unSuccessCarePlansState?carePlans_equipmentID=' + careRecord_equipmentID + '&year='+ year + '&month='+month +'&userID='+id,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        layer.close(node);
                        layer.msg('成功', {icon: 1});
                        table.reload('textReload', {
                            url: '/getWaitCare?userID=' + id,
                            method: 'post',
                        });
                        table.reload('repairRecord', {
                            url: '/getCareRecord?userID=' + id,
                            method: 'post',
                        });
                    }
                })
            },
            btn2: function (index, layero) {
                layer.close(node);
                table.reload('repairRecord', {
                    url: '/getCareRecord?userID=' + id,
                    method: 'post',
                });
            }
        });
    })
}


window.onload=function () {
    layui.use(['table','layer','form','element','laydate'], function() {
        var table = layui.table;
        var layer = layui.layer;
        var form = layui.form;
        var element = layui.element;
        var laydate = layui.laydate;

        // //日期
        laydate.render({
            elem: '#date'
        });


        //监听提交
        form.on('submit(demo)', function (data) {
            $.ajax({
                url: "/repairCarePlans",
                dataType: "json",
                data: data.field,
                success: function (result) {
                    layer.msg('添加成功', {icon: 1});
                    layer.close(node);
                    table.reload('textReload', {
                        url: '/getWaitCare?userID=' + id,
                        method: 'post',
                    });
                }
            })
            return false;
        });


        //确认维修单
        form.on('submit(demo2)', function (data) {
            var equipmentID = $("#equipmentID").val();
            var year = $("#look_year").val();
            var month = $("#look_month").val();
            $("#idBill").val(equipmentID);
            $("#yearBill").val(year);
            $("#monthBill").val(month);
            $("#receiver").val(username);
            $("#receiverID").val(id);
            index = layer.open({
                title: '确认维修单'
                , type: 1
                , shift: 4
                , area: ['700px', '400px'] //宽高
                , content: $('#repairBill')
                ,cancel:function () {
                    layer.close(index);
                }
            });
            return false;
        });


        //确认维修单得提交
        form.on('submit(demo3)', function (data) {
            $.ajax({
                url: "/submitBill",
                dataType: "json",
                data: data.field,
                success: function (result) {
                    layer.msg('添加成功', {icon: 1});
                    layer.close(index);
                    layer.close(node);
                    table.reload('textReload', {
                        url: '/getWaitCare?userID=' + id,
                        method: 'post',
                    });
                }
            })
            return false;
        });


        //修改密码
        form.on('submit(demo7)', function(data){
            var pass1 = $("#password1").val();
            var pass2 = $("#password2").val();
            $.ajax({
                url:'/changePassword',
                data:{'pass1':pass1,"pass2":pass2,"user":id},
                success:function (result) {
                    var data = JSON.parse(result);
                    if(data.msg==="0"){
                        $("#password1").val("");
                        $("#password2").val("");
                        layer.msg("原密码错误",{icon: 2});
                    }else{
                        layer.close(node);
                        layer.msg("成功,3秒后重新登录",{icon: 1});
                        setTimeout('location.href="/"',3000); //跳转
                    }
                }
            })
            return false;
        });

        //待保养项
        table.render({
            elem: '#waitCare'
            , url: '/getWaitCare?userID=' + id
            , title: '待保养项列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'carePlans_equipmentID', title: '设备编号', width: 120, align: 'center'}
                    , {field: 'department_ID', title: '部门ID', hide: true, width: 120, align: 'center'}
                    , {field: 'department_name', title: '所属部门', width: 120, align: 'center'}
                    , {field: 'user_name', title: '负责人', width: 120, align: 'center'}
                    , {field: 'year', title: '保养计划年份', width: 120, align: 'center'}
                    , {field: 'month', title: '保养计划时间', width: 120, align: 'center'}
                    , {field: 'data', title: '保养项', width: 500, align: 'center'}
                    , {field: 'sign', title: '维修单', width: 120,align: 'center'
                    , templet: function (d) {
                        if(d.sign===0){
                            return '<button style="background-color: #007DDB;color: white;padding: 3px" onclick="addRepair(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\',\''+d.department_name+'\',\''+d.department_ID+'\')">添加</button>';
                        }else if(d.sign===1){
                            return '未维修';
                        }else if(d.sign===2){
                            return '<button style="background-color: #FF5722;color: white;padding: 3px" onclick="look(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\')">已维修</button>';
                        }else if(d.sign===3){
                            return '<button style="background-color: #FF5722;color: white;padding: 3px" onclick="lookSuccess(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\')">查看</button>';
                        }
                    }}
                    , {field: 'data', title: '操作', width: 300,align: 'center'
                    , templet: function (d) {
                        var data = '<button style="background-color: #FF5722;color: white;padding: 3px;margin-right: 10px" onclick="cancel(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\')">撤销维修单</button>'
                        data+='<button style="background-color:#007DDB;color: white;padding: 3px" onclick="success(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\',\''+d.data+'\')">完成保养</button>';
                        return data;
                    }}
                ]
            ]
            , id: 'textReload'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });



        //保养记录
        table.render({
            elem: '#carePlans'
            , url: '/getCareRecord?userID=' + id
            , title: '保养记录列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'careRecord_equipmentID', title: '设备编号', width: 120, align: 'center'}
                    , {field: 'department_name', title: '部门',width: 120, align: 'center'}
                    , {field: 'user_name', title: '负责人', width: 120, align: 'center'}
                    , {field: 'careRecord_care', title: '保养项',width: 120, align: 'center'}
                    , {field: 'careRecord_year', title: '计划完成年', width: 120, align: 'center'}
                    , {field: 'careRecord_month', title: '计划完成月', width: 120, align: 'center'}
                    , {field: 'careRecord_date', title: '保养完成日期', width: 120, align: 'center'}
                    , {field: 'careRecord_date', title: '操作', width: 120,align: 'center'
                    , templet: function (d) {
                        return '<button style="background-color:#007DDB;color: white;padding: 3px" onclick="unSuccess(\''+d.careRecord_equipmentID+'\',\''+d.careRecord_year+'\',\''+d.careRecord_month+'\')">取消完成</button>';
                    }}
                ]
            ]
            , id: 'repairRecord'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });

    })
}


function setPassword() {
    layui.use('layer', function () {
        node = layer.open({
            title: '修改密码'
            , type: 1
            , shift: 4
            , area: ['400px', '300px'] //宽高
            , content: $('#passwordHtml')
            ,cancel:function () {
                $("#password1").val("");
                $("#password2").val("");
                layer.close(node);
            }
        });
    })
}