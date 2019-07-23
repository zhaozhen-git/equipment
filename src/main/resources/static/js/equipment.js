var node;
var index;
var careNum = 0;

//查看设备保养记录
function look(equipmentID){
    layui.use('layer',function () {
        var layer = layui.layer;
        $.ajax({
            type: "post",
            url: 'getEquipmentTime?equipmentID='+equipmentID,
            dataType: "json",
            async: false,
            success: function (result) {
                var data = result.list;
                var data1 = result.list1;
                $("#timeData").html("");
                $("#repairData").html("");
                var timeLine = '<ul class="layui-timeline">';
                var repairLine = '<ul class="layui-timeline">';
                if(data.length!=0){
                    $.each(data,function (i,item) {
                        timeLine+='<li class="layui-timeline-item">';
                        timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                        timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">实际执行日期:'+item.careRecord_date+'</h3>';
                        timeLine+='<p>设备编号：'+item.careRecord_equipmentID+'</p><p>计划保养项：'+item.careRecord_care+'</p><p>计划执行时间：'+item.careRecord_year+'年'+item.careRecord_month+'</p><p>执行人：'+item.user_name+'</p>';
                        if(item.remark!=undefined){
                            timeLine+='<p>维修描述：'+item.remark+'</p>';
                        }
                        timeLine+='<blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;width:600px;">' + '预览图：' + '<div class="layui-upload-list" id="pic">';
                        var file = "";
                        if(item.photo!="" && item.photo!=undefined){
                            var num = new Array();
                            num = item.photo.split(";");
                            if(num.length!=0){
                                for(var i=0;i<num.length;i++){
                                    file+='<image style="margin: 5px;width: 120px;" class="big" src="/uploadFile/' + num[i] + '"></image>'
                                }
                            }
                        }
                        timeLine+=file+'</div>' + '</blockquote></div></li>';

                    })
                    timeLine+='</ul>';
                }else{
                    timeLine+='<li class="layui-timeline-item">';
                    timeLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                    timeLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">无数据</h3>';
                    timeLine+='<p></p></div></li></ul>';
                }
                $("#timeData").html(timeLine);

                //维修页
                if(data1!=undefined && data1.length!=0){
                    $.each(data1,function (i,item) {
                        repairLine+='<li class="layui-timeline-item">';
                        repairLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                        repairLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">实际执行日期:'+item.repairRecord_date+'</h3>';
                        repairLine+='<p>设备编号：'+item.repairRecord_equipmentID+'</p><p>执行人：'+item.user_name+'</p>';
                        if(data1[i].part.length!=0){
                            var part = "";
                            for(var j=0;j<data1[i].part.length;j++){
                                //零件名字
                                part+=data1[i].part[j].eq_partName+";";
                            }
                        }
                        repairLine+='<p>更换零件：'+part+'</p>';
                        if(item.repairRecord_des!=undefined && item.repairRecord_des!=""){
                            repairLine+='<p>维修描述：'+item.repairRecord_des+'</p>';
                        }
                        repairLine+='<blockquote class="layui-elem-quote layui-quote-nm" style="margin-top: 10px;height: 150px;width:600px;">' + '预览图：' + '<div class="layui-upload-list" id="repairPic">';
                        var file = "";
                        if(item.repairRecord_pic!="" && item.repairRecord_pic!=undefined){
                            var num = new Array();
                            num = item.repairRecord_pic.split(";");
                            if(num.length!=0){
                                for(var i=0;i<num.length;i++){
                                    file+='<image style="margin: 5px;width: 120px;" class="big" src="/uploadFile/' + num[i] + '"></image>'
                                }
                            }
                        }
                        repairLine+=file+'</div>' + '</blockquote></div></li>';

                    })
                    repairLine+='</ul>';
                }else{
                    repairLine+='<li class="layui-timeline-item">';
                    repairLine+='<i class="layui-icon layui-timeline-axis layui-icon-circle"></i>'
                    repairLine+='<div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">无数据</h3>';
                    repairLine+='<p></p></div></li></ul>';
                }
                $("#repairData").html(repairLine);
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

        //日期
        laydate.render({
            elem: '#date'
        });
        laydate.render({
            elem: '#date1'
        });

        //部门
        $.ajax({
            type: "post",
            url: 'getDepartmentList',
            dataType: "json",
            async: false,
            success: function (data) {
                var data = data.list;
                $.each(data,function (i,item) {
                    $("#departmentID").append("<option value="+item.department_ID+">"+item.department_name+"</option>");
                    $("#departmentID1").append("<option value="+item.department_ID+">"+item.department_name+"</option>");
                })
                form.render();
            }
        })




        //当选中部门后，联动加载用户
        form.on('select(departmentID)',function (data) {
            $.ajax({
                url:"/getDepartmentUser",
                dataType:"json",
                data:{"departmentID":data.value},
                success:function (result) {
                    var list = result.list;
                    $("#userID").html("");
                    $.each(list,function (i,item) {
                        $("#userID").append("<option value="+item.user_ID+">"+item.user_name+"</option>");
                    })
                    form.render();
                }
            })
        })

        form.on('select(departmentID1)',function (data) {
            $.ajax({
                url:"/getDepartmentUser",
                dataType:"json",
                data:{"departmentID":data.value},
                success:function (result) {
                    var list = result.list;
                    $("#userID1").html("");
                    $.each(list,function (i,item) {
                        $("#userID1").append("<option value="+item.user_ID+">"+item.user_name+"</option>");
                    })
                    form.render();
                }
            })
        })



        //选择设备，加载设备保养项
        form.on('select(equipmentID)',function (data) {
            var equipmentID = $("#equipmentID option:selected").val();
            $(".span_style").html("");
            //保养组
            $.ajax({
                url:"/getCare",
                dataType:"json",
                data:{"equipmentID":equipmentID},
                success:function (result) {
                    var list = result.list;
                    $("#careGroup").html("");
                    $.each(list,function (i,item) {
                        // var del = item.care_ID;
                        var pre_maintenance ="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(this)'/><span id='initNewMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)'>"+item.care_name+"</span></div>";
                        $(".span_style").append(pre_maintenance);
                    })
                    form.render();
                }
            })
            //每月得保养列表
            $.ajax({
                url:"/getCarePlans",
                dataType:"json",
                data:{"equipmentID":equipmentID},
                success:function (result) {
                    var list = result.list[0];
                    // var file = result.list1;
                    if(list!=undefined){
                        //一月
                        if(list.carePlans_Jan!=undefined && list.carePlans_Jan!=""){
                            var JanList = list.carePlans_Jan.split(",");
                            for(var i=0;i<JanList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+JanList[i]+"</span></div>";
                                $("#January").append(html_content);
                            }
                        }
                        //二月
                        if(list.carePlans_Feb!=undefined && list.carePlans_Feb!=""){
                            var FebList = list.carePlans_Feb.split(",");
                            for(var i=0;i<FebList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+FebList[i]+"</span></div>";
                                $("#February").append(html_content);
                            }
                        }
                        //三月
                        if(list.carePlans_March!=undefined && list.carePlans_March!=""){
                            var MarchList = list.carePlans_March.split(",");
                            for(var i=0;i<MarchList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+MarchList[i]+"</span></div>";
                                $("#March").append(html_content);
                            }
                        }
                        //四月
                        if(list.carePlans_April!=undefined && list.carePlans_April!=""){
                            var AprilList = list.carePlans_April.split(",");
                            for(var i=0;i<AprilList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+AprilList[i]+"</span></div>";
                                $("#April").append(html_content);
                            }
                        }
                        //五月
                        if(list.carePlans_May!=undefined && list.carePlans_May!=""){
                            var MayList = list.carePlans_May.split(",");
                            for(var i=0;i<MayList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+MayList[i]+"</span></div>";
                                $("#May").append(html_content);
                            }
                        }
                        //六月
                        if(list.carePlans_June!=undefined && list.carePlans_June!=""){
                            var JuneList = list.carePlans_June.split(",");
                            for(var i=0;i<JuneList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+JuneList[i]+"</span></div>";
                                $("#June").append(html_content);
                            }
                        }
                        //七月
                        if(list.carePlans_July!=undefined && list.carePlans_July!=""){
                            var JulyList = list.carePlans_July.split(",");
                            for(var i=0;i<JulyList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+JulyList[i]+"</span></div>";
                                $("#July").append(html_content);
                            }
                        }
                        //八月
                        if(list.carePlans_August!=undefined && list.carePlans_August!=""){
                            var AugustList = list.carePlans_August.split(",");
                            for(var i=0;i<AugustList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+AugustList[i]+"</span></div>";
                                $("#August").append(html_content);
                            }
                        }//九月
                        if(list.carePlans_Sept!=undefined && list.carePlans_Sept!=""){
                            var SeptList = list.carePlans_Sept.split(",");
                            for(var i=0;i<SeptList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+SeptList[i]+"</span></div>";
                                $("#September").append(html_content);
                            }
                        }
                        //十月
                        if(list.carePlans_Oct!=undefined && list.carePlans_Oct!=""){
                            var OctList = list.carePlans_Oct.split(",");
                            for(var i=0;i<OctList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+OctList[i]+"</span></div>";
                                $("#October").append(html_content);
                            }
                        }
                        //十一月
                        if(list.carePlans_Nov!=undefined && list.carePlans_Nov!=""){
                            var NovList = list.carePlans_Nov.split(",");
                            for(var i=0;i<NovList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+NovList[i]+"</span></div>";
                                $("#November").append(html_content);
                            }
                        }
                        //十二月
                        if(list.carePlans_Dec!=undefined && list.carePlans_Dec!=""){
                            var DecList = list.carePlans_Dec.split(",");
                            for(var i=0;i<DecList.length;i++){
                                var html_content = '';
                                html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+DecList[i]+"</span></div>";
                                $("#December").append(html_content);
                            }
                        }
                        //文件
                        // if(file!=undefined){
                        //     for(var i=0;i<file.length;i++){
                        //         var supplier_tr='<tr id="supEdit'+i+'"><td>'+file[i].name+'</td><td>'+(file[i].size / 1024).toFixed(1) + "kb"+'</td><td>上传成功</td><td><button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="supplierDel('+i+')">删除</button></td></tr>'
                        //         $("#file").append(supplier_tr);
                        //         suData += file[i].filename+";";
                        //     }
                        // }
                        form.render();
                    }
                }
            })
        })

        //监听提交
        form.on('submit(demo1)', function(data){
            $.ajax({
                url:"/editEquipment?edit=insert&file="+(suData+data1),
                dataType:"json",
                data:data.field,
                success:function (result) {
                    if(result.msg==="1"){
                        layer.msg('设备编号已经存在', {icon: 2});
                    }else{
                        layer.msg('新增成功', {icon: 1});
                        layer.close(node);
                        $("#file").html("");
                        data1 = "";
                        suData = "";
                        table.reload('textReload', {
                            url: '/getEquipmentList?userID=' + id,
                            method: 'post',
                        });
                    }
                }
            })
            return false;
        });

        form.on('submit(demo2)', function(data){
            $.ajax({
                url:"/editEquipment?edit=update&file="+(suData+data1),
                dataType:"json",
                data:data.field,
                success:function (result) {
                    layer.msg('编辑成功', {icon: 1});
                    suData = "";
                    $("#file1").html("");
                    data1 = "";
                    layer.close(node);
                    table.reload('textReload', {
                        url: '/getEquipmentList?userID=' + id,
                        method: 'post',
                    });
                }
            })
            return false;
        });


        //设备保养项新增
        form.on('submit(demo3)', function(data){
            var equipment_ID = $("#equipment_add").val();
            $.ajax({
                url:"/editCare?edit=insert",
                dataType:"json",
                data:data.field,
                success:function (result) {
                    layer.msg('添加成功', {icon: 1});
                    layer.close(index);
                    table.reload('careReload', {
                        url: '/getCareList?equipment_ID=' + equipment_ID,
                        method: 'post'
                    });
                }
            })
            return false;
        });


        //设备保养项编辑
        form.on('submit(demo4)', function(data){
            var equipment_ID = $("#equipment_edit").val();
            var care_ID = $("#care_edit").val();
            $.ajax({
                url:"/editCare?edit=update",
                dataType:"json",
                data:data.field,
                success:function (result) {
                    layer.msg('编辑成功', {icon: 1});
                    layer.close(index);
                    table.reload('careReload', {
                        url: '/getCareList?equipment_ID=' + equipment_ID,
                        method: 'post'
                    });
                }
            })
            return false;
        });


        //增加标签
        form.on('submit(demo5)', function(data){
            // careNum = careNum + 1;
            // var del = "num"+careNum;
            var addCareData = $("#addCareData").val();
            var pre_maintenance = "<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(this)'/><span id='initNewMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)'>"+addCareData+"</span></div>";
            // var pre_maintenance = "<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 19px; top:13px; display: none;' src='img/deleteBtn.png' height='16' width='16'  onclick='deleteItem(\""+del+"\")'/><span class='initNewMte' class='btn mteValue' draggable='true' ondragstart='drag(\""+del+"\")'>"+addCareData+"</span></div>";
            $(".span_style").append(pre_maintenance);
            $("#addCareData").val("");
            layer.close(index1);
            return false;
        });


        //将保养项计划提交
        form.on('submit(demo6)', function(data){
            var data = new Array();
            var Jan = new Array();
            var Feb = new Array();
            var March = new Array();
            var April = new Array();
            var May = new Array();
            var June = new Array();
            var July = new Array();
            var August = new Array();
            var Sept = new Array();
            var Oct = new Array();
            var Nov = new Array();
            var Dec = new Array();
            //保养项组
            $('#careGroup div').each(function(i){
                var careData = $(this).find("span").html();
                data.push(careData);
            })
            $("#January div").each(function (i) {
                var JanData = $(this).find("span").html();
                Jan.push(JanData);
            })
            $("#February div").each(function (i) {
                var FebData = $(this).find("span").html();
                Feb.push(FebData);
            })
            $("#March div").each(function (i) {
                var MarchData = $(this).find("span").html();
                March.push(MarchData);
            })
            $("#April div").each(function (i) {
                var AprilData = $(this).find("span").html();
                April.push(AprilData);
            })
            $("#May div").each(function (i) {
                var MayData = $(this).find("span").html();
                May.push(MayData);
            })
            $("#June div").each(function (i) {
                var JuneData = $(this).find("span").html();
                June.push(JuneData);
            })
            $("#July div").each(function (i) {
                var JulyData = $(this).find("span").html();
                July.push(JulyData);
            })
            $("#August div").each(function (i) {
                var AugustData = $(this).find("span").html();
                August.push(AugustData);
            })
            $("#September div").each(function (i) {
                var SeptData = $(this).find("span").html();
                Sept.push(SeptData);
            })
            $("#October div").each(function (i) {
                var OctData = $(this).find("span").html();
                Oct.push(OctData);
            })
            $("#November div").each(function (i) {
                var NovData = $(this).find("span").html();
                Nov.push(NovData);
            })
            $("#December div").each(function (i) {
                var DecData = $(this).find("span").html();
                Dec.push(DecData);
            })
            var equipmentID = $("#equipmentID").val();
            var careData = data.join(",");
            var JanData = Jan.join(",");
            var FebData = Feb.join(",");
            var MarchData = March.join(",");
            var AprilData = April.join(",");
            var MayData = May.join(",");
            var JuneData = June.join(",");
            var JulyData = July.join(",");
            var AugustData = August.join(",");
            var SeptData = Sept.join(",");
            var OctData = Oct.join(",");
            var NovData = Nov.join(",");
            var DecData = Dec.join(",");
            $.ajax({
                url:"/editCarePlans",
                dataType:"json",
                data:{"userID":id,
                        "file":suData+data1,
                        "equipmentID":equipmentID,
                        "data":careData,
                        "Jan":JanData,
                        "Feb":FebData,
                        "March":MarchData,
                        "April":AprilData,
                        "May":MayData,
                        "June":JuneData,
                        "July":JulyData,
                        "August":AugustData,
                        "Sept":SeptData,
                        "Oct":OctData,
                        "Nov":NovData,
                        "Dec":DecData},
                success:function (result) {
                    layer.msg('编辑成功', {icon: 1});
                    layer.close(index);
                    table.reload('carePlans', {
                        url: '/getCarePlansList?userID=' + id,
                        method: 'post',
                    });
                }
            })
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


        table.render({
            elem: '#equipment'
            , url: '/getEquipmentList?userID=' + id
            , toolbar: '#toolbarDemo'
            , title: '设备列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'equipment_ID', title: 'ID', hide: true, width: 120, align: 'center'}
                    , {field: 'department_ID', title: '部门ID', hide: true, width: 120, align: 'center'}
                    , {field: 'equipment_name', title: '设备名称', width: 200,align: 'center'}
                    , {field: 'equipment_type', title: '设备类别', width: 120,align: 'center'
                    , templet: function (d) {
                        if(d.equipment_type===0){
                            return "A";
                        }else if(d.equipment_type===1){
                            return "B";
                        }else if (d.equipment_type===2){
                            return "C";
                        }else if(d.equipment_type===3){
                            return "D";
                        }
                        }}
                    , {field: 'equipment_size', title: '设备规格', width: 180,align: 'center'}
                    , {field: 'equipment_company', title: '设备厂家', width: 180,align: 'center'}
                    , {field: 'department_name', title: '所属部门', width: 120, align: 'center'}
                    , {field: 'user_name', title: '负责人', width: 120, align: 'center'}
                    , {field: 'equipment_date', title: '购买时间', width: 120, align: 'center'}
                    , {field: 'equipment_remark', title: '保养记录', width: 120, align: 'center'
                    , templet: function (d) {
                        return '<button style="background-color:#007DDB;color: white;padding: 3px" onclick="look(\''+d.equipment_ID+'\')">查看</button>';
                    }}
                    , {field: 'equipment_remark', title: '备注', width: 300, align: 'center'}
                    , {field: 'equipment_file', title: '附件', width: 500, align: 'center',
                    templet: function (d) {
                        var file = "";
                        var fileData = d.equipment_file;
                        if(fileData!=undefined){
                            for(var i=0;i<fileData.length;i++){
                                file += '<a href="'+fileData[i].filepath+'" download="'+fileData[i].filename+'">'+'<span style="color: #007DDB">'+fileData[i].filename+'(下载)；</span></a>'
                            }
                            return file;
                        }else{
                            return "无附件";
                        }

                    }
                }
                ]
            ]
            , id: 'textReload'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });


        //保养项
        table.render({
            elem: '#carePlans'
            , url: '/getCarePlansList?userID=' + id
            , toolbar: '#toolbarList'
            , title: '保养项列表'
            , cols: [
                [
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'carePlans_equipmentID', title: '设备编号', width: 180, align: 'center'}
                    , {field: 'carePlans_year', title: '保养年份', width: 120, align: 'center'}
                    , {field: 'user_name', title: '负责人', width: 200,align: 'center'}
                    // , {field: 'carePlans_file', title: '附件', width: 500, align: 'center',
                    //         templet: function (d) {
                    //             var file = "";
                    //             var fileData = d.carePlans_file;
                    //             if(fileData!=undefined){
                    //                 for(var i=0;i<fileData.length;i++){
                    //                     file += '<a href="'+fileData[i].filepath+'" download="'+fileData[i].filename+'">'+'<span style="color: #007DDB">'+fileData[i].filename+'(下载)；</span></a>'
                    //                 }
                    //                 return file;
                    //             }else{
                    //                 return "无附件";
                    //             }
                    //
                    //         }
                    //     }
                ]
            ]
            , id: 'carePlans'
            , page: false
            , height:730
            , done: function () {
                element.render();
            }
        });

        //设备保养项
        table.on('toolbar(careTable)', function (obj) {
            var type = obj.event;
            if (type === "add") {
                index = layer.open({
                    title: '添加保养项'
                    , type: 1
                    , shift: 4
                    , area: ['400px', '200px'] //宽高
                    , content: $('#index_add')
                });
            } else if (type === "delete") {
                var checkRow = table.checkStatus('careReload');
                if (checkRow.data.length > 0) {
                    var care_equipmentID = checkRow.data[0].care_equipmentID;
                    var ID = "";
                    $.each(checkRow.data, function (i, o) {
                        ID += o.care_ID + ",";
                    });
                    ID = ID.substring(0, ID.length - 1);
                    node = layer.confirm('是否删除选中的' + checkRow.data.length + '个设备保养项', {
                        btn: ['确定', '取消'], title: "删除", btn1: function (index, layero) {
                            $.ajax({
                                type: "post",
                                url: 'deleteCare?id=' + ID + '&equipment_ID='+care_equipmentID,
                                dataType: "json",
                                async: false,
                                success: function (data) {
                                    layer.close(node);
                                    layer.msg('删除成功', {icon: 1});
                                    table.reload('careReload', {
                                        url: '/getCareList?equipment_ID=' + care_equipmentID,
                                        method: 'post',
                                    });
                                }
                            })
                        },
                        btn2: function (index, layero) {
                            layer.close(node);
                            table.reload('careReload', {
                                url: '/getCareList?equipment_ID=' + care_equipmentID,
                                method: 'post',
                            });
                        }
                    });
                } else {
                    layer.msg('请选择至少一个设备保养项', {icon: 2});
                }
            } else if (type === "update") {
                var checkRow = table.checkStatus('careReload');
                if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                    layer.msg('选择一个设备保养项进行编辑操作', {icon: 2});
                } else {
                    var equipment_ID = checkRow.data[0].care_equipmentID;
                    var care_ID = checkRow.data[0].care_ID;
                    var care_name = checkRow.data[0].care_name;
                    $("#equipment_edit").val(equipment_ID);
                    $("#care_edit").val(care_ID);
                    $("#careData").val(care_name);
                    index = layer.open({
                        title: '编辑设备'
                        , type: 1
                        , shift: 5
                        , area: ['500px', '300px'] //宽高
                        , content: $('#index_edit')
                    });
                }
            }
        })


        //设备保养计划
        table.on('toolbar(carePlans)', function (obj) {
            var type = obj.event;
            if (type === "add") {
                $("#equipmentID").empty();
                //得到设备列表
                $.ajax({
                    type: "post",
                    url: 'getEquipmentCare?userID='+id,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        var data = data.list;
                        $.each(data,function (i,item) {
                            $("#equipmentID").append("<option value="+item.equipment_ID+">"+item.equipment_ID+"</option>");
                        })
                        form.render();
                    }
                })
                //将数据选中得都清空
                $("#equipmentID").val("");
                $("#careGroup div").remove();
                $("#January div").remove();
                $("#February div").remove();
                $("#March div").remove();
                $("#April div").remove();
                $("#May div").remove();
                $("#June div").remove();
                $("#July div").remove();
                $("#August div").remove();
                $("#September div").remove();
                $("#October div").remove();
                $("#November div").remove();
                $("#December div").remove();
                $("#file tr").remove();
                form.render();
                index = layer.open({
                    title: '编辑保养项计划'
                    , type: 1
                    , shift: 4
                    , area: ['1430px', '930px'] //宽高
                    , content: $('#plan_add')
                    ,cancel: function(index, layero){
                        table.reload('carePlans', {
                            url: '/getCarePlansList?userID=' + id,
                            method: 'post',
                        });
                        form.render();
                    }
                });
            } else if (type === "delete") {
                var checkRow = table.checkStatus('carePlans');
                if (checkRow.data.length==1) {
                    var ID = checkRow.data[0].carePlans_equipmentID;
                    var YEAR = checkRow.data[0].carePlans_year;
                    node = layer.confirm('是否删除选中的' + checkRow.data.length + '个设备保养计划', {
                        btn: ['确定', '取消'], title: "删除", btn1: function (index, layero) {
                            $.ajax({
                                type: "post",
                                url: 'deleteCarePlans?id=' + ID +'&year='+YEAR,
                                dataType: "json",
                                async: false,
                                success: function (data) {
                                    layer.close(node);
                                    layer.msg('删除成功', {icon: 1});
                                    table.reload('carePlans', {
                                        url: '/getCarePlansList?userID=' + id,
                                        method: 'post',
                                    });
                                }
                            })
                        },
                        btn2: function (index, layero) {
                            layer.close(node);
                            table.reload('carePlans', {
                                url: '/getCarePlansList?userID=' + id,
                                method: 'post',
                            });
                        }
                    });
                } else {
                    layer.msg('请选择一个设备保养计划', {icon: 2});
                }
            }
        })



        //头工具栏事件
        table.on('toolbar(equipment)', function (obj) {
            var type = obj.event;
            if (type === "add") {
                node = layer.open({
                    title: '添加设备'
                    , type: 1
                    , shift: 4
                    , area: ['1000px', '700px'] //宽高
                    , content: $('#layer_add')
                    ,cancel:function (data) {
                        $("#file").html("");
                        suData = "";
                        data1 = "";
                    }
                });
            } else if (type === "delete") {
                var checkRow = table.checkStatus('textReload');
                if (checkRow.data.length > 0) {
                    var ID = "";
                    $.each(checkRow.data, function (i, o) {
                        ID += o.equipment_ID + ",";
                    });
                    ID = ID.substring(0, ID.length - 1);
                    node = layer.confirm('是否删除选中的' + checkRow.data.length + '个设备', {
                        btn: ['确定', '取消'], title: "删除", btn1: function (index, layero) {
                            $.ajax({
                                type: "post",
                                url: 'deleteEquipment?id=' + ID,
                                dataType: "json",
                                async: false,
                                success: function (data) {
                                    layer.close(node);
                                    layer.msg('删除成功', {icon: 1});
                                    table.reload('textReload', {
                                        url: '/getEquipmentList?userID=' + id,
                                        method: 'post',
                                    });
                                }
                            })
                        },
                        btn2: function (index, layero) {
                            layer.close(node);
                            table.reload('textReload', {
                                url: '/getBrandList?id=' + project,
                                method: 'post',
                            });
                        }
                    });
                } else {
                    layer.msg('请选择至少一个设备', {icon: 2});
                }
            } else if (type === "update") {
                var checkRow = table.checkStatus('textReload');
                if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                    layer.msg('选择一个设备进行编辑操作', {icon: 2});
                } else {
                    var equipment_ID = checkRow.data[0].equipment_ID;
                    var equipment_name = checkRow.data[0].equipment_name;
                    var equipment_type = checkRow.data[0].equipment_type;
                    var equipment_size = checkRow.data[0].equipment_size;
                    var equipment_company = checkRow.data[0].equipment_company
                    var department_ID = checkRow.data[0].department_ID;
                    var user_name = checkRow.data[0].user_name;
                    var equipment_date = checkRow.data[0].equipment_date;
                    var equipment_remark = checkRow.data[0].equipment_remark;
                    $("#equipment_ID").val(equipment_ID);
                    $("#equipment_name").val(equipment_name);
                    $("#equipment_type").val(equipment_type);
                    $("#equipment_size").val(equipment_size);
                    $("#equipment_company").val(equipment_company);
                    $("#departmentID1").val(department_ID);
                    var departmentID = $("#departmentID1 option:selected").val();
                    if(departmentID!=""){
                        $.ajax({
                            url:"/getDepartmentUser",
                            dataType:"json",
                            data:{"departmentID":departmentID},
                            success:function (result) {
                                var list = result.list;
                                $("#userID1").html("");
                                $.each(list,function (i,item) {
                                    $("#userID1").append("<option value="+item.user_ID+">"+item.user_name+"</option>");
                                })
                                form.render();
                            }
                        })
                    }
                    $("#userID option:contains('"+user_name+"')").attr("selected",true);
                    $("#date1").val(equipment_date);
                    $("#remark").val(equipment_remark);
                    $.ajax({
                        url:"/getFile",
                        dataType:"json",
                        data:{"equipment_ID":equipment_ID},
                        success:function (result) {
                            var file = result.list;
                            //文件
                            if(file!=undefined){
                                for(var i=0;i<file.length;i++){
                                    var supplier_tr='<tr id="supEdit'+i+'"><td>'+file[i].name+'</td><td>'+(file[i].size / 1024).toFixed(1) + "kb"+'</td><td>上传成功</td><td><button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="supplierDel('+i+')">删除</button></td></tr>'
                                    $("#file1").append(supplier_tr);
                                    suData += file[i].filename+";";
                                }
                            }
                            form.render();
                        }
                    })

                    form.render();
                    node = layer.open({
                        title: '编辑设备'
                        , type: 1
                        , shift: 5
                        , area: ['1100px', '700px'] //宽高
                        , content: $('#layer_edit')
                        ,cancel:function (data) {
                            suData = "";
                            $("#file1").html("");
                            data1 = "";
                        }
                    });
                }
            }else if(type === "care"){
                var checkRow = table.checkStatus('textReload');
                if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                    layer.msg('选择一个设备进行编辑操作', {icon: 2});
                } else {
                    var equipment_ID = checkRow.data[0].equipment_ID;
                    table.render({
                        elem: '#careTable'
                        , url: '/getCareList?equipment_ID=' + equipment_ID
                        , toolbar: '#toolbar'
                        , title: '设备保养项列表'
                        , cols: [
                            [
                                {type: 'checkbox', fixed: 'left'}
                                ,{type: 'numbers', fixed: 'left',title:'序号'}
                                , {field: 'care_equipmentID', title: '设备ID', hide: true, width: 180, align: 'center'}
                                , {field: 'care_ID', title: '保养项编号', hide: true, width: 120, align: 'center'}
                                , {field: 'care_name', title: '保养项计划内容', width: 200, align: 'center'}
                            ]
                        ]
                        , id: 'careReload'
                        , page: false
                        , done: function () {
                            element.render();
                        }
                    });
                    $("#equipment_add").val(equipment_ID);
                    node = layer.open({
                        title: '编辑设备保养项'
                        , type: 1
                        , shift: 5
                        , area: ['800px', '800px'] //宽高
                        , content: $('#care')
                    });
                }
            }
        })
    })
}


