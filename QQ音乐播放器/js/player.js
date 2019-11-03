//封装类
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList:[],
        init:function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            //判断是否时同一首歌
            if (this.currentIndex == index){
                if (this.audio.paused){
                    this.audio.play();
                }else {
                    this.audio.pause();
                }
            }else {
                //不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        perIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        changeMusic: function (index) {
            //删除对应的数据
            this.musicList.splice(index, 1);
            //判断删除的音乐是否在播放音乐的前面
            if (index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        }
    };
    Player.prototype.init.prototype = Player.prototype; //把init的原型改成Player的原型
    window.Player = Player;
})(window);