var node;
var index;
var photo="";

// function look(department_name,repairPlans_year,repairPlans_equipmentID,repairPlans_des,user_name,repairPlans_reason,partName,repairPlans_operatorID,repairPlans_successDate){
//     layui.use(['layer','form'], function() {
//         var layer = layui.layer;
//         var form = layui.form;
//         $.ajax({
//             url:'/getUsername',
//             data:{'repairPlans_operatorID':repairPlans_operatorID},
//             success:function (result) {
//                 var data = JSON.parse(result);
//                 var username = data.username;
//                 $("#repair_operator").val(username);
//             }
//         })
//         $("#department_name").val(department_name);
//         $("#required_date").val(repairPlans_year);
//         $("#repair_equipmentID").val(repairPlans_equipmentID);
//         $("#repair_des").val(repairPlans_des);
//         $("#repair_username").val(user_name);
//         $("#repair_reason").val(repairPlans_reason);
//         $("#change_part").val(partName);
//         $("#repair_successDate").val(repairPlans_successDate);
//         form.render();
//         node = layer.open({
//             title: '设施维修申请表'
//             , type: 1
//             , shift: 5
//             , area: ['800px', '750px'] //宽高
//             , content: $('#repairBill')
//         });
//     })
// }
//
//
// //查看维修单记录
// function lookRepairBill(repairPlans_equipmentID){
//     layui.use(['layer','form'], function() {
//         var layer = layui.layer;
//         var form = layui.form;
//         $.ajax({
//             url:'/getRepairWays',
//             data:{'repairPlans_equipmentID':repairPlans_equipmentID},
//             success:function (result) {
//                 var data = JSON.parse(result);
//                 $("timeData").html("");
//                 var timeLine = '<ul class="layui-timeline">';
//                 if(data.list.length!=0){
//                     for(var i=0;i<data.list.length;i++){
//                         timeLine+='<li class="layui-timeline-item">';
//                         timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
//                         timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">实际完成日期:'+data.list[i].repairPlans_successDate+'</h3>';
//                         timeLine+='<p>设备编号：'+data.list[i].repairPlans_equipmentID+'</p><p>计划完成时间：'+data.list[i].repairPlans_year+'</p>';
//                         timeLine+='<p>问题描述：'+data.list[i].repairPlans_des+'</p><p>申请人：'+data.list[i].user_name+'</p>';
//                         timeLine+='<p>解决办法：'+data.list[i].repairPlans_reason+'</p>';
//                         if(data.list[i].partName.length!=0){
//                             timeLine+='<p>更换零件：'+data.list[i].partName+'</p>';
//                         }
//                         timeLine+='<p>维修人：'+data.list[i].operator+'</p></div></li>';
//                     }
//                     timeLine+='</ul>';
//                 }else{
//                     timeLine+='<li class="layui-timeline-item">';
//                     timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
//                     timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">无数据</h3>';
//                     timeLine+='<p></p></div></li></ul>';
//                 }
//                 $("#timeData").html(timeLine);
//                 node = layer.open({
//                     title: '设备保养记录'
//                     , type: 1
//                     , shift: 4
//                     , area: ['800px', '800px'] //宽高
//                     , content: $('#timeLine')
//                     ,cancel: function(index, layero){
//                         layer.close(node);
//                     }
//                 });
//             }
//         })
//     })
// }


