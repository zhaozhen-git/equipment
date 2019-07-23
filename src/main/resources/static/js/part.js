layui.use(['table','layer','form','upload','element'], function() {
    var table = layui.table;
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;



    //零件表格
    table.render({
        elem: '#part'
        , url: '/getPartList'
        , toolbar: '#toolbarDemo'
        , title: '零件列表'
        , cols: [
            [
                {type: 'checkbox', fixed: 'left'}
                , {field: 'eq_partID', title: '零件ID',width: 100, align: 'center'}
                , {field: 'eq_partName', title: '零件名称', width: 120,align:'center'}
                , {field: 'eq_partDes', title: '零件描述', width: 300,align:'center'}
            ]
        ]
        , id: 'partReload'
        , page: false
        , height:800
    });


    //头工具栏事件
    table.on('toolbar(part)', function (obj) {
        var type = obj.event;
        if (type === "add") {
            node = layer.open({
                title: '添加零件'
                , type: 1
                , shift: 4
                , area: ['700px', '350px'] //宽高
                , content: $('#part_add')
            });
        } else if (type === "delete") {
            var checkRow = table.checkStatus('partReload');
            if (checkRow.data.length > 0) {
                var ID ="";
                $.each(checkRow.data, function (i, o) {
                    ID += o.eq_partID + ",";
                });
                ID = ID.substring(0, ID.length - 1);
                node = layer.confirm('是否删除选中的'+checkRow.data.length+'个零件', {
                    btn: ['确定', '取消'], title: "删除",
                    btn1: function (index, layero) {
                        $.ajax({
                            type: "post",
                            url: 'deletePart?id=' + ID,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                layer.close(node);
                                layer.msg('删除成功', {icon: 1});
                                table.reload('partReload', {
                                    url: '/getPartList',
                                    method: 'post'
                                });
                            }
                        })
                    },
                    btn2: function (index, layero) {
                        layer.close(node);
                        table.reload('partReload', {
                            url: '/getPartList',
                            method: 'post'
                        });
                    }
                });
            } else {
                layer.msg('请选择至少一个零件', {icon: 2});
            }
        }
    })



    form.on('submit(demo)', function(data){
        $.ajax({
            url:"/insertPart",
            dataType:"json",
            data:data.field,
            success:function (result) {
                layer.msg('插入成功', {icon: 1});
                layer.close(node);
                $("#partName").val("");
                $("#partDes").val("");
                table.reload('partReload', {
                    url: '/getPartList',
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

})



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
