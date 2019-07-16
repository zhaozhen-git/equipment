<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <title>登录页面</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
    <link rel="stylesheet" type="text/css" href="../../css/bootstrap.css">
    <style>
        .form-group{
            margin-bottom: 10px;
        }
        .modal-footer1{
            padding: 1px;
            height: 35px;
        }
    </style>

</head>
<body>
<header class="banner">
    <div class="container" style="width: 100%; height: 260px;">
        <img src="img/headerjiecang.png" style="width: 100%; height: 260px;">
    </div>
</header>
<main>
    <div class="container-fluid" style=" height:680px; background-image: url(../../img/jiecang_gate.jpg);background-repeat: no-repeat; ">
        <div class="row">
            <div class="col-md-8">
                <h2 style="padding: 20px; margin-left: 260px; font-weight: bold; " >用户登录</h2>
                <div class="container" style="width: 500px; float: left; padding-left: 150px;">
                    <div style="width: 360px; height: 330px; background-color:#bce8f1; border-radius: 5%;">
                        <form style="width: 350px; height: 330px; padding: 35px; margin-left: 10px;" action="/getLogin" method="post">
                            <div class="form-group" style="margin-top: 30px">
                                <label for="username">请输入账号：</label>
                                <input type="text"  class="form-control" name="username" id="username" placeholder="请在此输入账号" style="width: 280px;display: inline-block;" autocomplete="off"/>
                            </div>
                            <div class="form-group">
                                <label for="password">请输入密码：</label>
                                <input type="password" class="form-control" name="password" id="password" placeholder="请输入密码" autocomplete="off">
                            </div>
                            <input type="submit" value="Login" class="btn btn-success btn-lg" style="float: right;margin-top: 50px"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<footer class="modal-footer1">
    <div class="btn-group dropup" style="float: right; margin-right: 40px;">
        <button type="button" class="btn btn-default"><a style="text-decoration:none;">Learn More</a></button>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" >
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li><a class="btn btn-md btn-info">关于我们</a></li>
            <li><a class="btn btn-md btn-info">联系我们</a></li>
        </ul>
    </div>
</footer>

</body>
</html>




