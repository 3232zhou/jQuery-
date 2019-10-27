$(function () {
   $(".atrule").click(function () {
       $(".rule").stop().fadeIn(1000);
   }) ;
    $(".close").click(function () {
        $(".rule").fadeOut(100);
    });
    //开始按钮点击关闭
    $(".start").click(function () {
        $(this).stop().fadeOut(100);
        //处理进度条的方法
        progress();
        animation();

    });
    $(".new-start").click(function () {
        $(".end") .fadeOut(100);
        progress();
        animation();
    });
    //处理进度条
    function progress() {
        //重新设置进度条
        $(".progress").css({
            width: 180
        });
        //用定时器
        var time = setInterval(function () {
            var progressWidth = $(".progress").width();

            progressWidth -= 10;

            $(".progress").css({
                width: progressWidth
            });
            //判断progressWidth是否走完了
            if (progressWidth <=  0){
                clearInterval(time);
                $(".end").fadeIn(100);
                stopanimation();
            }
        },1000)
    }
    var wolfItme;
    //处理灰太狼动画
    function animation() {
        // 1.定义两个数组保存所有灰太狼和小灰灰的图片
        var wolf_1=['images/h0.png','images/h1.png','images/h2.png','images/h3.png','images/h4.png','images/h5.png','images/h6.png','images/h7.png','images/h8.png','images/h9.png'];
        var wolf_2=['images/x0.png','images/x1.png','images/x2.png','images/x3.png','images/x4.png','images/x5.png','images/x6.png','images/x7.png','images/x8.png','images/x9.png'];
        // 2.定义一个数组保存所有可能出现的位置
        var arrPos = [
            {left:"100px",top:"115px"},
            {left:"20px",top:"160px"},
            {left:"190px",top:"142px"},
            {left:"105px",top:"193px"},
            {left:"19px",top:"221px"},
            {left:"202px",top:"212px"},
            {left:"120px",top:"275px"},
            {left:"30px",top:"295px"},
            {left:"209px",top:"297px"}
        ];
        //创建一个图片
        var $image = $("<img src='' class='wolfImage'>");
        //随机获取图片位置
        var posIndex = Math.round(Math.random() * 8);
        //随机获取数组的类型
        var wolfType = Math.round(Math.random()) == 0 ? wolf_1:wolf_2;
        //设置图片的切换
        window.wolfIndex = 0;
        window.wolfIndexEnd = 5;
        wolfItme = setInterval(function () {
            if (wolfIndex > wolfIndexEnd ){
                $image.remove();
                clearInterval(wolfItme);
                animation();
            }
            //设置图片的内容
            $image.attr("src", wolfType[wolfIndex]);
            wolfIndex++;
        },150);
        //设置图片的位置
        $image.css({
            position: "absolute",
            left: arrPos[posIndex].left,
            top: arrPos[posIndex].top,
        });
        $(".container").append($image);
        gameRules($image);
    }
    function gameRules($image) {
        $image.one("click", function () {
            window.wolfIndex = 5;
            window.wolfIndexEnd = 9;
           var $src = $(this).attr("src");
           //判断图片是否时灰太狼
            var flag = $src.indexOf("h") >= 0; //没有时-1
            if (flag){
                //+10
                // console.log(parseInt($(".scroll").text()) + 1);
                $(".scroll").text(parseInt($(".scroll").text()) + 10)
            }else {
                $(".scroll").text(parseInt($(".scroll").text()) - 10)
            }
        })
    }
    function stopanimation() {
        $(".wolfImage").remove();
        clearInterval(wolfItme);
    }
});