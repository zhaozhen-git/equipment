var node;
var index;

function look(department_name,repairPlans_year,repairPlans_equipmentID,repairPlans_des,user_name,repairPlans_reason,partName,repairPlans_operatorID,repairPlans_successDate){
    layui.use(['layer','form'], function() {
        var layer = layui.layer;
        var form = layui.form;
        $.ajax({
            url:'/getUsername',
            data:{'repairPlans_operatorID':repairPlans_operatorID},
            success:function (result) {
                var data = JSON.parse(result);
                var username = data.username;
                $("#repair_operator").val(username);
            }
        })
        $("#department_name").val(department_name);
        $("#required_date").val(repairPlans_year);
        $("#repair_equipmentID").val(repairPlans_equipmentID);
        $("#repair_des").val(repairPlans_des);
        $("#repair_username").val(user_name);
        $("#repair_reason").val(repairPlans_reason);
        $("#change_part").val(partName);
        $("#repair_successDate").val(repairPlans_successDate);
        form.render();
        node = layer.open({
            title: '设施维修申请表'
            , type: 1
            , shift: 5
            , area: ['800px', '750px'] //宽高
            , content: $('#repairBill')
        });
    })
}


//查看维修单记录
function lookRepairBill(repairPlans_equipmentID){
    layui.use(['layer','form'], function() {
        var layer = layui.layer;
        var form = layui.form;
        $.ajax({
            url:'/getRepairWays',
            data:{'repairPlans_equipmentID':repairPlans_equipmentID},
            success:function (result) {
                var data = JSON.parse(result);
                $("timeData").html("");
                var timeLine = '<ul class="layui-timeline">';
                if(data.list.length!=0){
                    for(var i=0;i<data.list.length;i++){
                        timeLine+='<li class="layui-timeline-item">';
                        timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                        timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">实际完成日期:'+data.list[i].repairPlans_successDate+'</h3>';
                        timeLine+='<p>设备编号：'+data.list[i].repairPlans_equipmentID+'</p><p>计划完成时间：'+data.list[i].repairPlans_year+'</p>';
                        timeLine+='<p>问题描述：'+data.list[i].repairPlans_des+'</p><p>申请人：'+data.list[i].user_name+'</p>';
                        timeLine+='<p>解决办法：'+data.list[i].repairPlans_reason+'</p>';
                        if(data.list[i].partName.length!=0){
                            timeLine+='<p>更换零件：'+data.list[i].partName+'</p>';
                        }
                        timeLine+='<p>维修人：'+data.list[i].operator+'</p></div></li>';
                    }
                    timeLine+='</ul>';
                }else{
                    timeLine+='<li class="layui-timeline-item">';
                    timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                    timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">无数据</h3>';
                    timeLine+='<p></p></div></li></ul>';
                }
                $("#timeData").html(timeLine);
                node = layer.open({
                    title: '设备保养记录'
                    , type: 1
                    , shift: 4
                    , area: ['800px', '800px'] //宽高
                    , content: $('#timeLine')
                    ,cancel: function(index, layero){
                        layer.close(node);
                    }
                });
            }
        })
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


        //零件
        $.ajax({
            url:'/getPart',
            success:function (result) {
                var list = JSON.parse(result);
                for(var i=0;i<list.list.length;i++){
                    $("#part").append("<option value="+list.list[i].eq_partID+">"+list.list[i].eq_partName+"</option>");
                }
                form.render();
            }
        })




        //维修单提交
        form.on('submit(demo)', function (data) {
            var part = new Array();
            var partData;
            $('#careGroup div').each(function(i){
                partData = $(this).find("input").val();
                part.push(partData);
            })
            partData = part.join(",");
            var reason = data.field.reason;
            var repairPlans_careMonth = data.field.repairPlans_careMonth;
            var repairPlans_careYear = data.field.repairPlans_careYear;
            var repairPlans_equipmentID = data.field.repairPlans_equipmentID;
            var repairPlans_operator = data.field.repairPlans_operator;
            var repairPlans_operatorID = data.field.repairPlans_operatorID;
            $.ajax({
                url: "/repairBill",
                dataType: "json",
                data: {"reason":reason,"repairPlans_careMonth":repairPlans_careMonth,
                        "repairPlans_careYear":repairPlans_careYear,"repairPlans_equipmentID":repairPlans_equipmentID,
                        "repairPlans_operator":repairPlans_operator,"repairPlans_operatorID":repairPlans_operatorID,"partData":partData},
                success: function (result) {
                    layer.msg('添加成功', {icon: 1});
                    layer.close(node);
                    table.reload('waitReload', {
                        url: '/getWaitRepair',
                        method: 'post',
                    });
                }
            })
            return false;
        });


        //添加零件
        form.on('submit(demo2)', function(data){
            var partID = $("#part option:selected").val();
            var part = $("#part option:selected").text();
            var pre_maintenance = "<div style='float: left;position: relative;'><input value=\'"+partID+"\' style='display: none'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(this)'/><span id='initNewMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)'>"+part+"</span></div>";
            $(".span_style").append(pre_maintenance);
            $("#part").val("");
            layer.close(index);
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

        //待维修项
        table.render({
            elem: '#repair'
            , url: '/getWaitRepair'
            , toolbar: '#toolbarDemo'
            , title: '待维修项列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'repairPlans_equipmentID', title: '设备编号', width: 120, align: 'center'}
                    , {field: 'repairPlans_departmentID', title: '部门ID', hide: true, width: 120, align: 'center'}
                    , {field: 'repairPlans_careYear', title: '计划年', hide: true, width: 120, align: 'center'}
                    , {field: 'repairPlans_careMonth', title: '计划月', hide: true, width: 120, align: 'center'}
                    , {field: 'repairPlans_reason', title: '维修记录', hide: true, width: 500, align: 'center'}
                    , {field: 'repairPlans_operatorID', title: '维修人', hide: true, width: 120, align: 'center'}
                    , {field: 'repairPlans_successDate', title: '完成日期', hide: true, width: 120, align: 'center'}
                    , {field: 'partName', title: '更换零件', hide: true, width: 120, align: 'center'}
                    , {field: 'department_name', title: '所属部门', width: 120, align: 'center'}
                    , {field: 'user_name', title: '负责人', width: 120, align: 'center'}
                    , {field: 'repairPlans_year', title: '要求完成日期', width: 120, align: 'center'}
                    , {field: 'repairPlans_des', title: '故障描述', width: 500, align: 'center'}
                    , {field: 'repairPlans_state', title: '维修状态', width: 120, align: 'center'
                    , templet: function (d) {
                        if(d.repairPlans_state===0){
                            return '<label>未维修</label>';
                        }else if(d.repairPlans_state===1){
                            return '<button style="background-color:#007DDB;color: white;padding: 3px" onclick="look(\''+d.department_name+'\',\''+d.repairPlans_year+'\',\''+d.repairPlans_equipmentID+'\',\''+d.repairPlans_des+'\',\''+d.user_name+'\',\''+d.repairPlans_reason+'\',\''+d.partName+'\',\''+d.repairPlans_operatorID+'\',\''+d.repairPlans_successDate+'\')">查看</button>';
                        }
                    }}
                    , {field: 'repairPlans_des', title: '操作', width: 200, align: 'center'
                    ,templet:function(d){
                        return '<button style="background-color:#007DDB;color: white;padding: 3px" onclick="lookRepairBill(\''+d.repairPlans_equipmentID+'\')">查看维修记录</button>';
                    }}
                ]
            ]
            , id: 'waitReload'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });



        //维修记录
        table.render({
            elem: '#repairRecord'
            , url: '/getRepairRecord?userID=' + id
            , title: '维修记录列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'repairRecord_equipmentID', title: '设备编号', width: 120, align: 'center'}
                    , {field: 'repairPlans_year', title: '要求完成日期',width: 120, align: 'center'}
                    , {field: 'department_name', title: '部门', width: 120, align: 'center'}
                    , {field: 'repairPlans_des', title: '故障描述',width: 300, align: 'center'}
                    , {field: 'user_name', title: '申请人', width: 120, align: 'center'}
                    , {field: 'repairPlans_reason', title: '出错原因', width: 300, align: 'center'}
                    , {field: 'operator', title: '维修人', width: 120, align: 'center'}
                    , {field: 'repairPlans_successDate', title: '完成日期', width: 120,align: 'center'}
                ]
            ]
            , id: 'repairRecord'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });



        //头工具栏事件
        table.on('toolbar(repair)', function (obj) {
            var type = obj.event;
            if (type === "delete") {
                var checkRow = table.checkStatus('waitReload');
                if (checkRow.data.length===1) {
                    var repairPlans_equipmentID = checkRow.data[0].repairPlans_equipmentID;
                    var repairPlans_careYear = checkRow.data[0].repairPlans_careYear;
                    var repairPlans_careMonth = checkRow.data[0].repairPlans_careMonth;
                    node = layer.confirm('是否删除选中的维修记录单', {
                        btn: ['确定', '取消'], title: "删除",
                        btn1: function (index, layero) {
                            $.ajax({
                                type: "post",
                                url: 'deleteRepair?repairPlans_equipmentID=' + repairPlans_equipmentID + '&repairPlans_careYear='+repairPlans_careYear +'&repairPlans_careMonth='+repairPlans_careMonth,
                                dataType: "json",
                                async: false,
                                success: function (data) {
                                    layer.close(node);
                                    layer.msg('删除成功', {icon: 1});
                                    table.reload('waitReload', {
                                        url: '/getWaitRepair',
                                        method: 'post'
                                    });
                                }
                            })
                        },
                        btn2: function (index, layero) {
                            layer.close(node);
                            table.reload('waitReload', {
                                url: '/getWaitRepair',
                                method: 'post'
                            });
                        }
                    });
                } else {
                    layer.msg('请选择至少一个维修记录', {icon: 2});
                }
            }else if(type==="update") {
                var checkRow = table.checkStatus('waitReload');
                if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                    layer.msg('选择一个数据进行填写维修记录操作', {icon: 2});
                }else {
                    if(checkRow.data[0].repairPlans_state===1){
                        layer.msg('已经有维修记录了，如果要填写维修记录，清先删除记录单',{icon:2});
                    }else{
                        var repairPlans_equipmentID = checkRow.data[0].repairPlans_equipmentID;
                        var repairPlans_careYear = checkRow.data[0].repairPlans_careYear;
                        var repairPlans_careMonth = checkRow.data[0].repairPlans_careMonth
                        $("#repairPlans_operatorID").val(id);
                        $("#repairPlans_operator").val(username);
                        $("#repairPlans_equipmentID").val(repairPlans_equipmentID);
                        $("#repairPlans_careYear").val(repairPlans_careYear);
                        $("#repairPlans_careMonth").val(repairPlans_careMonth);
                        form.render();
                        node = layer.open({
                            title: '填写维修记录单'
                            , type: 1
                            , shift: 5
                            , area: ['1000px', '600px'] //宽高
                            , content: $('#repair_add')
                            ,cancel:function () {
                                table.reload('waitReload', {
                                    url: '/getWaitRepair',
                                    method: 'post'
                                });
                            }
                        });
                    }

                }
            }
        })
    })

}



//添加按钮
function showAddBtn(){
    layui.use('layer', function() {
        var layer = layui.layer;
        index = layer.open({
            title: '添加维修零件'
            , type: 1
            , shift: 5
            , area: ['500px', '600px'] //宽高
            , content: $('#part_add')
        });
    })
}


// 删除按钮函数组
function showDeleteBtn() {
    $("#showDelBtn").toggleClass('active');
    var show = $(".deleteBtn").css('display');
    if (show === 'block') {
        $(".deleteBtn").css('display', 'none');
        $("#showDelBtn").html("删除");
    } else if (show === 'none') {
        $(".deleteBtn").css('display', 'block');
        $("#showDelBtn").html("取消删除");
    }
}


//删除保养项
function deleteItem(del) {
    $(del).parent().remove();
}


var dragged_name;

function drag(s) {
    var show = $(".deleteBtn").css('display');
    if (show ==='block'){
        alert("请先取消删除操作！");
    } else{
        dragged_name = $(s).html();
    }
}