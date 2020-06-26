$(function(){
  /**
   * funcExe
   * 関数実行
   */
  function funcExe() {
    anchorLinkScroll();                             // aリンク押下時のスクロール制御
    getHashAndScroll();                             // hash値が存在する場合のスクロール制御
    dispNav();                                      // ナビゲーションバーの表示
    openMenu();                                     // SP時のハンバーガーメニュー
    clickMenu();                                    // SP時のメニュークリック
    scrollAnimation('js_fadeIn', 500, false);       // スクロールアニメーション
    scrollAnimation('js_spinFadeIn', 300, true);    // スクロールアニメーション
    createCalendar();                               // カレンダーの生成
    introHoverEffect();                             // いきもの紹介ページのホバーエフェクト
  }


  /**
   * anchorLinkScroll
   * aリンク押下時のスクロール制御
   */
  function anchorLinkScroll() {
    $('a[href^="#"]').on('click', function() {
      var href = $(this).attr('href');
      var target = $(href == '#' || href == '' ? 'html' : href);
      var targetPos = target.offset().top;
      smoothScroll(targetPos);
      return false;
    });
  }

  /**
   * getHashAndScroll
   * hash値が存在する場合のスクロール制御
   */
  function getHashAndScroll() {
    // リロードの場合は実行しない
    if (window.performance) {
      if (performance.navigation.type === 1) {
        console.log('reload');
        return false;
      }
    }
    var hash = location.hash;
    if (hash.length <= 0) {
      console.log('no hash');
      return false;
    }
    $('body,html').stop().scrollTop(0);
    var $target = $(hash);
    if ($target.lengh <= 0) {
      return false;
    }
    var targetPos = $target.offset().top;
    smoothScroll(targetPos);
    console.log(hash);
  }

  /**
   * smoothScroll
   * スムーズスクロール
   * @param {number} targetPos ターゲット要素の位置
   */
  function smoothScroll(targetPos) {
    var speed = 600; // スクロール速度
    var position = targetPos - 75;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
  }

  /**
   * dispNav
   * ナビゲーションバーの表示
   */
  function dispNav() {
    var dispVal = 100; // 表示開始位置
    var $nav = $('.js_dispNav');
    // ページ読み込み時
    judgeDispNavPos($nav, $(window).scrollTop(), dispVal);
    // スクロール時
    $(window).scroll(function () {
      judgeDispNavPos($nav, $(this).scrollTop(), dispVal);
    });
  }

  /**
   * judgeDispNavPos
   * スクロール位置を判定し、結果に応じて表示クラスを付与する
   * @param {jqueryObj} $target 
   * @param {number} scrollPos 
   * @param {number} dispPos 
   */
  function judgeDispNavPos($target, scrollPos, dispPos) {
    if (scrollPos > dispPos) {
      $target.addClass('is_show');
    } else {
      $target.removeClass('is_show');
    }
  }

  /**
   * openMenu
   * SP時のハンバーガーメニュー
   */
  function openMenu() {
    var $openBtn = $('.js_openMenu');
    var $nav = $('.js_dispNav');
    var $menuCont = $('.js_menuCont');
    var $body = $('body');
    $openBtn.on('click', function() {
      var $this = $(this);
      if ($this.hasClass('is_open')) {
        $this.removeClass('is_open');
        $nav.removeClass('is_open');
        $body.removeClass('is_fixed');
      } else {
        $this.addClass('is_open');
        $nav.addClass('is_open');
        $body.addClass('is_fixed');
      }
      $menuCont.slideToggle();
    });
  }

  /**
   * clickMenu
   * SP時のメニュークリック
   */
  function clickMenu() {
    var $target = $('.js_clickMenu');
    var $body = $('body');
    var $openBtn = $('.js_openMenu');
    var $nav = $('.js_dispNav');
    $target.on('click', function() {
      $body.removeClass('is_fixed');
      $openBtn.removeClass('is_open');
      $nav.removeClass('is_open');
    });
  }

  /**
   * scrollAnimation
   * スクロールアニメーション
   * @param {string} className 対象のクラス名
   * @param {number} triggerPos アニメーションクラス付与位置（px）
   * @param {boolean} continuousFlag 連続アニメーションフラグ
   */
  function scrollAnimation(className, triggerPos, continuousFlag) {
    var $target = $('.' + className);
    if ($target.length <= 0) {
      return false;
    }
    var triggerPos = Number(triggerPos);
    // ページ読み込み時
    judgeTriggerPos($target, $(window).scrollTop(), triggerPos, continuousFlag);
    // スクロール時
    $(window).scroll(function () {
      judgeTriggerPos($target, $(this).scrollTop(), triggerPos, continuousFlag);
    });
  }

  /**
   * judgeTriggerPos
   * スクロール位置を判定し、結果に応じてアニメーションクラスを付与する
   * @param {jqueryObj} $target 対象のjqueryオブジェクト
   * @param {number} currentPos 現在のスクロール位置
   * @param {number} triggerPos アニメーションクラス付与位置（px）
   * @param {boolean} continuousFlag 連続アニメーションフラグ
   */
  function judgeTriggerPos($target, currentPos, triggerPos, continuousFlag) {
    // 連続アニメーション
    if (continuousFlag) {
      if ($target.hasClass('is_show')) {
        return false;
      }
      var firstElPos = $target.eq(0).offset().top;
      var addClassPos = firstElPos - triggerPos;
      if (currentPos > addClassPos) {
        $target.each(function(i) {
          var $this = $(this);
          $this.delay(i * 100).queue(function(next) {
            $this.addClass('is_show');
            next();
          });
        });
      }

    // 要素ごとのアニメーション
    } else {
      $target.each(function() {
        var $this = $(this);
        if (!($this.hasClass('is_show'))) {
          var targetPos = $this.offset().top;
          var addClassPos = targetPos - triggerPos;
          if (currentPos > addClassPos) {
            $this.addClass('is_show');
          }
        }
      });
    }
  }

  /**
   * createCalendar
   * カレンダーの生成
   */
  function createCalendar() {
    if ($('body').find('.js_calendar').length <= 0) {
      return false;
    }

    // 定休日の設定
    // [0: 日, 1: 月, 2:火, 3:水, 4: 木, 5:金, 6:土]
    const REGULAR_HOLIDAY = [2];

    // 年月欄の追加
    var html = '';
    html += '<div class="yearMonthArea"><div class="arrow prev">←</div><div class="yearMonth"></div><div class="arrow next">→</div></div>';

    // tableタグと曜日欄の追加
    const WDAY_ARR = ['日', '月', '火', '水', '木', '金', '土'];
    html += '<table><thead><tr>';
    $.each(WDAY_ARR, function(i, val) {
      if (val === '日') {
        html += '<th class="sunday">' + val + '</th>';
      } else if (val === '土') {
        html += '<th class="saturday">' + val + '</th>';
      } else {
        html += '<th>' + val + '</th>';
      }
    });
    html += '</tr></thead><tbody></tbody></table>';

    // DOM追加
    $('.js_calendar').append(html);

    // 年月書き換え
    var data = new Date();
    var year = data.getFullYear();
    var month = data.getMonth();
    rewritingYearMonth(year, month + 1);

    // 日にち欄の生成
    createDateField(year, month, REGULAR_HOLIDAY);

    // 前/次 月移動用
    changeMonth(REGULAR_HOLIDAY);
  }

  /**
   * rewritingYearMonth
   * 年月欄の書き換え
   * @param {*} year 西暦
   * @param {*} month 月（画面表示する数値）
   */
  function rewritingYearMonth(year, month) {
    $('.js_calendar .yearMonth').html(year + '.' + month);
  }

  /**
   * createDateField
   * 日にち欄の生成
   * @param {*} year 西暦
   * @param {*} month 月（インデックス値：画面表示-1の数値）
   * @param {Array.<number>} regularHolidayArr 定休の曜日コードが格納された配列
   */
  function createDateField(year, month, regularHolidayArr) {
    var html = '';
    $.ajax({
      url:'./doc/closingDate.csv',
      type:'get',
    })
    .done(function(data) {
      var dataArray = formationCsv(data);
      var firstwday = new Date(year, month, 1).getDay();
      var lastday = new Date(year, month + 1, 0).getDate();
      var dayCount = 1;
      
      html += '<tbody>';
      while(dayCount <= lastday) {
        html += '<tr>';
        for (var i = 0; i < 7; i++) {
          // [1日]以前の空欄
          if (i < firstwday && dayCount <= (7 - firstwday)) {
            html += '<td>';
            // [1日~末日]
          } else if (dayCount <= lastday) {
            var stringDate = year.toString() + (month + 1).toString() + dayCount.toString();
            if (regularHolidayArr.indexOf(i) >= 0 || dataArray.indexOf(stringDate) >= 0) {
              html += '<td class="closingDay">';
            } else {
              html += '<td>';
            }
            html += dayCount;
            dayCount++;
            // [末日]後の空欄
          } else {
            html += '<td>';
          }
          html += '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody>';
      $('.js_calendar tbody').replaceWith(html);
    })
    .fail(function() {
      html += '<tbody><tr><td colspan="7">データの取得に失敗しました</td></tr></tbody>';
      $('.js_calendar tbody').replaceWith(html);
    });
  }

  /**
   * formationCsv
   * csvデータの成形
   * @param {string} data ajax通信で取得したcsvデータ
   * @returns {Array.<string>} 配列化した文字列
   */
  function formationCsv(data) {
    var dataArray = [];
    var dataString = data.split('\n');
    for (var i = 0; i < dataString.length; i++) {
    dataArray[i] = dataString[i].replace(/\//g, '').replace(/\s/g, '');
    }
    return dataArray;
  }

  /**
   * changeMonth
   * 前/次 月移動
   * @param {Array.<number>} regularHolidayArr 定休の曜日コードが格納された配列
   */
  function changeMonth(regularHolidayArr) {
    $('.js_calendar .arrow').on('click', function() {
      var yearMonth = $('.js_calendar .yearMonth').html();
      var year = Number(yearMonth.replace(/(?=\.)\..+/, ''));
      var month = Number(yearMonth.replace(/.+(?=\.)\./, ''));
      if ($(this).hasClass('prev')) {
        month -= 1;
      } else {
        month += 1;
      }
      if (month < 1) {
        year -= 1;
        month = 12;
      } else if (month > 12) {
        year += 1;
        month = 1;
      }

      // 年月の書き換え
      rewritingYearMonth (year, month);

      // 日にち欄の生成
      createDateField(year, (month - 1), regularHolidayArr);
    });
  }

  /**
   * introHoverEffect
   * いきもの紹介ページのホバーエフェクト
   */
  function introHoverEffect() {
    var contWidth = 0;
    var $mainCont = $('.intro_main_cont');
    $('.intro_main_item').on({
      'mouseenter': function() {
        var $this = $(this);
        $this.stop();
        $this.addClass('is_focus');
      },
      'mouseleave': function() {
        var $this = $(this);
        $this.removeClass('is_focus');
      }
    });
  }


  // 実行
  funcExe();
});