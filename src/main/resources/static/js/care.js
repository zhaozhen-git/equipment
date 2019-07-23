var node;
var index;
var photo="";

//添加维修单
function addRepair(carePlans_equipmentID,year,month) {
    layui.use('layer',function () {
        var layer = layui.layer;
        $("#equipment_ID").val(carePlans_equipmentID);
        $("#year").val(year);
        $("#month").val(month);
        node = layer.open({
            title: '添加维修单'
            , type: 1
            , shift: 4
            , area: ['800px', '600px'] //宽高
            , content: $('#repair_add')
            ,cancel: function(index, layero){
                $("#photo").html("");
                photo = "";
                layer.close(node);
            }
        });
    })
}
// function addRepair(carePlans_equipmentID,year,month,department_name,department_ID) {
//     layui.use('layer',function () {
//         var layer = layui.layer;
//         $("#equipment_ID").val(carePlans_equipmentID);
//         $("#department_name").val(department_name);
//         $("#department_ID").val(department_ID);
//         $("#year").val(year);
//         $("#user_name").val(username);
//         $("#user_ID").val(id);
//         $("#month").val(month);
//         node = layer.open({
//             title: '添加维修单'
//             , type: 1
//             , shift: 4
//             , area: ['800px', '500px'] //宽高
//             , content: $('#repair_add')
//             ,cancel: function(index, layero){
//                 layer.close(node);
//             }
//         });
//     })
// }



// function cancel(carePlans_equipmentID,year,month) {
//     layui.use(['layer','table'],function () {
//         var layer = layui.layer;
//         var table = layui.table;
//         //完成对应得保养项
//         node = layer.confirm('是否撤销该条的维修单', {
//             btn: ['确定', '取消'], title: "完成", btn1: function (index, layero) {
//                 $.ajax({
//                     type: "post",
//                     url: 'cancelRepairBill?carePlans_equipmentID=' + carePlans_equipmentID + '&year='+ year + '&month='+month,
//                     dataType: "json",
//                     async: false,
//                     success: function (data) {
//                         layer.close(node);
//                         layer.msg('成功', {icon: 1});
//                         table.reload('textReload', {
//                             url: '/getWaitCare?userID=' + id,
//                             method: 'post',
//                         });
//                         table.reload('repairRecord', {
//                             url: '/getCareRecord?userID=' + id,
//                             method: 'post',
//                         });
//                     }
//                 })
//             },
//             btn2: function (index, layero) {
//                 layer.close(node);
//                 table.reload('textReload', {
//                     url: '/getWaitCare?userID=' + id,
//                     method: 'post',
//                 });
//             }
//         });
//     })
// }


//已维修单
// function look(carePlans_equipmentID,year,month) {
//     layui.use(['layer','form'],function () {
//         var layer = layui.layer;
//         var form = layui.form;
//         //得到对应得维修单
//         $.ajax({
//                 type: "post",
//                 url: 'LookRepairPlans?carePlans_equipmentID='+carePlans_equipmentID + '&year='+year+'&month='+month,
//                 dataType: "json",
//                 async: false,
//                 success: function (data) {
//                     var data = data.list;
//                     $("#look_year").val(year);
//                     $("#look_month").val(month);
//                     $("#equipmentID").val(data[0].repairPlans_equipmentID);
//                     $("#departmentName").val(data[0].department_name);
//                     $("#userName").val(data[0].user_name);
//                     $("#date1").val(data[0].repairPlans_year);
//                     $("#repairDes").val(data[0].repairPlans_des);
//                     $("#repair_reason").val(data[0].repairPlans_reason);
//                     $("#repairOperator").val(data[0].operator);
//                     $("#repairDate").val(data[0].repairPlans_successDate);
//                     $("#repair_part").val(data[0].partName);
//                     form.render();
//                     node = layer.open({
//                         title: '查看维修单'
//                         , type: 1
//                         , shift: 4
//                         , area: ['800px', '750px'] //宽高
//                         , content: $('#repair_look')
//                         ,cancel: function(index, layero){
//                             layer.close(node);
//                         }
//                     });
//                 }
//         })
//     })
// }



