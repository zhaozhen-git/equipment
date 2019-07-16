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
            var list1 = data.list1;
            //所有设备中最早购买得那一年开始
            var time = list1[0].equipment_date.split("-")[0];
            var firstTime = time;
            var date = new Date();
            var time1 = date.getFullYear();
            var yearTd='<tr><th rowspan="2" width="80px">设备编号</th><th rowspan="2" width="80px">设备名称</th><th rowspan="2" width="80px">部门</th><th rowspan="2" width="80px">详情</th>';
            //年份初始化
            for(time;time<=time1;time++){
                yearTd+='<th colspan="12">'+time+'</th>';
            }
            yearTd+='</tr>';
            //月份初始化
            time = firstTime;
            yearTd+='<tr>'
            for(time;time<=time1;time++){
                yearTd+='<th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th>';
            }
            yearTd+='</tr>';

            //计划数据初始化---------------------这一块需要修改
            time = firstTime;
            for(var i=0;i<list1.length;i++){
                yearTd+='<tr><td rowspan="3">'+list1[i].carePlans_equipmentID+'</td><td rowspan="3">'+list1[i].equipment_name+'</td><td rowspan="3">'+list1[i].department_name+'</td><td>计划</td>';
                var dataList = list1[i].list;
                yearTd+=getHtml(dataList,time,time1);
                yearTd+='</tr>';
                //实际得保养和维修
                var data =getTrueHtml(dataList,time,time1);
                yearTd+='<tr><td rowspan="2">实际</td>'+data.split("+")[0]+'</tr>';
                yearTd+='<tr>'+data.split("+")[1]+'</tr>'
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
    for(var num=0;num<time1-time;num++){
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
    for(var num=0;num<=time1-time;num++){
        arrayHtml[num]='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
        repairHtml[num]='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    }
    for(var i=0;i<dataList.length;i++){
        var equipmentID = dataList[i].carePlans_equipmentID;
        var year1 = dataList[i].carePlans_year;
        var year = dataList[i].carePlans_year;
        year = year - time;
        var html = '';
        var repair = '';
        if(dataList[i].carePlans_Jan!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareJan";
            var month = "1";
            //未完成
            if(dataList[i].Jan_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Jan_state===1){
                //完成
                id+="1";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Jan_state===2){
                //延期完成
                id+="2";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Feb!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareFeb";
            var month = "2";
            //未完成
            if(dataList[i].Feb_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Feb_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Feb_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_March!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareMarch";
            var month = "3";
            //未完成
            if(dataList[i].March_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].March_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].March_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_April!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareApril";
            var month = "4";
            //未完成
            if(dataList[i].April_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].April_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].April_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_May!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareMay";
            var month = "5";
            //未完成
            if(dataList[i].May_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].May_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].May_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_June!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareJune";
            var month = "6";
            //未完成
            if(dataList[i].June_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].June_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].June_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_July!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareJuly";
            var month = "7";
            //未完成
            if(dataList[i].July_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].July_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].July_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_August!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareAugust";
            var month = "8";
            //未完成
            if(dataList[i].August_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].August_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].August_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Sept!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareSept";
            var month = "9";
            //未完成
            if(dataList[i].Sept_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Sept_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Sept_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Oct!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareOct";
            var month = "10";
            //未完成
            if(dataList[i].Oct_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Oct_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Oct_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Nov!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareNov";
            var month = "11";
            //未完成
            if(dataList[i].Nov_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Nov_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Nov_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        if(dataList[i].carePlans_Dec!=undefined){
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueCareDec";
            var month = "12";
            //未完成
            if(dataList[i].Dec_state===0){
                id+="0";
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'0,0,'+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #c0a16b;vertical-align: top;"></span></td>';
            }else if(dataList[i].Dec_state===1){
                id+="1";
                //完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'1,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #007DDB;vertical-align: top;"></span></td>';
            }else if(dataList[i].Dec_state===2){
                id+="2";
                //延期完成
                html+='<td><span id=\"'+id+'\" onmouseover="careState(\'2,'+dataList[i].successDate+','+id+'\')" onmouseout="unshowCare()" onclick="lookCare(\''+equipmentID+','+year1+','+month+'\')" style="border-radius:50%;height: 20px;width: 20px;display: inline-block;background: #FF5722;vertical-align: top;"></span></td>';
            }
        }else{
            html+='<td></td>';
        }
        arrayHtml[year] = html;

        //维修
        if(dataList[i].Jan===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJan";
            var repairPlans_successDate = dataList[i].repairPlans_successDate;
            if(dataList[i].Jan===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Jan\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Jan===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Jan===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].Feb===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairFeb";
            if(dataList[i].Feb===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Feb\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Feb===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Feb===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].March===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairMarch";
            if(dataList[i].March===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',March\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].March===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].March===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].April===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairApril";
            if(dataList[i].April===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',April\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].April===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].April===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].May===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairMay";
            if(dataList[i].May===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',May\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].May===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].May===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].June===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJune";
            if(dataList[i].June===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',June\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].June===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].June===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].July===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairJuly";
            if(dataList[i].July===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',July\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].July===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].July===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].August===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairAugust";
            if(dataList[i].August===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',August\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].August===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom:20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].August===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].Sept===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairSept";
            if(dataList[i].Sept===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Sept\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Sept===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom: 20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Sept===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].Oct===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairOct";
            if(dataList[i].Oct===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Oct\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Oct===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom: 20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Oct===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].Nov===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairNov";
            if(dataList[i].Nov===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Nov\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Nov===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom: 20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Nov===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        if(dataList[i].Dec===undefined){
            repair+='<td></td>';
        }else{
            var id = dataList[i].carePlans_equipmentID+dataList[i].carePlans_year+"trueRepairDec";
            if(dataList[i].Dec===0){
                id+="0";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'0,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" onclick="unRepair(\''+dataList[i].carePlans_equipmentID+','+dataList[i].carePlans_year+',Dec\')" style="border-bottom:20px solid #926B17;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Dec===1){
                id+="1";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'1,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="border-bottom: 20px solid cyan;border-left: 10px solid transparent;border-right: 10px solid transparent;display: inline-block;vertical-align: top;"></span></td>';
            }else if(dataList[i].Dec===5){
                id+="2";
                repair+='<td><span id=\"'+id+'\" onmouseover="careRepair(\'2,'+repairPlans_successDate+','+id+'\')" onmouseout="unshowCare()" style="height:20px;width:20px;background: #00db42;display: inline-block;vertical-align: top;"></span></td>';
            }
        }
        repairHtml[year]=repair;
    }
    var kpiHtml = "";
    for(var j=0;j<arrayHtml.length;j++){
        kpiHtml+=arrayHtml[j];
    }
    kpiHtml+="+";
    for(var k=0;k<repairHtml.length;k++){
        kpiHtml+=repairHtml[k];
    }
    return kpiHtml;
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
                if(data[0].successDate!=""){
                    $("#state1").css("display","block");
                }else{
                    $("#state2").css("display","block");
                }
                form.render();
                node = layer.open({
                    title: '实际保养项情况'
                    , type: 1
                    , shift: 4
                    , area: ['800px', '400px'] //宽高
                    , content: $('#care_look')
                    ,cancel: function(index, layero){
                        layer.close(node);
                        $("#state1").css("display","none");
                        $("#state2").css("display","none");
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
            html+='<p><span>状态：未维修</span></p>';
        }else if(state.split(",")[0]==="1"){
            html+='<p><span>状态：已维修</span></p><p><span>完成时间：'+state.split(",")[1]+'</span></p>';
        }else if(state.split(",")[0]==="2"){
            html+='<p><span>状态：部件更换</span></p><p><span>完成时间：'+state.split(",")[1]+'</span></p>';
        }
        careTip = layer.tips(html,"#"+state.split(",")[2],{tips:2,time:0});
    })
}