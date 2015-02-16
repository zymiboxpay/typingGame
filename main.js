/**
 * 字母/数字小球类
 *
 * 循环间隔 0.1 秒
 *
 * 一个循环内要做的事：
 *     检测所有字母/数字小球的状态
 *     设置相应状态
 *     判断输赢
 *
 * 键盘事件监测
 */

/**
 * 属性：
 *     字母/数字
 *     生命时长 最短为 1 秒，最长为3秒
 *     位置 canvas 大小 是 800 * 800
 *     半径
 *     初速度 暂定为零
 *     颜色 随生命而变 //先放着不实现
 *     状态 活着/死亡/飞升 1/0/2
 *
 */

$(function() {

    var PI = Math.PI;
    var BASE_LIFE_TIME = 1;
    var LONGEST_LIFE_TIME = 3;

    var INTERVAL_TIME = 0.1;
    var LIBRARY_CONFIG = 'all';

    var LIBRARY = {
        lowerCaseLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        capitalLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        signs: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '{', '}', '[', ']', ';', ':', "'", '"', '\\', '/', '?', ',', '.', '<', '>'],
        all: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '{', '}', '[', ']', ';', ':', "'", '"', '\\', '/', '?', ',', '.', '<', '>']
    };

    var RADIUS = 20;

    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 800;


    var ALIVE = true;
    var loopId;
    var success = 0;
    var fail = 0;
    var miss = 0;
    var pause = false;
    var $success = $('.success');
    var $fail = $('.fail');
    var $miss = $('.miss');
    var $exerciseType = $('.exercise-type');

    var NumBall = function() {
        this.status = 1;
        this.lifeTime = GenNum.decimal(BASE_LIFE_TIME, LONGEST_LIFE_TIME, 1);
        this.libraryIndex = GenNum.integer(0, LIBRARY[LIBRARY_CONFIG].length);
        this.label = LIBRARY[LIBRARY_CONFIG][this.libraryIndex];
        this.radius = RADIUS;
        this.position = {
            x: GenNum.decimal(RADIUS, CANVAS_WIDTH - RADIUS, 1),
            y: GenNum.decimal(RADIUS, CANVAS_HEIGHT - RADIUS, 1)
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.setColor('bgcolor', [153, 204, 255, 1]); //[153,204,255,1];
        this.setColor('fontcolor', [102, 102, 102, 1]); //[102,102,102,1];

    }

    NumBall.prototype = {
        setColor: function(prop, rgbaArray) {
            this[prop] = 'rgba(' + rgbaArray[0] + ', ' +
                rgbaArray[1] + ', ' +
                rgbaArray[2] + ', ' +
                rgbaArray[3] + ')';
        }
    }



    /**
     * 生成数字的工具类
     *
     */

    var GenNum = {
        // 范围 MIN-MAX TOFIX位小数，不包括 MAX
        decimal: function(MIN, MAX, TOFIX) {
            return MIN + Math.floor(Math.random() * (MAX - MIN) * Math.pow(10, TOFIX)) / Math.pow(10, TOFIX);
        },
        //范围 MIN-MAX 整数 不包括 MAX
        integer: function(MIN, MAX) {
            return this.decimal(MIN, MAX, 0);
        }
    }



    /**
     * 真正干活的区域
     *     画小球
     */
    var context = document.getElementById('canvas').getContext('2d');
    // var numBallArr = [];
    var numBall = new NumBall();

    var drawNumBall = function(numBall, context) {
        //画圆
        drawBall(numBall, context);
        //画字母/数字
        drawLabel(numBall, context);

    }

    var drawBall = function(numBall, context) {
        context.save();
        context.lineWith = 0.5;
        context.strokeStyle = numBall.bgcolor;
        context.fillStyle = numBall.bgcolor;
        context.beginPath();
        context.moveTo(numBall.position.x, numBall.position.y);
        context.arc(numBall.position.x, numBall.position.y, numBall.radius, 0, PI * 2, true);
        context.fill();
        context.stroke();
        context.restore();
    }

    var drawLabel = function(numBall, context) {
        context.save();
        context.font = '20pt Arial';
        context.fillStyle = genFontColor();
        context.fillText(numBall.label, numBall.position.x - 10, numBall.position.y + 10);
        context.restore();
        console.log(numBall.libraryIndex);

        function genFontColor(){
            //小写字母用别的颜色
            if(numBall.label>= 'a' && numBall.label<= 'z'){
                numBall.setColor('fontcolor',[204,51,255,1]);
            }
            return numBall.fontcolor;
        }

    }

    

    var start = function() {
        success = 0;
        fail = 0;
        miss = 0;
        LIBRARY_CONFIG = $exerciseType.val();
        context.clearRect(0, 0, 800, 800);
        drawNumBall(numBall, context);
        keyObj.getHitKey();
        loop();
    }

    var loop = function() {

        //检测键盘事件

        var hitKey = getKey();

        //如果对应得上
        if(checkKey(hitKey)){
            // numBall.lifeTime = 0;
            numBall.status = 2;
            success += 1;
        }
        //否则
        //减少小球生命
        else {
            numBall.lifeTime -= INTERVAL_TIME
            //如果是误按
            if(hitKey != ''){
                miss += 1;
            }
            //如果小球阳寿已尽。。。
            if(numBall.lifeTime <= 0){
                // numBall.lifeTime = 0;
                numBall.status = 0;
                fail += 1;
            }
        }

        //检测小球状态
        if (numBall.status != 1) {
            numBall = new NumBall();
        }


        //更新得分计数
        updateScore();
        //计数，判断输赢
        if (fail == 3) {
            clearTimeout(loopId);
            alert('you lose!');
            return;
        }

        if (success == 50) {
            clearTimeout(loopId);
            alert('you win!');
            return;
        }


        context.clearRect(0, 0, 800, 800);
        drawNumBall(numBall, context);

        loopId = setTimeout(function() {
            loop();
        }, INTERVAL_TIME * 1000);
    }

    var getKey = function() {
        var key = keyObj.key;
        
        keyObj.key = '';
        return key;
    }

    var checkKey = function(keyCode){
        console.log(numBall.label.charCodeAt(),keyCode);
        return numBall.label.charCodeAt() == keyCode;
    }

    var keyObj = {
        key: '',
        getHitKey: function() {
            var me = this;
            $(document).on('keypress', function(e){
                me.key = e.which;
                console.log(e.which);
            });
        }
    }


    var updateScore = function(){
        $success.text('success: ' + success);
        $fail.text('fail: ' + fail);
        $miss.text('miss: ' + miss);
    }


    //开始
    $('.begin').on('click', function(){
        clearTimeout(loopId);
        start(numBall, context);
    });

    //暂停
    $('.pause').on('click', function(){
        if(pause){
            loop();
        }
        else {
            clearTimeout(loopId);
        }
        pause = !pause;
    });


});