//查看维修单
// function lookSuccess(carePlans_equipmentID,year,month) {
//     layui.use(['layer','form'],function () {
//         var layer = layui.layer;
//         var form = layui.form;
//         //得到对应得维修单
//         $.ajax({
//             type: "post",
//             url: 'LookRepairPlans?carePlans_equipmentID='+carePlans_equipmentID + '&year='+year+'&month='+month,
//             dataType: "json",
//             async: false,
//             success: function (data) {
//                 var data = data.list;
//                 $("#look_year").val(year);
//                 $("#look_month").val(month);
//                 $("#equipmentID").val(data[0].repairPlans_equipmentID);
//                 $("#departmentName").val(data[0].department_name);
//                 $("#userName").val(data[0].user_name);
//                 $("#date1").val(data[0].repairPlans_year);
//                 $("#repairDes").val(data[0].repairPlans_des);
//                 $("#repair_reason").val(data[0].repairPlans_reason);
//                 $("#repairOperator").val(data[0].operator);
//                 $("#repairDate").val(data[0].repairPlans_successDate);
//                 $("#success").css("display","none");
//                 form.render();
//                 node = layer.open({
//                     title: '查看维修单'
//                     , type: 1
//                     , shift: 4
//                     , area: ['800px', '600px'] //宽高
//                     , content: $('#repair_look')
//                     ,cancel: function(index, layero){
//                         layer.close(node);
//                     }
//                 });
//             }
//         })
//     })
// }

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
function cancel(carePlans_equipmentID,year,month,equipment_file) {
    layui.use(['layer','table'],function () {
        var layer = layui.layer;
        var table = layui.table;
        //完成对应得保养项
        node = layer.confirm('是否撤销该条的维修单', {
            btn: ['确定', '取消'], title: "完成", btn1: function (index, layero) {
                $.ajax({
                    type: "post",
                    url: 'cancelPhoto?equipmentID=' + carePlans_equipmentID + '&year='+ year + '&month='+ month + '&equipment_file=' + equipment_file,
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
    layui.use(['table','layer','form','element','laydate','upload'], function() {
        var table = layui.table;
        var layer = layui.layer;
        var form = layui.form;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;

        // //日期
        laydate.render({
            elem: '#date'
        });


        //多图片上传
        upload.render({
            elem: '#photoList'
            ,url: '/upload/'
            ,multiple: true
            ,before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#photo').append('<img style="width: 150px;height: 100px;margin: 10px" src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img">')
                });
            }
            ,done: function(res){
                photo+=res.data.src+";";
                //上传完毕
            }
        });



        //监听提交
        form.on('submit(demo)', function (data) {
            $.ajax({
                url: "/CareRepair?photo="+photo,
                dataType: "json",
                data: data.field,
                success: function (result) {
                    layer.msg('添加成功', {icon: 1});
                    $("#photo").html("");
                    photo = "";
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
                    , {field: 'equipment_file', title: '图片', width: 500, align: 'center',
                    templet: function (d) {
                        var file = "";
                        var fileData = d.equipment_file;
                        if(fileData!=undefined){
                            for(var i=0;i<fileData.length;i++){
                                file += '<image style="margin: 5px" class="big" src="'+fileData[i].filepath+'"></image>'
                            }
                            return file;
                        }else{
                            return "无";
                        }
                    }}
                    , {field: 'data', title: '操作', width: 400,align: 'center'
                    , templet: function (d) {
                        var data = '<div style="margin-top:30px"><button style="background-color: #49FF0A;color: white;padding: 3px;margin-right: 10px" onclick="addRepair(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\')">添加维修</button>';
                        data+= '<button style="background-color: #FF5722;color: white;padding: 3px;margin-right: 10px" onclick="cancel(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\',\''+d.pic+'\')">删除维修</button>';
                        data+='<button style="background-color:#007DDB;color: white;padding: 3px" onclick="success(\''+d.carePlans_equipmentID+'\',\''+d.year+'\',\''+d.month+'\',\''+d.data+'\')">完成保养</button></div>';
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
                        return '<div style="margin-top:30px"><button style="background-color:#007DDB;color: white;padding: 3px" onclick="unSuccess(\''+d.careRecord_equipmentID+'\',\''+d.careRecord_year+'\',\''+d.careRecord_month+'\')">取消完成</button></div>';
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



layui.use(['table','layer'],function () {
    var table = layui.table;
    var layer = layui.layer;
    var active = {
        reload: function(){
            var demoReload = $('#demoReload');
            //执行重载
            var index = layer.msg("查询中，请稍后...",{icon:16});
            var name = document.getElementById("page_1").className;
            if(name!=""){
                setTimeout(function () {
                    table.reload('textReload', {
                        where: {
                            username:demoReload.val()
                        }
                    });
                    layer.close(index);
                },800);
            }else{
                setTimeout(function () {
                    table.reload('repairRecord', {
                        where: {
                            username:demoReload.val()
                        }
                    });
                    layer.close(index);
                },800);
            }

        }
    };

    $('.demoTable .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
})




//图片变大变小
$(document).on('click',".big",function (e) {
    var _this = e.currentTarget.src;
    imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
})

function imgShow(outerdiv, innerdiv, bigimg, _this){
    var src = _this;//获取当前点击的pimg元素中的src属性
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性

    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).load(function(){
        var windowW = $(window).width();//获取当前窗口宽度
        var windowH = $(window).height();//获取当前窗口高度
        var realWidth = this.width;//获取图片真实宽度
        var realHeight = this.height;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

        if(realHeight>windowH*scale) {//判断图片高度
            imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
            if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW*scale;//再对宽度进行缩放
            }
        } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }
        $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放

        var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
        var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
        $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    });

    $(outerdiv).click(function(){//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });
}