//添加按钮
function showAddBtn(){
    layui.use('layer', function() {
        var layer = layui.layer;
        var equipmentID = $("#equipmentID option:selected").val();
        if(equipmentID!=""){
            index1 = layer.open({
                title: '添加设备保养项'
                , type: 1
                , shift: 5
                , area: ['400px', '200px'] //宽高
                , content: $('#care_add')
            });
        }else{
            layer.alert("请先选择设备",{icon:2});
        }
    })
}




// 删除按钮函数组
function showDeleteBtn() {
    $("#showDelBtn").toggleClass('active');
    var show = $(".deleteBtn").css('display');
    if( show === 'block'){
        $(".deleteBtn").css('display','none');
        $("#showDelBtn").html("删除");
    }else if( show === 'none'){
        $(".deleteBtn").css('display','block');
        $("#showDelBtn").html("取消删除");
    }
}



//删除保养项
function deleteItem(del) {
    $(del).parent().remove();
    // var id_name = $(del).siblings(".mteValue").html();
    // var isRight = confirm("你确定删除："+id_name+" 保养项？");
    // if (isRight) {
    //     $(del).parent().remove();
    // }
    // $("#"+del).remove();
}


// 拖拽功能函数组
var dragged_name ;
var area_id ;
var months_name ;
var z = 0;