window.onload=function () {
    layui.use(['table','layer','form','element','laydate','upload'], function() {
        var table = layui.table;
        var layer = layui.layer;
        var form = layui.form;
        var element = layui.element;
        var laydate = layui.laydate;
        var upload = layui.upload;


        //当选中零件后，联动加载零件详情
        form.on('select(part)',function (data) {
            $.ajax({
                url:"/getPartDes",
                dataType:"json",
                data:{"part":data.value},
                success:function (result) {
                    var list = result.data;
                    $("#partDes").text("");
                    $("#partDes").text(list);
                    form.render();
                }
            })
        })


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


        upload.render({
            elem: '#editPic'
            ,url: '/upload/'
            ,multiple: true
            ,before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#pic').append('<img style="width: 150px;height: 100px;margin: 10px" src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img">')
                });
            }
            ,done: function(res){
                if(photo.length!=0){
                    photo+=";"+res.data.src+";";
                }else{
                    photo+=res.data.src+";";
                }
                //上传完毕
            }
        });

        //日期
        // laydate.render({
        //     elem: '#date'
        // });


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

        //设备编号
        $.ajax({
            url:'/equipmentList?userID='+id,
            success:function (result) {
                var data = JSON.parse(result);
                var list = data.list;
                $("#equipment_add").html("");
                $("#equipment_add").append("<option value=''></option>");
                $.each(list,function (i,item) {
                    $("#equipment_add").append("<option value="+item.equipment_ID+">"+item.equipment_ID+"</option>");
                })
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
            var equipment_ID = data.field.equipment_ID;
            var photoList = photo;
            var reason = data.field.reason;
            $.ajax({
                url: "/repairBill",
                dataType: "json",
                data: {"reason":reason,"equipment_ID":equipment_ID,"photoList":photoList,"partData":partData,"userID":id,"edit":"insert"},
                success: function (result) {
                    layer.msg('添加成功', {icon: 1});
                    layer.close(node);
                    $("#equipment_add").val("");
                    $(".span_style").html("");
                    $("#reason").val("");
                    $("#photo").html("");
                    form.render();
                    photo="";
                    table.reload('waitReload', {
                        url: '/getWaitRepair',
                        method: 'post',
                    });
                }
            })
            return false;
        });


        //编辑维修单提交
        form.on('submit(demo1)', function (data) {
            var part = new Array();
            var partData;
            $('#editGroup div').each(function(i){
                partData = $(this).find("input").val();
                part.push(partData);
            })
            partData = part.join(",");
            var equipment_ID = data.field.equipment_ID;
            var photoList = photo;
            var reason = data.field.reason;
            var ID = data.field.id;
            $.ajax({
                url: "/repairBill",
                dataType: "json",
                data: {"reason":reason,"equipment_ID":equipment_ID,"photoList":photoList,"partData":partData,"userID":id,"edit":"update","id":ID},
                success: function (result) {
                    layer.msg('修改成功', {icon: 1});
                    layer.close(node);
                    $("#equipment_add").val("");
                    $(".span_style").html("");
                    $("#reason").val("");
                    $("#pic").html("");
                    form.render();
                    photo="";
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
            var pre_maintenance = "<div style='float: left;position: relative;'><input value=\'"+partID+"\' style='display: none'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(this)'/><span id='initNewMte' style='padding: 6px 12px' class='mteValue' draggable='true'>"+part+"</span></div>";
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

        //维修项
        table.render({
            elem: '#repair'
            , url: '/getWaitRepair'
            , toolbar: '#toolbarDemo'
            , title: '待维修项列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'id', title: 'id', hide: true, width: 30, align: 'center'}
                    , {field: 'repairRecord_equipmentID', title: '设备编号', width: 120, align: 'center'}
                    , {field: 'repairPlans_departmentID', title: '部门ID', hide: true, width: 120, align: 'center'}
                    , {field: 'department_name', title: '部门',width: 120, align: 'center'}
                    , {field: 'user_name', title: '提交人', width: 120, align: 'center'}
                    , {field: 'repairRecord_userID', title: '提交人ID',hide:true, width: 120, align: 'center'}
                    , {field: 'repairRecord_date', title: '提交日期', width: 120, align: 'center'}
                    , {field: 'repairRecord_partData', title: '更换零件', width: 300, align: 'center'
                    , templet: function (d) {
                        if(d.careList.length===0){
                            return '<label>无</label>';
                        }else{
                            var data = '<label>';
                            for(var i=0;i<d.careList.length;i++){
                                data+=d.careList[i].eq_partName+';';
                            }
                            data+='</label>'
                            return data;
                        }
                    }}
                    , {field: 'repairRecord_pic', title: '图片', width: 400, align: 'center'
                    , templet: function (d) {
                        var file = "";
                        var fileData = d.equipment_file;
                        if(fileData!="") {
                            for (var i = 0; i < fileData.length; i++) {
                                file += '<image style="margin: 5px" class="big" src="' + fileData[i].filepath + '"></image>'
                            }
                            return file;
                        }else{
                            return "无";
                        }
                    }}
                    , {field: 'repairRecord_des', title: '备注', width: 300, align: 'center'}
                ]
            ]
            , id: 'waitReload'
            , page: false
            , height:800
            , done: function () {
                element.render();
            }
        });



        //头工具栏事件
        table.on('toolbar(repair)', function (obj) {
            var type = obj.event;
            if (type === "add") {
                node = layer.open({
                    title: '添加维修记录'
                    , type: 1
                    , shift: 4
                    , area: ['1000px', '800px'] //宽高
                    , content: $('#layer_add')
                    ,cancel:function (date) {
                        layer.close(node);
                        $("#equipment_add").val("");
                        $(".span_style").html("");
                        $("#reason").val("");
                        $("#photo").html("");
                        photo="";
                        form.render()
                    }
                });
            }else if (type === "delete") {
                var checkRow = table.checkStatus('waitReload');
                if (checkRow.data.length===1) {
                    var ID = checkRow.data[0].id;
                    var repairRecord_pic = checkRow.data[0].repairRecord_pic;
                    node = layer.confirm('是否删除选中的维修记录单', {
                        btn: ['确定', '取消'], title: "删除",
                        btn1: function (index, layero) {
                            $.ajax({
                                type: "post",
                                url: 'deleteRepair?id=' + ID + '&repairRecord_pic='+repairRecord_pic,
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
                    var repairRecord_equipmentID = checkRow.data[0].repairRecord_equipmentID;
                    var careList = checkRow.data[0].careList;
                    var repairRecord_pic = checkRow.data[0].repairRecord_pic
                    var pic = checkRow.data[0].equipment_file
                    var repairRecord_des = checkRow.data[0].repairRecord_des;
                    var id = checkRow.data[0].id;
                    $("#equipment_edit").val(repairRecord_equipmentID);
                    if(careList.length!=0){
                        var pre_maintenance = "";
                        for(var i=0;i<careList.length;i++){
                            pre_maintenance+= "<div style='float: left;position: relative;'><input style='display: none' value='"+careList[i].eq_partID+"'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(this)'/><span id='initNewMte' style='padding: 6px 12px' class='mteValue' draggable='true'>"+careList[i].eq_partName+"</span></div>";
                        }
                        $(".span_style").append(pre_maintenance);
                    }
                    $("#remark").val(repairRecord_des);
                    $("#id").val(id);
                    if(repairRecord_pic!=undefined && repairRecord_pic!=""){
                        photo+=repairRecord_pic;
                    }
                    if(pic.length!=0){
                        for(var j=0;j<pic.length;j++){
                            $('#pic').append('<img style="width: 150px;height: 100px;margin: 10px" src="'+ pic[j].filepath +'" alt="'+ pic[j].filename +'" class="layui-upload-img">')
                        }                    }
                    form.render();
                    node = layer.open({
                        title: '填写维修记录单'
                        , type: 1
                        , shift: 5
                        , area: ['1000px', '800px'] //宽高
                        , content: $('#layer_edit')
                        ,cancel:function () {
                            $(".span_style").html("");
                            photo = "";
                            $("#pic").html("");
                            $("#remark").val("");
                            table.reload('waitReload', {
                                url: '/getWaitRepair',
                                method: 'post'
                            });
                        }
                    });
                }
            }
        })
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
            setTimeout(function () {
                table.reload('waitReload', {
                    where: {
                        username:demoReload.val()
                    }
                });
                layer.close(index);
            },800);
        }
    };

    $('.demoTable .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
})



//添加按钮
function showAddBtn(){
    layui.use('layer', function() {
        var layer = layui.layer;
        index = layer.open({
            title: '添加维修零件'
            , type: 1
            , shift: 5
            , area: ['700px', '400px'] //宽高
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


function showDeleteBtn1() {
    $("#showDelBtn1").toggleClass('active');
    var show = $(".deleteBtn").css('display');
    if (show === 'block') {
        $(".deleteBtn").css('display', 'none');
        $("#showDelBtn1").html("删除");
    } else if (show === 'none') {
        $(".deleteBtn").css('display', 'block');
        $("#showDelBtn1").html("取消删除");
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