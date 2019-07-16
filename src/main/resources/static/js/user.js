layui.use(['table','layer','form','upload','element'], function() {
    var table = layui.table;
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;


    //获取部门
    $.ajax({
        type: "post",
        url: 'getDepartmentList',
        dataType: "json",
        async: false,
        success: function (data) {
            var data = data.list;
            $.each(data,function (i,item) {
                $("#department").append("<option value="+item.department_ID+">"+item.department_name+"</option>");
                $("#department1").append("<option value="+item.department_ID+">"+item.department_name+"</option>");
            })
            form.render();
        }
    })


    //获取员工权限列表
    $.ajax({
        type: "post",
        url: 'getRoleList',
        dataType: "json",
        async: false,
        success: function (data) {
            var data = data.list;
            $.each(data,function (i,item) {
                $("#user_role").append("<option value="+item.id+">"+item.name+"</option>");
                $("#user_role1").append("<option value="+item.id+">"+item.name+"</option>");
            })
            form.render();
        }
    })


    form.on('submit(demo1)', function(data){
        var userID = $("#user_ID").val();
        $.ajax({
            url:"/boolUser?userID="+userID,
            dataType:"json",
            data:data.field,
            success:function (result) {
                var msg = result.msg;
                if(msg==="0"){
                    layer.msg('新增失败，工号已经存在', {icon: 2});
                }else{
                    $.ajax({
                        url:"/editUser?edit=insert",
                        dataType:"json",
                        data:data.field,
                        success:function (result) {
                            layer.msg('新增成功', {icon: 1});
                            layer.close(node);
                            table.reload('textReload', {
                                url: '/getUserList',
                                method: 'post',
                            });
                        }
                    })
                }
            }
        })
        return false;
    });


    form.on('submit(demo2)', function(data){
        $.ajax({
            url:"/editUser?edit=update",
            dataType:"json",
            data:data.field,
            success:function (result) {
                layer.msg('编辑成功', {icon: 1});
                layer.close(node);
                table.reload('textReload', {
                    url: '/getUserList',
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
        elem: '#user'
        , url: '/getUserList'
        , toolbar: '#toolbarDemo'
        , title: '人员列表'
        , cols: [
            [
                {type: 'checkbox', fixed: 'left'}
                , {field: 'user_ID', title: '用户ID',width: 100, align: 'center'}
                , {field: 'user_name', title: '姓名', width: 120,align:'center'}
                , {field: 'department_name', title: '部门', width: 180,align:'center'}
                , {field: 'department_ID', title: '部门ID',hide:true, width: 180,align:'center'}
                , {field: 'user_type', title: '员工类型', width: 120, align: 'center',
                    templet: function (d) {
                        if (d.user_type === "0") {
                            return "实习员工";
                        } else if (d.user_type === "1") {
                            return "正式员工";
                        }
                    }
                }
                , {field: 'id', title: '权限ID',hide:true, width: 120,align:'center'}
                , {field: 'name', title: '员工权限', width: 180,align:'center'}
            ]
        ]
        , id: 'textReload'
        , page: false
        , height:730
    });



    //头工具栏事件
    table.on('toolbar(user)', function (obj) {
        var type = obj.event;
        if (type === "add") {
            node = layer.open({
                title: '添加部门'
                , type: 1
                , shift: 4
                , area: ['1000px', '300px'] //宽高
                , content: $('#layer_add')
            });
        } else if (type === "delete") {
            var checkRow = table.checkStatus('textReload');
            if (checkRow.data.length > 0) {
                var ID ="";
                $.each(checkRow.data, function (i, o) {
                    ID += o.user_ID + ",";
                });
                ID = ID.substring(0, ID.length - 1);
                node = layer.confirm('是否删除选中的'+checkRow.data.length+'个用户', {
                    btn: ['确定', '取消'], title: "删除",
                    btn1: function (index, layero) {
                        $.ajax({
                            type: "post",
                            url: 'deleteUser?id=' + ID,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                layer.close(node);
                                layer.msg('删除成功', {icon: 1});
                                table.reload('textReload', {
                                    url: '/getUserList',
                                    method: 'post'
                                });
                            }
                        })
                    },
                    btn2: function (index, layero) {
                        layer.close(node);
                        table.reload('textReload', {
                            url: '/getUserList',
                            method: 'post'
                        });
                    }
                });
            } else {
                layer.msg('请选择至少一个员工', {icon: 2});
            }
        }else if(type==="update") {
            var checkRow = table.checkStatus('textReload');
            if (checkRow.data.length > 1 || checkRow.data.length == 0) {
                layer.msg('选择一个人员数据进行编辑操作', {icon: 2});
            }else {
                var user_ID = checkRow.data[0].user_ID;
                var user_name = checkRow.data[0].user_name;
                var department = checkRow.data[0].department_ID
                var user_type = checkRow.data[0].user_type;
                var user_role = checkRow.data[0].id;
                $("#user_ID1").val(user_ID);
                $("#user_name").val(user_name);
                $("#department1").val(department);
                $("#user_type").val(user_type);
                $("#user_role1").val(user_role);
                form.render();
                node = layer.open({
                    title: '编辑部门'
                    , type: 1
                    , shift: 5
                    , area: ['1000px', '300px'] //宽高
                    , content: $('#layer_edit')
                });
            }
        }
    })

})



layui.use([ 'upload','table'], function(){
    var upload = layui.upload;
    var table = layui.table;
    var index
    upload.render({
        elem: '#file', // 文件选择
        accept:'file',
        url: '/uploadFile',
        auto: false, // 设置不自动提交
        bindAction: '#uploadFile', // 提交按钮
        choose: function(obj) {
            obj.preview(function(index, file, result) {
                $("#fileName").html(file.name);
            });
        },
        before:function(obj){
            index = layer.load();
        },
        done: function(res) {
            layer.close(index);
            if(res.res==="0"){
                layer.msg("上传成功",{icon:1,time:2000});
                table.reload('textReload', {
                    url: '/getUserList',
                    method: 'post',
                });
                $("#fileName").html("");
            }else{
                layer.msg(res.res,{icon:2,time:3000});
                $("#fileName").html("");
            }
        },
        error:function (res) {
            layer.close(index);
            layer.msg("上传错误..");
        }
    });
})



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