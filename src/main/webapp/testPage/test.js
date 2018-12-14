$(function(){
    var operator  = Af.getQueryString("operator");
    var req = {};
    req.userName = operator;
    req.passWord = "kaizi21.zjy";
    Af.rest("loginApi.api", req, function(ans) {
        alert(ans.msg);
        Af.trace(ans);
    });
});