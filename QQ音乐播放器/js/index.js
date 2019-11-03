$(function () {
    $(".content-list").mCustomScrollbar();
    const $audio = $("audio");
    const player = new Player($audio);

    var $progressBar = $(".music_progress_bar");
    var $progressLine = $(".music_progress_line");
    var $progressDot = $(".music_progress_dot");
    console.log($progressBar,$progressLine);
    var progress = Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick();

    //加载歌曲
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                //遍历获取到的数据，创建每一条音乐
                const $musicList = $(".content-list ul");
                $.each(data, function (index, ele) {
                    const $itme = crateMusic(index, ele);
                    $musicList.append($itme)
                });
                initMusicInfo(data[0])
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    //初始化歌曲信息
    function initMusicInfo(music) {
        const $musicImage = $(".song-info-pic img");
        const $musicName = $(".song-info-name a");
        const $musicSinger = $(".song-info-singer a");
        const $musicAblum = $(".song-info-ablum a");
        const $musicProgressName = $(".music-progress-name");
        const $musicProgressTime = $(".music-progress-time");
        const $musicBg = $(".mask_bg");

        //给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 / " + music.time );
        $musicBg.css("background", "url('"+music.cover+"')" );
    }

    //初始化事件监听
    initEvents();
    function initEvents(){
        $(".content-list").delegate(".list-music", "mouseenter", function () {
            //自定义滚动条
            //显示子菜单，隐藏时长
            $(this).find(".list-menu").stop().fadeIn(100);
            $(this).find(".list-time a").stop().fadeIn(100);
            $(this).find(".list-time span").stop().fadeOut(1)
        });
        $(".content-list").delegate(".list-music", "mouseleave", function () {
            //隐藏子菜单，显示时长
            $(this).find(".list-menu").stop().fadeOut(100);
            $(this).find(".list-time a").stop().fadeOut(100);
            $(this).find(".list-time span").stop().fadeIn(1)
        });
        $(".content-list").delegate(".list-check", "click", function () {
            //监听复选框点击事件
            $(this).toggleClass("list-checked");
        });
        //添加子菜单播放按钮的监听
        const $musicPlay = $(".music-play");

        $(".content-list").delegate(".list-menu-play", "click", function () {
            const $time = $(this).parents(".list-music");
            //切换播放图片
            $(this).toggleClass("list-menu-play2");
            //复原其他的播放图标
            $(this).parents(".list-music").siblings().find(".list-menu-play").removeClass("list-menu-play2");
            //同步底部播放按钮
            if ($(this).attr("class").indexOf("list-menu-play2") != -1){
                //当前子菜单时播放状态
                $musicPlay.addClass("music-play2");
                //让文字高亮
                $time.find("div").css("color", "#fff");
                $time.siblings().find("div").css("color", "rgba(255,255,255,0.5)")
            }else{
                $musicPlay.removeClass("music-play2");
                //让文字不高亮
                $(this).parents(".list-music").find("div").css("color", "rgba(255,255,255,0.5)")
            }
            //切换序号的状态
            $time.find(".list-number").toggleClass("list-number2");
            $time.siblings().find(".list-number").removeClass("list-number2");

            //播放音乐
            player.playMusic($time.get(0).index, $time.get(0).music);
            initMusicInfo( $time.get(0).music);
        });
        //监听底部播放按钮
        $musicPlay.click(function () {
            //判断有没有播放过音乐
            if (player.currentIndex == -1){
                $(".list-music").eq(0). find(".list-menu-play").trigger("click");
            }else {
                $(".list-music").eq(player.currentIndex). find(".list-menu-play").trigger("click");
            }
        });

        // 监听底部上一首按钮
        $(".music-pre").click(function () {
            $(".list-music").eq(player.perIndex()).find(".list-menu-play").trigger("click")
        });

        //监听底部下一首按钮
        $(".music-next").click(function () {
            $(".list-music").eq(player.nextIndex()).find(".list-menu-play").trigger("click")
        });
        //监听删除
        $(".content-list").delegate(".list-menu-del","click", function () {
            var $itme = $(this).parents(".list-music");

            //判断音乐是否在播放
            if ($itme.get(0).index == player.currentIndex){
                $(".music-next").trigger("click");
            }
            $itme.remove();
            player.changeMusic($itme.get(0).index);

            //重新排序
            $(".list-music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list-number").text(index + 1);
            })
        })
    }

    //创建一条音乐
    function crateMusic(index, music) {
        const $itme = $("<li class=\"list-music\">\n" +
            "                        <div class=\"list-check \"><i></i></div>\n" +
            "                        <div class=\"list-number\">" + (index + 1) + "</div>\n" +
            "                        <div class=\"list-name\">" + music.name + "\n" +
            "                            <div class=\"list-menu\">\n" +
            "                                <a href=\"javascript:;\" title=\"播放\" class='list-menu-play'></a>\n" +
            "                                <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"list-singer\">" + music.singer + "</div>\n" +
            "                        <div class=\"list-time\">\n" +
            "                            <span>" + music.time + "</span>\n" +
            "                            <a href=\"javascript:;\" class='list-menu-del'></a>\n" +
            "                        </div>\n" +
            "                    </li>");
        $itme.get(0).index = index;
        $itme.get(0).music = music;
        return $itme;
    }

});