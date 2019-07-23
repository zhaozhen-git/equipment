layui.use(['table','layer','form','upload','element'], function() {
    var table = layui.table;
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;


    form.on('submit(demo4)', function(data){
        var carePlans_equipmentID = $("#equipment_ID").val();
        var year = $("#year").val();
        var month = $("#month").val();
        var data = $("#care").val();
        $.ajax({
            url: 'successCarePlansState?carePlans_equipmentID=' + carePlans_equipmentID + '&year='+ year + '&month='+month + '&data='+data+'&userID='+id,
            dataType:"json",
            success:function (result) {
                layer.msg('保养成功', {icon: 1});
                layer.close(node);
                setTimeout(function(){
                    location.reload();
                    }, 1000);
            }
        })
        return false;
    });




    $.ajax({
        url:'/getKpi',
        // data:{'pass1':pass1,"pass2":pass2,"user":id},
        success:function (result) {
            var data = JSON.parse(result);
            var list = data.list;
            var date = new Date();
            //获取当前年
            var year = date.getFullYear();
            var yearTd='<tbody id="all" class="tbody"><tr><th rowspan="2" width="80px">设备编号</th><th rowspan="2" width="80px">设备名称</th><th rowspan="2" width="80px">部门</th><th rowspan="2" width="80px">详情</th>';
            //所有设备中最早购买得那一年开始
            if(list[0].equipment_date!=undefined){
                var time = list[0].equipment_date.split("-")[0];
                var firstTime = time;
                for(time;time<=year;time++){
                    yearTd+='<th colspan="12">'+time+'</th>';
                }
            }else{
                yearTd+='<th colspan="12">'+year+'</th>';
            }
            yearTd+='</tr>';

            //月份初始化
            time = firstTime;
            yearTd+='<tr>'
            for(time;time<=year;time++){
                yearTd+='<th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th>';
            }
            yearTd+='</tr></tbody>';

            //计划数据初始化
            time = firstTime;
            for(var i=0;i<list.length;i++){
                yearTd+='<tbody id=\"'+list[i].equipment_ID+'\" class="tbody"><tr><td rowspan="3">'+list[i].equipment_ID+'</td><td rowspan="3">'+list[i].equipment_name+'</td><td rowspan="3">'+list[i].department_name+'</td><td>计划</td>';
                if(list[i].list!=undefined){
                    var dataList = list[i].list.list;
                    yearTd+=getHtml(dataList,time,year);
                    yearTd+='</tr>';
                    //实际得保养和保养维修
                    var data =getTrueHtml(dataList,time,year);

                    //维修
                    yearTd+='<tr><td rowspan="2">实际</td>'+data.split("+")[0]+'</tr>';
                    yearTd+='<tr>'+data.split("+")[1]+'</tr></tbody>';
                }else{
                    var html1 = "";
                    for(firstTime;firstTime<=year;firstTime++){
                        html1+='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
                    }
                    yearTd+=html1+'</tr>';
                    yearTd+='<tr><td rowspan="2">实际</td>'+html1+'</tr>';
                    yearTd+='<tr>'+html1+'</tr></tbody>';
                }

            }

            $("#kpi").html(yearTd);
        }
    })




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




})