//将保养项拖向对应得其他地方触发
function allowDrop(e,t) {
    e.preventDefault();
    area_id = $(t).attr("id");
    months_name =$(t).children("#mon").html();
}

function drag(s) {
    var show = $(".deleteBtn").css('display');
    if (show ==='block'){
        alert("请先取消删除操作！");
    } else{
        dragged_name = $(s).html();
    }
}

//拖进
function drop(r) {
    addHtml();
    z=1;
    // var isTrue = confirm("确定将"+ dragged_name +"移动到"+ months_name +"?");
    // if (isTrue){
    //     addHtml();
    //     z=1;
    // }
}


function dragend(g) {
    var show = $(".deleteBtn").css('display');
    if (show ==='block'){
        return 0;
    } else if ( z===1 ){
        $(g).parent().remove();
        z=0;
    }
}


function addHtml() {
    var html_content = '';
    html_content="<div style='float: left;position: relative;'><img class='deleteBtn' style='float: right; position: relative; right: 10px; display: none;' src='img/deleteBtn.png' height='16' width='16' onclick='deleteItem(this)'/><span id='newAddMte' style='padding: 6px 12px' class='mteValue' draggable='true' ondragstart='drag(this)' ondragend='dragend(this)'>"+dragged_name+"</span></div>";
    var new_target = "#"+area_id;
    $(new_target).append(html_content);
}




