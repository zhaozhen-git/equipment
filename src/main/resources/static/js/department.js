layui.use(['table','layer','form','upload','element'], function() {
    var table = layui.table;
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;


    form.on('submit(demo1)', function(data){
        $.ajax({
            url:"/editDepartment?edit=insert",
            dataType:"json",
            data:data.field,
            success:function (result) {
                layer.msg('新增成功', {icon: 1});
                layer.close(node);
                table.reload('textReload', {
                    url: '/getDepartment',
                    method: 'post',
                });
            }
        })
        return false;
    });

    form.on('submit(demo2)', function(data){
        $.ajax({
            url:"/editDepartment?edit=update",
            dataType:"json",
            data:data.field,
            success:function (result) {
                layer.msg('编辑成功', {icon: 1});
                layer.close(node);
                table.reload('textReload', {
                    url: '/getDepartment',
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

    table.render({
        elem: '#department'
        , url: '/getDepartment'
        , toolbar: '#toolbarDemo'
        , title: '部门列表'
        , cols: [
            [
                {type: 'checkbox', fixed: 'left'}
                , {field: 'department_ID', title: '部门ID', width: 100, align: 'center'}
                , {field: 'department_name', title: '部门名', width: 180,align:'center'}
            ]
        ]
        , id: 'textReload'
        , page: false
        , height:800
    });





    //头工具栏事件
    table.on('toolbar(department)', function (obj) {
        var type = obj.event;
        if (type === "add") {
            node = layer.open({
                title: '添加部门'
                , type: 1
                , shift: 4
                , area: ['500px', '250px'] //宽高
                , content: $('#layer_add')
            });
        } else if (type === "delete") {
            var checkRow = table.checkStatus('textReload');
            if (checkRow.data.length > 0) {
                var ID ="";
                $.each(checkRow.data, function (i, o) {
                    ID += o.department_ID + ",";
                });
                ID = ID.substring(0, ID.length - 1);
                node = layer.confirm('是否删除选中的'+checkRow.data.length+'个部门', {
                    btn: ['确定', '取消'], title: "删除",
                    btn1: function (index, layero) {
                        $.ajax({
                            type: "post",
                            url: 'deleteDepartment?id=' + ID,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                layer.close(node);
                                layer.msg('删除成功', {icon: 1});
                                table.reload('textReload', {
                                    url: '/getDepartment',
                                    method: 'post'
                                });
                            }
                        })
                    },
                    btn2: function (index, layero) {
                        layer.close(node);
                        table.reload('textReload', {
                            url: '/getDepartment',
                            method: 'post'
                        });
                    }
                });
            } else {
                layer.msg('请选择至少一个部门', {icon: 2});
            }
        }else if(type==="update") {
            var checkRow = table.checkStatus('textReload');
            if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                layer.msg('选择一个部门数据进行编辑操作', {icon: 2});
            }else {
                var department_ID = checkRow.data[0].department_ID;
                var department_Name = checkRow.data[0].department_name;
                $("#department_ID").val(department_ID);
                $("#department_name").val(department_Name);
                form.render();
                node = layer.open({
                    title: '编辑部门'
                    , type: 1
                    , shift: 5
                    , area: ['500px', '250px'] //宽高
                    , content: $('#layer_edit')
                });
            }
        }
    })

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