//计划数据初始化
function getHtml(dataList,time,time1){
    var arrayHtml = new Array();
    for(var num=0;num<=time1-time;num++){
        arrayHtml[num]='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    }
    for(var i=0;i<dataList.length;i++){
        var year = dataList[i].carePlans_year;
        year = year - time;
        var html = '';
        if(dataList[i].carePlans_Jan!=undefined && dataList[i].carePlans_Jan.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careJan";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Jan+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Feb!=undefined && dataList[i].carePlans_Feb.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careFeb";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Feb+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_March!=undefined && dataList[i].carePlans_March.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careMarch";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_March+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_April!=undefined && dataList[i].carePlans_April.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careApril";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_April+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_May!=undefined && dataList[i].carePlans_May.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careMay";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_May+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_June!=undefined && dataList[i].carePlans_June.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careJune";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_June+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_July!=undefined && dataList[i].carePlans_July.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careJuly";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_July+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_August!=undefined && dataList[i].carePlans_August.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careAugust";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_August+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }if(dataList[i].carePlans_Sept!=undefined && dataList[i].carePlans_Sept.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careSept";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Sept+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Oct!=undefined && dataList[i].carePlans_Oct.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careOct";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Oct+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Nov!=undefined && dataList[i].carePlans_Nov.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careNov";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Nov+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Dec!=undefined && dataList[i].carePlans_Dec.length!=0){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"careDec";
            html+='<td><button style="width: 40px;height:20px;background-color: #007DDB" id=\"'+id+'\" onmouseover="showCare(\''+dataList[i].carePlans_Dec+','+id+','+dataList[i].user_name+'\')" onmouseout="unshowCare()"></button></td>';
        }else{
            html+='<td></td>';
        }
        arrayHtml[year] = html;
    }
    var kpiHtml = "";
    for(var j=0;j<arrayHtml.length;j++){
        kpiHtml+=arrayHtml[j];
    }
    return kpiHtml;
}


//真实数据
function getTrueHtml(dataList,time,time1) {
    var arrayHtml = new Array();
    var repairHtml = new Array();
    for (var num = 0; num <= time1 - time; num++) {
        arrayHtml[num] = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
        repairHtml[num]='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    }
    for (var i = 0; i < dataList.length; i++) {
        var equipmentID = dataList[i].carePlans_equipmentID;
        var year1 = dataList[i].carePlans_year;
        var year = dataList[i].carePlans_year;
        year = year - time;
        var html = '';
        var repair = '';
        if (dataList[i].carePlans_Jan != undefined) {
            var JanCarepic = "";
            var JanCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareJan";
            var month = "1";
            if(dataList[i].JanCarepic!=undefined){
                JanCarepic = dataList[i].JanCarepic;
            }
            if(dataList[i].JanCareremark!=undefined){
                JanCareremark = dataList[i].JanCareremark;
            }
            //未完成
            if (dataList[i].Jan_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JanCarepic + ',' + JanCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Jan_state === 1) {
                //完成
                id += "1";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JanCarepic + ',' + JanCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Jan_state === 2) {
                //延期完成
                id += "2";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JanCarepic + ',' + JanCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_Feb != undefined) {
            var FebCarepic = "";
            var FebCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareFeb";
            var month = "2";
            if(dataList[i].FebCarepic!=undefined){
                var FebCarepic = dataList[i].FebCarepic;
            }
            if(dataList[i].FebCareremark!=undefined){
                var FebCareremark = dataList[i].FebCareremark;
            }
            //未完成
            if (dataList[i].Feb_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + FebCarepic + ',' + FebCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Feb_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + FebCarepic + ',' + FebCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Feb_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + FebCarepic + ',' + FebCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_March != undefined) {
            var MarchCarepic = "";
            var MarchCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareMarch";
            var month = "3";
            if(dataList[i].MarchCarepic!=undefined){
                var MarchCarepic = dataList[i].MarchCarepic;
            }
            if(dataList[i].JanCareremark!=undefined){
                var MarchCareremark = dataList[i].MarchCareremark;
            }
            //未完成
            if (dataList[i].March_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MarchCarepic + ',' + MarchCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].March_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MarchCarepic + ',' + MarchCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].March_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MarchCarepic + ',' + MarchCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_April != undefined) {
            var AprilCarepic = "";
            var AprilCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareApril";
            var month = "4";
            if(dataList[i].AprilCarepic!=undefined){
                var AprilCarepic = dataList[i].AprilCarepic;
            }
            if(dataList[i].AprilCareremark!=undefined){
                var AprilCareremark = dataList[i].AprilCareremark;
            }
            //未完成
            if (dataList[i].April_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AprilCarepic + ',' + AprilCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].April_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AprilCarepic + ',' + AprilCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].April_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AprilCarepic + ',' + AprilCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_May != undefined) {
            var MayCarepic = "";
            var MayCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareMay";
            var month = "5";
            if(dataList[i].MayCarepic!=undefined){
                var MayCarepic = dataList[i].MayCarepic;
            }
            if(dataList[i].MayCareremark!=undefined){
                var MayCareremark = dataList[i].MayCareremark;
            }
            //未完成
            if (dataList[i].May_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MayCarepic + ',' + MayCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].May_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MayCarepic + ',' + MayCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].May_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + MayCarepic + ',' + MayCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_June != undefined) {
            var JuneCarepic = "";
            var JuneCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareJune";
            var month = "6";
            if(dataList[i].JuneCarepic!=undefined){
                var JuneCarepic = dataList[i].JuneCarepic;
            }
            if(dataList[i].JuneCareremark!=undefined){
                var JuneCareremark = dataList[i].JuneCareremark;
            }
            //未完成
            if (dataList[i].June_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JuneCarepic + ',' + JuneCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].June_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JuneCarepic + ',' + JuneCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].June_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JuneCarepic + ',' + JuneCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_July != undefined) {
            var JulyCarepic = "";
            var JulyCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareJuly";
            var month = "7";
            if(dataList[i].JulyCarepic!=undefined){
                var JulyCarepic = dataList[i].JulyCarepic;
            }
            if(dataList[i].JulyCareremark!=undefined){
                var JulyCareremark = dataList[i].JulyCareremark;
            }
            //未完成
            if (dataList[i].July_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JulyCarepic + ',' + JulyCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].July_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JulyCarepic + ',' + JulyCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].July_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + JulyCarepic + ',' + JulyCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_August != undefined) {
            var AugustCarepic = "";
            var AugustCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareAugust";
            var month = "8";
            if(dataList[i].AugustCarepic!=undefined){
                    var AugustCarepic = dataList[i].AugustCarepic;
            }
            if(dataList[i].AugustCareremark!=undefined){
                var AugustCareremark = dataList[i].AugustCareremark;
            }
            //未完成
            if (dataList[i].August_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AugustCarepic + ',' + AugustCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].August_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AugustCarepic + ',' + AugustCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].August_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + AugustCarepic + ',' + AugustCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_Sept != undefined) {
            var SeptCarepic = "";
            var SeptCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareSept";
            var month = "9";
            if(dataList[i].SeptCarepic!=undefined){
                var SeptCarepic = dataList[i].SeptCarepic;
            }
            if(dataList[i].SeptCareremark!=undefined){
                var SeptCareremark = dataList[i].SeptCareremark;
            }
            //未完成
            if (dataList[i].Sept_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + SeptCarepic + ',' + SeptCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Sept_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + SeptCarepic + ',' + SeptCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Sept_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + SeptCarepic + ',' + SeptCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_Oct != undefined) {
            var OctCarepic = "";
            var OctCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareOct";
            var month = "10";
            if(dataList[i].OctCarepic!=undefined){
                var OctCarepic = dataList[i].OctCarepic;
            }
            if(dataList[i].OctCareremark!=undefined){
                var OctCareremark = dataList[i].OctCareremark;
            }
            //未完成
            if (dataList[i].Oct_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + OctCarepic + ',' + OctCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Oct_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + OctCarepic + ',' + OctCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Oct_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year + ',' + month + ',' + OctCarepic + ',' + OctCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_Nov != undefined) {
            var NovCarepic = "";
            var NovCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareNov";
            var month = "11";
            if(dataList[i].NovCarepic!=undefined){
                var NovCarepic = dataList[i].NovCarepic;
            }
            if(dataList[i].NovCareremark!=undefined){
                var NovCareremark = dataList[i].NovCareremark;
            }
            //未完成
            if (dataList[i].Nov_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + NovCarepic + ',' + NovCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Nov_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + NovCarepic + ',' + NovCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Nov_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + NovCarepic + ',' + NovCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        if (dataList[i].carePlans_Dec != undefined) {
            var DecCarepic = "";
            var DecCareremark = "";
            var id = dataList[i].carePlans_equipmentID + dataList[i].carePlans_year + "trueCareDec";
            var month = "12";
            if(dataList[i].DecCarepic!=undefined){
                var DecCarepic = dataList[i].DecCarepic;
            }
            if(dataList[i].DecCareremark!=undefined){
                var DecCareremark = dataList[i].DecCareremark;
            }
            //未完成
            if (dataList[i].Dec_state === 0) {
                id += "0";
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'0,0,' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + DecCarepic + ',' + DecCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            } else if (dataList[i].Dec_state === 1) {
                id += "1";
                //完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'1,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + DecCarepic + ',' + DecCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            } else if (dataList[i].Dec_state === 2) {
                id += "2";
                //延期完成
                html += '<td><span id=\"' + id + '\" onmouseover="careState(\'2,' + dataList[i].successDate + ',' + id + '\')" onmouseout="unshowCare()" onclick="lookCare(\'' + equipmentID + ',' + year1 + ',' + month + ',' + DecCarepic + ',' + DecCareremark + '\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        } else {
            html += '<td></td>';
        }
        arrayHtml[year] = html;

        //维修
        if(dataList[i].JanData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJan";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].JanData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].JanData[j].repairRecord_des!=undefined){
                    des = dataList[i].JanData[j].repairRecord_des;
                }
                if(dataList[i].JanData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].JanData[j].repairRecord_pic;
                }
                if(dataList[i].JanData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].JanData[j].eq_partName;
                }
                var userName = dataList[i].JanData[j].username;
                if(eq_partName!=undefined) {
                    var partName = dataList[i].JanData[j].JanData[0].eq_partName;
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].FebData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairFeb";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].FebData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].FebData[j].repairRecord_des!=undefined){
                    des = dataList[i].FebData[j].repairRecord_des;
                }
                if(dataList[i].FebData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].FebData[j].repairRecord_pic;
                }
                if(dataList[i].FebData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].FebData[j].eq_partName;
                }
                var userName = dataList[i].FebData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].MarchData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairMarch";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].MarchData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].MarchData[j].repairRecord_des!=undefined){
                    des = dataList[i].MarchData[j].repairRecord_des;
                }
                if(dataList[i].MarchData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].MarchData[j].repairRecord_pic;
                }
                if(dataList[i].MarchData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].MarchData[j].eq_partName;
                }
                var userName = dataList[i].MarchData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].AprilData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairApril";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].AprilData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].AprilData[j].repairRecord_des!=undefined){
                    des = dataList[i].AprilData[j].repairRecord_des;
                }
                if(dataList[i].AprilData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].AprilData[j].repairRecord_pic;
                }
                if(dataList[i].AprilData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].AprilData[j].eq_partName;
                }
                var userName = dataList[i].AprilData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].MayData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairMay";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].MayData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].MayData[j].repairRecord_des!=undefined){
                    des = dataList[i].MayData[j].repairRecord_des;
                }
                if(dataList[i].MayData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].MayData[j].repairRecord_pic;
                }
                if(dataList[i].MayData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].MayData[j].eq_partName;
                }
                var userName = dataList[i].MayData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].JuneData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJune";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].JuneData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].JuneData[j].repairRecord_des!=undefined){
                    des = dataList[i].JuneData[j].repairRecord_des;
                }
                if(dataList[i].JuneData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].JuneData[j].repairRecord_pic;
                }
                if(dataList[i].JuneData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].JuneData[j].eq_partName;
                }
                var userName = dataList[i].JuneData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].JulyData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJuly";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].JulyData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].JulyData[j].repairRecord_des!=undefined){
                    des = dataList[i].JulyData[j].repairRecord_des;
                }
                if(dataList[i].JulyData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].JulyData[j].repairRecord_pic;
                }
                if(dataList[i].JulyData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].JulyData[j].eq_partName;
                }
                var userName = dataList[i].JulyData[j].username;
                if(eq_partName!="") {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].AugustData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairAugust";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].AugustData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].AugustData[j].repairRecord_des!=undefined){
                    des = dataList[i].AugustData[j].repairRecord_des;
                }
                if(dataList[i].AugustData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].AugustData[j].repairRecord_pic;
                }
                if(dataList[i].AugustData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].AugustData[j].eq_partName;
                }
                var userName = dataList[i].AugustData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].SeptData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairSept";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].SeptData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].SeptData[j].repairRecord_des!=undefined){
                    des = dataList[i].SeptData[j].repairRecord_des;
                }
                if(dataList[i].SeptData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].SeptData[j].repairRecord_pic;
                }
                if(dataList[i].SeptData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].SeptData[j].eq_partName;
                }
                var userName = dataList[i].SeptData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].OctData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairOct";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].OctData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].OctData[j].repairRecord_des!=undefined){
                    des = dataList[i].OctData[j].repairRecord_des;
                }
                if(dataList[i].OctData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].OctData[j].repairRecord_pic;
                }
                if(dataList[i].OctData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].OctData[j].eq_partName;
                }
                var userName = dataList[i].OctData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].NovData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairNov";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].NovData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].NovData[j].repairRecord_des!=undefined){
                    des = dataList[i].NovData[j].repairRecord_des;
                }
                if(dataList[i].NovData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].NovData[j].repairRecord_pic;
                }
                if(dataList[i].NovData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].NovData[j].eq_partName;
                }
                var userName = dataList[i].NovData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }

        if(dataList[i].DecData===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairDec";
            var repairPlans_successDate = dataList[i].successDate;
            var repairCare = "";
            for(var j=0;j<dataList[i].DecData.length;j++) {
                var des = "";
                var pic = "";
                var eq_partName = "";
                var carePlans_equipmentID = dataList[i].carePlans_equipmentID;
                if(dataList[i].DecData[j].repairRecord_des!=undefined){
                    des = dataList[i].DecData[j].repairRecord_des;
                }
                if(dataList[i].DecData[j].repairRecord_pic!=undefined){
                    pic = dataList[i].DecData[j].repairRecord_pic;
                }
                if(dataList[i].DecData[j].eq_partName!="null;"){
                    eq_partName = dataList[i].DecData[j].eq_partName;
                }
                var userName = dataList[i].DecData[j].username;
                if(eq_partName!=undefined) {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'0,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span>';
                }else {
                    repairCare+='<span id=\"'+id+j+'\" onmouseover="careRepair(\'1,'+id+j+','+repairPlans_successDate+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+carePlans_equipmentID+','+des+','+pic+','+userName+','+eq_partName+'\')" style="margin-right:5px;border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span>';
                }
            }
            repair+="<td>"+repairCare+"</td>";
        }
        repairHtml[year]=repair;
        var kpiHtml = "";
        for (var j = 0; j < arrayHtml.length; j++) {
            kpiHtml += arrayHtml[j];
        }
        kpiHtml+="+";
        for(var k=0;k<repairHtml.length;k++){
            kpiHtml+=repairHtml[k];
        }
        return kpiHtml;
    }
}