//供应方上传文件
var data1 = "";

//编辑时供应方文件名存放
var suData = "";

var dataNum1 = -1;

var num1 = new Array();

//文件上传
layui.use('upload', function() {
    var $ = layui.jquery, upload = layui.upload;

    var demoListView = $('#file')
        , uploadListIns = upload.render({
        elem: '#supplierList'
        , url: '/upload/'
        , accept: 'file'
        , multiple: true
        , auto: false
        , bindAction: '#supplierListAction'
        , choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                dataNum1 = dataNum1 +1;
                num1.push(dataNum1);
                var tr = $(['<tr id="sup' + dataNum1 + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>'
                    , '<td>等待上传</td>'
                    , '<td>'
                    , '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="del1('+dataNum1+')">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.append(tr);
            });
        }
        , done: function (res, index, upload) {
            if (res.code === 0) { //上传成功
                data1 += res.data.src+";";
                for(var i=0;i<num1.length;i++){
                    if(num1[i]===""){
                        continue;
                    }
                    var tr = demoListView.find('tr#sup' + num1[i])
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(3).html('<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="delSupplier('+num1[i]+')">删除</button>'); //清空操作
                }
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
        }
    });




    var demoListView1 = $('#file1')
        , uploadListIns = upload.render({
        elem: '#supplierList1'
        , url: '/upload/'
        , accept: 'file'
        , multiple: true
        , auto: false
        , bindAction: '#supplierListAction1'
        , choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                dataNum1 = dataNum1 +1;
                num1.push(dataNum1);
                var tr = $(['<tr id="sup' + dataNum1 + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>'
                    , '<td>等待上传</td>'
                    , '<td>'
                    , '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="del1('+dataNum1+')">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView1.append(tr);
            });
        }
        , done: function (res, index, upload) {
            if (res.code === 0) { //上传成功
                data1 += res.data.src+";";
                for(var i=0;i<num1.length;i++){
                    if(num1[i]===""){
                        continue;
                    }
                    var tr = demoListView1.find('tr#sup' + num1[i])
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(3).html('<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" onclick="delSupplier('+num1[i]+')">删除</button>'); //清空操作
                }
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
        }
    });
});



//删除数组
function del1(index) {
    num1[index]="";
}

//删除文件
function delSupplier(index){
    var supplier = new Array();
    data1 = data1.substring(0,data1.length-1);
    supplier = data1.split(";");
    //将对应的值变成空
    supplier[index]="";
    var NUM = num1[index];
    $("#sup"+NUM).remove();
    num1[index]="";
    data1 = "";
    for(var i=0;i<supplier.length;i++){
        data1+=supplier[i] + ";";
    }
}



//编辑下的供应方文件
function supplierDel(index){
    var data = suData.substring(0,suData.length);
    data = data.substring(0,suData.length-1);
    var String = new Array();
    String = data.split(";");
    String[index] = "";
    $("#supEdit"+index).remove();
    suData = "";
    for(var i=0;i<String.length;i++){
        suData += String[i] + ";";
    }
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
                table.reload('textReload', {
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
