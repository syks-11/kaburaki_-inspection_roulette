$(document).ready(function() {
    var wheel = $('.wheel');
    var lineWrapper = $('.lineWrapper');
    var time = 10000;
    var prefecture = $('.mapSet01 .svg');

    var checkedValues;
    var checkedIds;
    var valuesNum;

    function inputDestination() {
        // チェックされた項目の値を配列で取得
        checkedValues = $('input[name="destination"]:checked').map(function() {
            return this.value;
        }).get();

        // チェックがついているチェックボックスのdata-idを取得して配列に格納
        checkedIds = $('input[name="destination"]:checked').map(function() {
            return $(this).data('index');
        }).get();

        // 配列の一覧を表示
        console.log(checkedIds);

        // 都道府県のアクティブclassを解除
        prefecture.removeClass('active');

        // チェックボックスにチェックがついている都道府県の有効化
        $('input[name="destination"]:checked').each(function() {
            var index = $(this).data('index');
            $('.mapSet01 .svg[data-index="' + index +'"]').addClass('active');
        });
    };


    function wheelSet() {
        valuesNum =  checkedValues.length;

        console.log('valuesNum' + valuesNum)

        // 選択された項目を表示するエリアをクリア
        wheel.empty();
        lineWrapper.empty();

        // 配列をループして、ルーレットのHTMLにオブジェクトを生成し表示
        $.each(checkedValues, function(i, value) {
            $('<div class="item" data-index=' + checkedIds[i] +'><span class="bg"></span><span class="value">' + value + '</span></div>').css({
                'transform': 'rotate(' + (360 / valuesNum) * i + 'deg) translate(0, -125px)'
            }).appendTo(wheel);
            $('<div class="line"><span></span></div>').css({
                'transform': 'rotate(' + (360 / valuesNum) * i + 'deg) translate(0, -125px)'
        }).appendTo(lineWrapper);
        });

        // ルーレットの項目同士の区切り線を表示
        lineWrapper.css('transform', 'rotate(' + ((360 / valuesNum) - ((360 / valuesNum)/2))  + 'deg)');

        var radius = 250;
        var length = 2 * radius * Math.PI;
        var itemWidth = (length / valuesNum) ;

        //ルーレットの項目の背景の幅を指定
        $('.item .bg').css('width',itemWidth);
    }


    function spinFunc() {
        var rotation = Math.floor(Math.random() * (5400 - 5040 + 1)) + 5040; // 10回転以上
        var itemDeg = 360 / valuesNum;
        var result = rotation - 5040;
        var resultDeg = result / itemDeg;
        var goal = flooredNumber = Math.round(valuesNum - resultDeg) ;


        // SPINボタンを非活性にする
        $('#spin').addClass('is-disabled');

        var destinationNum = checkedIds[goal];

        console.log('goal : ' + goal);

        // 数値をチェックし、必要に応じて0を付与
        var formattedNumber = (destinationNum < 10) ? '0' + destinationNum : destinationNum;

        // 結果の画像を削除
        $('#result').children().remove();

        // コンソールに行き先の都道府県番号を表示
        if(goal != valuesNum) {
            console.log('行き先は : ' + formattedNumber);
            // 結果の画像を挿入
            $('#result').append('<img src="images/result'+ formattedNumber +'.svg">');
        } else {
            console.log('行き先は : ' + checkedIds[0]);
            formattedNumber = (checkedIds[0] < 10) ? '0' + checkedIds[0] : checkedIds[0];
            // 結果の画像を挿入
            $('#result').append('<img src="images/result'+ formattedNumber +'.svg">');
        }

        // ルーレットと区切り線を回転させる
        wheel.css({
            'transition': 'transform ' + time + 'ms',
            'transform': 'rotate(' + rotation + 'deg)'
        });
        lineWrapper.css({
            'transition': 'transform ' + time + 'ms',
            'transform': 'rotate(' + (rotation + ((360 / valuesNum)/2)) + 'deg)'
        });

        // ボタンを押したtime秒後の処理
        setTimeout(function(){
            // トランジションを0に
            wheel.css({
                'transition': 'transform 0s',
            });
            lineWrapper.css({
                'transition': 'transform 0s',
            });
            // 行き先の都道府県にターゲットのclassを付与
            if(goal == valuesNum) {
                $('#destination').html(checkedValues[0]);
                $('.mapSet01 .svg.active').eq(0).addClass('target');
            } else {
                $('#destination').html(checkedValues[goal]);
                $('.mapSet01 .svg.active').eq(goal).addClass('target');
            }
        },time);

        // ボタンを押したtime+0.5秒後の処理
        setTimeout(function(){

            // 鏑木 の絶対位置を取得
            var itemOffset = $('.mapSet01 .svg.target .kaburaki').offset();
            // マップ の絶対位置を取得
            var wrapperOffset = $('.mapSet01 .wrapper').offset();
            // マップ から見た 鏑木 の相対的な位置を計算
            var relativeTop = itemOffset.top - wrapperOffset.top + 60;
            var relativeLeft = itemOffset.left - wrapperOffset.left + 30;
            // マップエリアの中心点を設定
            $('.mapSet01 .mapArea').css({
                'top' : '-' + relativeTop + 'px',
                'left' : '-' + relativeLeft + 'px',
                'transform' : 'translate3d(50%,50%,0)',
            })
        },time+500);

        // ボタンを押したtime+1.5秒後の処理
        setTimeout(function(){
            // マップエリアの拡大
            $('.mapSet01 .container').css('transform', 'scale(3.9,3.9)');

            // RESETボタンの非活性を解除
            $('#reset').removeClass('is-disabled');
        },time+1500);

        // ボタンを押したtime+2.5秒後の処理
        setTimeout(function(){
            // 結果のエリアを表示
            $('.resultArea').addClass('is-active');
        },time+2500);
    }

    function resetFunc() {
        // RESETボタンを非活性にする
        $('#reset').addClass('is-disabled');

        // ルーレットの角度を初期化
        wheel.css({
            'transform': 'rotate(0deg)'
        });
        lineWrapper.css({
            'transform': 'rotate('+ ((360 / valuesNum) - ((360 / valuesNum)/2))  +'deg)'
        });
        // SPINボタンを有効化
        $('#spin').removeClass('is-disabled');
        // $('#destination').html('');

        $('.resultArea').removeClass('is-active');

        // マップの拡大率を初期化
        $('.mapSet01 .container').css('transform', 'scale(1,1)');

        // RESETボタンを押した1秒後の処理
        setTimeout(function(){
            // マップの中心点の初期化
            $('.mapSet01 .mapArea').css({
                'top' : '50%',
                'left' : '50%',
                'transform' : 'translate3d(-50%,-50%,0)',
            });
        },1000);

        // RESETボタンを推した2秒後の処理
        setTimeout(function(){
            // 都道府県のアクティブclassを解除
            prefecture.removeClass('target');
        },2000);
    }

    inputDestination();
    resetFunc();
    wheelSet();


    // 都道府県のチェックボックスを押した際の処理
    $('input[name="destination"]').on('input', function() {
        inputDestination();
        wheelSet();
    });

    // スピンボタンのクリックイベント
    $('#spin').click(function() {
        spinFunc();
        $('input[name="destination"]').prop('disabled', true);
    });

    // RESETボタンを押したときの処理
    $('#reset').click(function() {
        resetFunc();
        $('input[name="destination"]').prop('disabled', false);
    });


    // ロゴのチェックボックスを押した際の処理
    $('input[name="logo"]').on('input', function() {
        if($(this).prop("checked")) {
            $('.js-logo').show();
        } else {
            $('.js-logo').hide();
        }
    });

    // 都道府県ボックスのチェックボックスを押した際の処理
    $('input[name="result"]').on('input', function() {
        if($(this).prop("checked")) {
            $('.resultArea').removeClass('is-hide');
            $('.resultArea').addClass('is-show');
        } else {
            $('.resultArea').removeClass('is-show');
            $('.resultArea').addClass('is-hide');
        }
    });

});