function setPassword() {
    layui.use('layer', function () {
        var layer = layui.layer;
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


var careTip;
//计划保养项移进显示
function showCare(care) {
    layui.use('layer', function () {
        var layer = layui.layer;
        careTip = layer.tips("<p><span>保养项内容："+care.split(",")[0]+"</span></p><p><span>负责人："+care.split(",")[2]+"</span></p>","#"+care.split(",")[1],{tips:2,time:0});
    })
}


function unshowCare() {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.close(careTip);
    })
}


function careState(state) {
    layui.use('layer', function () {
        var layer = layui.layer;
        var html = '';
        if(state.split(",")[0]==="0"){
            html+='<p><span>状态：未完成</span></p>';
        }else if(state.split(",")[0]==="1"){
            html+='<p><span>状态：如期完成</span></p><p><span>完成时间：'+state.split(",")[1]+'</span></p>';
        }else if(state.split(",")[0]==="2"){
            html+='<p><span>状态：延期完成</span></p><p><span>完成时间：'+state.split(",")[1]+'</span></p>';
        }
        careTip = layer.tips(html,"#"+state.split(",")[2],{tips:2,time:0});
    })
}



//查看实际保养单
function lookCare(data) {
    layui.use(['layer','form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var equipmentID = data.split(",")[0];
        var year = data.split(",")[1];
        var month = data.split(",")[2];
        var pic = data.split(",")[3];
        var remark = data.split(",")[4];
        $.ajax({
            type: "post",
            url: 'LookCare?equipmentID='+equipmentID + '&year='+year+'&month='+month,
            dataType: "json",
            async: false,
            success: function (data) {
                var data = data.list;
                $("#equipment_ID").val(data[0].carePlans_equipmentID);
                $("#department_name").val(data[0].department_name);
                $("#care").val(data[0].month_care);
                $("#user_name").val(data[0].user_name);
                $("#date").val(data[0].planDate);
                $("#successDate").val(data[0].successDate);
                $("#year").val(data[0].carePlans_year);
                $("#month").val(data[0].Month);
                if(pic!=undefined && pic!=""){
                    var picSize = pic.split(";");
                    var file = '';
                    for(var i=0;i<picSize.length;i++){
                        file+= '<image style="margin: 5px;width: 100px;height:100px" class="big" src="/uploadFile/'+picSize[i]+'"></image>';
                    }
                    $("#pic").html(file);
                }
                $("#remark").html(remark);
                if(data[0].successDate!=""){
                    $("#state1").css("display","block");
                    $("#state2").css("display","block");
                    $("#state3").css("display","block");
                    $("#state4").css("display","block");
                }else{
                    $("#state5").css("display","block");
                }
                form.render();
                node = layer.open({
                    title: '实际保养项情况'
                    , type: 1
                    , shift: 4
                    , area: ['1000px', '700px'] //宽高
                    , content: $('#care_look')
                    ,zIndex:100
                    ,cancel: function(index, layero){
                        layer.close(node);
                        $("#state1").css("display","none");
                        $("#state2").css("display","none");
                        $("#state3").css("display","none");
                        $("#state4").css("display","none");
                        $("#state5").css("display","none");
                        $("#successDate").val("");
                    }
                });
            }
        })
    })
}



//维修提示框
function careRepair(state) {
    layui.use('layer', function () {
        var layer = layui.layer;
        var html = '';
        if(state.split(",")[0]==="0"){
            html+='<p><span>状态：更换设备</span></p><p><span>完成时间：'+state.split(",")[2]+'</span></p>';
        }else if(state.split(",")[0]==="1"){
            html+='<p><span>状态：已维修</span></p><p><span>完成时间：'+state.split(",")[2]+'</span></p>';
        }
        careTip = layer.tips(html,"#"+state.split(",")[1],{tips:2,time:0});
    })
}


function findEquipment() {
    var text = $("#text").val();
    if(text!=undefined && text!=""){
        $(".tbody").css("display","none");
        //模糊查询
        $("tbody[id^="+text+"]").css("display","");
        // $("#"+text).css("display","");
        $("#all").css("display","");
    }else{
        $(".tbody").css("display","");
    }

}



//查看维修
function unRepair(data){
    var equipmentID = data.split(",")[0].trim();
    var des = data.split(",")[1].trim();
    var pic = data.split(",")[2].trim();
    var userName = data.split(",")[3].trim();
    var part = data.split(",")[4].trim();
    $("#eq_ID").val(equipmentID);
    $("#eq_des").text(des);
    $("#eq_name").val(userName);
    if(pic!=""){
        pic = '/uploadFile/'+pic;
        $("#eq_pic").html('<image style="margin: 5px;width: 120px;height:100px" class="big" src=\"' + pic + '\"></image>');
    }
    $("#eq_part").text(part);
    layui.use('layer', function () {
        var layer = layui.layer;
        node = layer.open({
            title: '查看维修'
            , type: 1
            , shift: 4
            , area: ['900px', '700px'] //宽高
            , content: $('#repairLook')
            ,zIndex:100
            ,cancel:function () {
                $("#eq_ID").val("");
                $("#eq_des").text("");
                $("#eq_name").val("");
                $("#eq_pic").html("");
                $("#eq_part").text("");
                layer.close(node);
            }
        });
    })
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