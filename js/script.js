$(function () {

  /* ---- Mode toggle (Rebahan / Sehat, thematically = dark/light) ---- */
  $('#modeToggle').on('click', function () {
    var isSehat = $('body').attr('data-mode') === 'sehat';
    if (isSehat) {
      $('body').attr('data-mode', 'rebahan');
      $(this).html('🌙 Mode Rebahan');
    } else {
      $('body').attr('data-mode', 'sehat');
      $(this).html('☀️ Mode Sehat');
    }
  });

  /* ---- Hero mascot slider ---- */
  var mascotStages = [
    { max: 33, src: 'mascot/aset10.png', alt: 'Maskot kukang santai di bean bag — rebahan ringan' },
    { max: 66, src: 'mascot/aset7.png', alt: 'Maskot kukang main HP di bean bag' },
    { max: 100, src: 'mascot/aset6.png', alt: 'Maskot kukang rebahan maksimal dengan tablet dan keripik' }
  ];
  function updateHeroMascot(value) {
    var $img = $('#heroMascotImg');
    if (!$img.length) return;
    var stage = mascotStages[mascotStages.length - 1];
    for (var i = 0; i < mascotStages.length; i++) {
      if (value <= mascotStages[i].max) {
        stage = mascotStages[i];
        break;
      }
    }
    if ($img.attr('src') !== stage.src) {
      $img.css('opacity', 0.35);
      setTimeout(function () {
        $img.attr({ src: stage.src, alt: stage.alt }).css('opacity', 1);
      }, 120);
    }
  }
  $('#rebahanSlider').on('input', function () {
    updateHeroMascot(parseInt(this.value, 10));
  });

  /* ---- Font size toggle ---- */
  var sizes = ['base', 'lg', 'xl'];
  var sizeLabels = { base: 'A+', lg: 'A++', xl: 'A+++' };
  var current = 0;
  $('#fontToggle').on('click', function () {
    current = (current + 1) % sizes.length;
    document.documentElement.setAttribute('data-fontsize', sizes[current]);
    $(this).text(sizeLabels[sizes[current]]);
  });

  /* ---- Sticky nav active link on scroll ---- */
  var sections = $('section, footer').map(function () { return this.id ? this : null; });
  $(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop() + 120;
    sections.each(function () {
      var top = $(this).offset().top, bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        $('.navlinks a').removeClass('active');
        $('.navlinks a[href="#' + this.id + '"]').addClass('active');
      }
    });
  });

  /* ---- Cermin Kebiasaan cards ---- */
  $('.mirror-card').on('click', function () {
    $(this).toggleClass('open');
  });

  /* ---- Animated counters on scroll into view ---- */
  var counted = false;
  function animateCounters() {
    if (counted) return;
    var $fakta = $('#fakta');
    if (!$fakta.length) return;
    var statTop = $fakta.offset().top;
    if ($(window).scrollTop() + $(window).height() > statTop + 80) {
      counted = true;
      $('.stat-num').each(function () {
        var $this = $(this);
        var target = parseFloat($this.data('target'));
        var suffix = $this.data('suffix') || '';
        var isDecimal = target % 1 !== 0;
        $({ v: 0 }).animate({ v: target }, {
          duration: 1400,
          step: function (now) {
            $this.text((isDecimal ? now.toFixed(1) : Math.floor(now)) + suffix);
          },
          complete: function () {
            $this.text((isDecimal ? target.toFixed(1) : target) + suffix);
          }
        });
      });
    }
  }
  $(window).on('scroll', animateCounters);
  animateCounters();

  /* ---- Engine Kuis: 10 soal inti + maks. 2 adaptif ---- */
  var CORE_QUIZ_QUESTIONS = [
    {
      id: 'screen_time',
      category: 'digital',
      question: 'Dalam sehari, kira-kira berapa lama kamu menghabiskan waktu di depan layar untuk hiburan?',
      options: [
        { label: '< 2 jam', score: 1 },
        { label: '2–4 jam', score: 2 },
        { label: '4–7 jam', score: 3 },
        { label: '> 7 jam', score: 4 }
      ]
    },
    {
      id: 'bangun_tidur',
      category: 'digital',
      question: 'Apa yang biasanya kamu lakukan dalam 15 menit pertama setelah bangun?',
      options: [
        { label: 'Langsung beraktivitas tanpa HP', score: 1 },
        { label: 'Sesekali cek HP', score: 2 },
        { label: 'Cek notifikasi/media sosial', score: 3 },
        { label: 'Langsung scrolling cukup lama', score: 4, recoKey: 'morning_detox' }
      ]
    },
    {
      id: 'lama_duduk',
      category: 'gerak',
      question: 'Kalau sedang belajar, bekerja, bermain, atau menonton, berapa lama kamu biasanya bisa duduk tanpa berdiri?',
      options: [
        { label: '< 30 menit', score: 1 },
        { label: '30–60 menit', score: 2 },
        { label: '1–2 jam', score: 3 },
        { label: '> 2 jam', score: 4, recoKey: 'stand_up_breaks' }
      ]
    },
    {
      id: 'gerak',
      category: 'gerak',
      question: 'Dalam seminggu, seberapa sering kamu sengaja melakukan aktivitas fisik?',
      options: [
        { label: 'Hampir setiap hari', score: 1 },
        { label: '3–4 kali', score: 2 },
        { label: '1–2 kali', score: 3 },
        { label: 'Hampir tidak pernah', score: 4, recoKey: 'regular_movement' }
      ]
    },
    {
      id: 'tidur',
      category: 'tidur',
      question: 'Pada hari biasa, bagaimana pola tidurmu?',
      options: [
        { label: 'Cukup dan teratur', score: 1 },
        { label: 'Kadang tidur terlalu larut', score: 2 },
        { label: 'Sering kurang tidur', score: 3 },
        { label: 'Sangat tidak teratur/sering begadang', score: 4, recoKey: 'sleep_schedule' }
      ]
    },
    {
      id: 'hp_tidur',
      category: 'tidur',
      question: 'Apa yang paling sering kamu lakukan ketika sudah waktunya tidur tetapi masih memegang HP?',
      options: [
        { label: 'Langsung meletakkan HP', score: 1 },
        { label: 'Cek sebentar lalu tidur', score: 2 },
        { label: 'Scrolling/menonton cukup lama', score: 3 },
        { label: 'Sering tidak sadar sudah larut karena HP', score: 4, recoKey: 'night_screen_detox' }
      ]
    },
    {
      id: 'makanan',
      category: 'makan',
      question: 'Seberapa sering makanan cepat saji/ultra-proses menjadi pilihan utama ketika kamu lapar?',
      options: [
        { label: 'Jarang', score: 1 },
        { label: '1–2 kali seminggu', score: 2 },
        { label: '3–5 kali seminggu', score: 3 },
        { label: 'Hampir setiap hari', score: 4, recoKey: 'healthy_snack' }
      ]
    },
    {
      id: 'minuman',
      category: 'makan',
      question: 'Seberapa sering kamu mengonsumsi minuman berpemanis seperti soda, boba, teh kemasan, atau kopi susu?',
      options: [
        { label: 'Jarang', score: 1 },
        { label: 'Beberapa kali seminggu', score: 2 },
        { label: 'Sekitar 1 kali sehari', score: 3 },
        { label: 'Lebih dari 1 kali sehari', score: 4, recoKey: 'reduce_sweet_drinks' }
      ]
    },
    {
      id: 'makan_screen',
      category: 'makan',
      question: 'Seberapa sering kamu makan sambil scrolling, menonton, atau bermain?',
      options: [
        { label: 'Hampir tidak pernah', score: 1 },
        { label: 'Sesekali', score: 2 },
        { label: 'Sering', score: 3 },
        { label: 'Hampir setiap kali makan', score: 4, recoKey: 'mindful_eating' }
      ]
    },
    {
      id: 'kondisi_tubuh',
      category: 'wellbeing',
      question: 'Setelah seharian beraktivitas di depan layar, apa yang paling sering kamu rasakan?',
      options: [
        { label: 'Tubuh terasa normal', score: 1 },
        { label: 'Sedikit pegal/lelah', score: 2 },
        { label: 'Sering pegal, mata lelah, atau kaku', score: 3 },
        { label: 'Sangat tidak nyaman dan mengganggu aktivitas', score: 4, recoKey: 'body_recovery' }
      ]
    }
  ];

  var ADAPTIVE_BANK = {
    screen_sit: {
      id: 'adaptive_screen_sit',
      category: 'gerak',
      question: 'Dari waktu tersebut, berapa banyak yang biasanya kamu habiskan sambil duduk atau rebahan?',
      options: [
        { label: 'Sedikit — sering berdiri atau bergerak', score: 1 },
        { label: 'Sekitar separuhnya', score: 2 },
        { label: 'Sebagian besar sambil duduk', score: 3 },
        { label: 'Hampir seluruhnya sambil rebahan', score: 4, recoKey: 'stand_up_breaks' }
      ]
    },
    sit_break: {
      id: 'adaptive_sit_break',
      category: 'gerak',
      question: 'Saat harus duduk lama, seberapa sering kamu menyempatkan berdiri atau stretching?',
      options: [
        { label: 'Rutin tiap 30–60 menit', score: 1 },
        { label: 'Sesekali kalau ingat', score: 2 },
        { label: 'Jarang sekali', score: 3 },
        { label: 'Hampir tidak pernah', score: 4, recoKey: 'regular_movement' }
      ]
    },
    kontrol: {
      id: 'adaptive_kontrol',
      category: 'wellbeing',
      question: 'Seberapa sering kamu berniat menggunakan HP sebentar tetapi akhirnya jauh lebih lama?',
      options: [
        { label: 'Hampir tidak pernah', score: 1 },
        { label: 'Sesekali', score: 2 },
        { label: 'Sering', score: 3 },
        { label: 'Hampir setiap hari', score: 4, recoKey: 'app_timers' }
      ]
    },
    dampak: {
      id: 'adaptive_dampak',
      category: 'wellbeing',
      question: 'Seberapa sering kebiasaan digital membuatmu menunda hal penting seperti belajar, tidur, makan, olahraga, atau bersosialisasi?',
      options: [
        { label: 'Hampir tidak pernah', score: 1 },
        { label: 'Sesekali', score: 2 },
        { label: 'Sering', score: 3 },
        { label: 'Hampir setiap hari', score: 4, recoKey: 'focus_priority' }
      ]
    }
  };

  var MAX_ADAPTIVE = 2;
  var activeQuestions = [];
  var currentQuestionIdx = 0;
  var userAnswers = [];
  var adaptiveCount = 0;
  var quizBusy = false;

  function answerById(id) {
    for (var i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] && userAnswers[i].qId === id) return userAnswers[i];
    }
    return null;
  }

  function questionExists(id) {
    return activeQuestions.some(function (item) { return item.id === id; });
  }

  function insertAdaptive(question) {
    if (!question || adaptiveCount >= MAX_ADAPTIVE) return;
    if (questionExists(question.id)) return;
    activeQuestions.splice(currentQuestionIdx + 1, 0, question);
    adaptiveCount += 1;
  }

  function pickAdaptiveFollowUp(qData, score) {
    if (qData.id === 'screen_time' && score >= 3) {
      insertAdaptive(ADAPTIVE_BANK.screen_sit);
      return;
    }
    if (qData.id === 'lama_duduk' && score >= 4) {
      insertAdaptive(ADAPTIVE_BANK.sit_break);
      return;
    }
    if ((qData.id === 'hp_tidur' || qData.id === 'tidur') && score >= 3) {
      insertAdaptive(ADAPTIVE_BANK.kontrol);
      return;
    }
    if (qData.id === 'kondisi_tubuh') {
      var screenAns = answerById('screen_time');
      var makanScreen = answerById('makan_screen');
      var highDigital = (screenAns && screenAns.score >= 3) || (makanScreen && makanScreen.score >= 3) || score >= 3;
      if (highDigital) insertAdaptive(ADAPTIVE_BANK.dampak);
    }
  }

  function initQuiz() {
    if (!$('#quizCardContent').length) return;
    activeQuestions = JSON.parse(JSON.stringify(CORE_QUIZ_QUESTIONS));
    currentQuestionIdx = 0;
    userAnswers = [];
    adaptiveCount = 0;
    quizBusy = false;
    $('#quizResultView').hide();
    $('#quizActiveView').show();
    renderQuestion(false);
  }

  function renderDots() {
    var $dots = $('#quizDots');
    $dots.empty();
    var total = activeQuestions.length;
    for (var i = 0; i < total; i++) {
      var isCompleted = i < currentQuestionIdx;
      var isActive = i === currentQuestionIdx;
      var dotClass = 'quiz-dot' + (isActive ? ' active' : '') + (isCompleted ? ' completed' : '');
      $dots.append('<span class="' + dotClass + '"></span>');
    }
  }

  function renderQuestion(fromSlide) {
    if (currentQuestionIdx >= activeQuestions.length) {
      showQuizResults();
      return;
    }

    var qData = activeQuestions[currentQuestionIdx];
    var total = activeQuestions.length;

    renderDots();
    $('#quizStepCounter').text((currentQuestionIdx + 1) + ' / ' + total);

    var optsHtml = '';
    qData.options.forEach(function (opt, idx) {
      optsHtml +=
        '<button type="button" class="quiz-opt-btn" data-idx="' + idx + '" data-score="' + opt.score + '">' +
          '<span class="opt-text">' + opt.label + '</span>' +
        '</button>';
    });

    var enterClass = fromSlide ? 'quiz-card-animated slide-in' : 'quiz-card-animated fade-in';
    var cardHtml =
      '<div class="' + enterClass + '">' +
        '<h3 class="quiz-card-question">' + qData.question + '</h3>' +
        '<div class="quiz-options-list">' + optsHtml + '</div>' +
      '</div>';

    $('#quizCardContent').html(cardHtml);
    quizBusy = false;
  }

  $('#quizCardContent').on('click', '.quiz-opt-btn', function () {
    if (quizBusy) return;
    var $btn = $(this);
    if ($btn.hasClass('picked')) return;

    quizBusy = true;
    $('.quiz-opt-btn').removeClass('picked').prop('disabled', true);
    $btn.addClass('picked');

    var optIdx = parseInt($btn.data('idx'), 10);
    var score = parseInt($btn.data('score'), 10);
    var qData = activeQuestions[currentQuestionIdx];

    userAnswers[currentQuestionIdx] = {
      qId: qData.id,
      category: qData.category,
      score: score,
      recoKey: qData.options[optIdx].recoKey || null
    };

    pickAdaptiveFollowUp(qData, score);

    var $card = $('#quizCardContent .quiz-card-animated');
    $card.removeClass('slide-in fade-in').addClass('slide-out');

    setTimeout(function () {
      currentQuestionIdx += 1;
      renderQuestion(true);
    }, 280);
  });

  function showQuizResults() {
    $('#quizActiveView').fadeOut(280, function () {
      calculateAndRenderScore();
      $('#quizResultView').fadeIn(360);
    });
  }

  function calculateAndRenderScore() {
    var totalRawScore = 0;
    var answered = userAnswers.length;
    var maxRawScore = answered * 4;
    var minRawScore = answered * 1;

    var catScores = {
      digital: { sum: 0, count: 0, icon: '📱', label: 'DIGITAL' },
      gerak: { sum: 0, count: 0, icon: '🪑', label: 'GERAK' },
      tidur: { sum: 0, count: 0, icon: '😴', label: 'TIDUR' },
      makan: { sum: 0, count: 0, icon: '🍔', label: 'MAKAN' },
      wellbeing: { sum: 0, count: 0, icon: '🧠', label: 'WELLBEING' }
    };

    userAnswers.forEach(function (ans) {
      totalRawScore += ans.score;
      if (catScores[ans.category]) {
        catScores[ans.category].sum += ans.score;
        catScores[ans.category].count += 1;
      }
    });

    var span = Math.max(1, maxRawScore - minRawScore);
    var score120 = Math.round(((totalRawScore - minRawScore) / span) * 120);

    $({ v: 0 }).animate({ v: score120 }, {
      duration: 1100,
      step: function (now) {
        $('#resultScoreNum').text(Math.floor(now));
      },
      complete: function () {
        $('#resultScoreNum').text(score120);
      }
    });

    var levelConfig = {
      balanced: {
        key: 'balanced',
        icon: '🟢',
        text: 'BALANCED',
        badgeClass: 'badge-balanced',
        desc: 'Kebiasaanmu relatif seimbang.'
      },
      reset: {
        key: 'reset',
        icon: '🟡',
        text: 'NEED A RESET',
        badgeClass: 'badge-reset',
        desc: 'Bukan berarti kamu tidak sehat. Tapi beberapa kebiasaanmu mulai perlu diperhatikan.'
      },
      move: {
        key: 'move',
        icon: '🟠',
        text: 'TIME TO MOVE',
        badgeClass: 'badge-move',
        desc: 'Beberapa pola hidup digitalmu sudah cukup dominan.'
      },
      break: {
        key: 'break',
        icon: '🔴',
        text: 'BREAK THE LOOP',
        badgeClass: 'badge-break',
        desc: 'Banyak kebiasaanmu saling berkaitan dan sudah waktunya melakukan perubahan.'
      }
    };

    var currentLevel;
    if (score120 <= 36) currentLevel = levelConfig.balanced;
    else if (score120 <= 66) currentLevel = levelConfig.reset;
    else if (score120 <= 94) currentLevel = levelConfig.move;
    else currentLevel = levelConfig.break;

    $('#resultStatusIcon').text(currentLevel.icon);
    $('#resultStatusText').text(currentLevel.text);
    $('#resultStatusDesc').text('“' + currentLevel.desc + '”');
    $('#resultStatusBadge').attr('class', 'result-status-badge ' + currentLevel.badgeClass);

    var $dimList = $('#dimensionList');
    $dimList.empty();

    var maxCatKey = 'tidur';
    var maxCatRatio = -1;

    Object.keys(catScores).forEach(function (key) {
      var c = catScores[key];
      var count = c.count || 1;
      var minScore = count * 1;
      var maxScore = count * 4;
      var denom = Math.max(1, maxScore - minScore);
      var ratio = c.count ? ((c.sum - minScore) / denom) : 0;
      var catPercent = Math.round(ratio * 100);

      if (c.count && ratio > maxCatRatio) {
        maxCatRatio = ratio;
        maxCatKey = key;
      }

      var dimItemHtml =
        '<div class="dimension-row">' +
          '<div class="dim-info-top">' +
            '<span class="dim-label">' + c.icon + ' ' + c.label + '</span>' +
            '<span class="dim-val">' + catPercent + '%</span>' +
          '</div>' +
          '<div class="dim-bar-track">' +
            '<div class="dim-bar-fill ' + (catPercent >= 70 ? 'bar-danger' : catPercent >= 40 ? 'bar-warning' : 'bar-safe') + '" style="width:0%;" data-target="' + catPercent + '"></div>' +
          '</div>' +
        '</div>';
      $dimList.append(dimItemHtml);
    });

    setTimeout(function () {
      $('.dim-bar-fill').each(function () {
        $(this).css('width', $(this).data('target') + '%');
      });
    }, 120);

    var focusData = {
      tidur: {
        title: 'POLA TIDUR',
        desc: 'Aktivitas digitalmu terlihat cukup sering menggeser waktu istirahat.'
      },
      digital: {
        title: 'SCREEN TIME',
        desc: 'Waktu di depan layar untuk hiburan sudah cukup tinggi dan mulai menggeser ritme harianmu.'
      },
      gerak: {
        title: 'LAMA DUDUK',
        desc: 'Kamu cenderung duduk atau rebahan terlalu lama tanpa jeda bergerak.'
      },
      makan: {
        title: 'POLA MAKAN',
        desc: 'Makanan cepat saji, minuman manis, atau makan sambil layar mulai jadi pola utama.'
      },
      wellbeing: {
        title: 'KONTROL DIRI',
        desc: 'Kebiasaan digital cenderung membuatmu kehilangan kendali waktu dan menunda hal penting.'
      }
    };

    var focusObj = focusData[maxCatKey] || focusData.tidur;
    $('#focusTitle').text(focusObj.title);
    $('#focusDesc').text(focusObj.desc);

    var recoMap = {
      morning_detox: { icon: '🌅', title: 'Beri jeda 15 menit saat bangun', desc: 'Hirup udara atau bergerak dulu sebelum menyentuh HP.' },
      stand_up_breaks: { icon: '🚶', title: 'Bangun dan bergerak secara berkala', desc: 'Berdiri atau jalan 2 menit di tengah sesi duduk lama.' },
      regular_movement: { icon: '🏃', title: 'Jadwalkan gerak ringan 15 menit', desc: 'Pilih aktivitas fisik sederhana beberapa kali seminggu.' },
      sleep_schedule: { icon: '⏰', title: 'Jaga jam tidur yang lebih stabil', desc: 'Usahakan tidur dan bangun di jam yang relatif konstan.' },
      night_screen_detox: { icon: '📵', title: 'Beri jeda dari layar sebelum tidur', desc: 'Jauhkan HP dari kasur agar otak lebih mudah rileks.' },
      healthy_snack: { icon: '🥗', title: 'Ganti junk food dengan camilan sederhana', desc: 'Sediakan buah atau kacang sebagai pilihan saat lapar.' },
      reduce_sweet_drinks: { icon: '🥤', title: 'Kurangi frekuensi minuman berpemanis', desc: 'Ganti soda, boba, atau kopi manis dengan air putih.' },
      mindful_eating: { icon: '🥣', title: 'Makan tanpa menatap layar', desc: 'Fokus pada makanannya agar porsi dan rasa lebih terasa.' },
      body_recovery: { icon: '👁️', title: 'Istirahatkan mata tiap 20 menit', desc: 'Tatap objek jauh selama 20 detik untuk meredakan kelelahan.' },
      app_timers: { icon: '📱', title: 'Pasang batas waktu aplikasi', desc: 'Gunakan timer agar scrolling tidak berjalan tanpa sadar.' },
      focus_priority: { icon: '🎯', title: 'Selesaikan 1 hal penting dulu', desc: 'Tentukan satu prioritas sebelum membuka hiburan di HP.' }
    };

    var selectedRecos = [];
    userAnswers.forEach(function (ans) {
      if (ans.recoKey && recoMap[ans.recoKey] && selectedRecos.length < 3) {
        var already = selectedRecos.some(function (r) { return r.title === recoMap[ans.recoKey].title; });
        if (!already) selectedRecos.push(recoMap[ans.recoKey]);
      }
    });

    var fallbackRecos = [
      recoMap.night_screen_detox,
      recoMap.stand_up_breaks,
      recoMap.reduce_sweet_drinks
    ];
    fallbackRecos.forEach(function (rec) {
      if (selectedRecos.length < 3 && !selectedRecos.some(function (r) { return r.title === rec.title; })) {
        selectedRecos.push(rec);
      }
    });

    var $actionGrid = $('#actionCardsGrid');
    $actionGrid.empty();
    selectedRecos.forEach(function (r, i) {
      $actionGrid.append(
        '<div class="action-card-item">' +
          '<div class="action-card-num">' + (i + 1) + '</div>' +
          '<div class="action-card-icon">' + r.icon + '</div>' +
          '<div class="action-card-body"><h5>' + r.title + '</h5><p>' + r.desc + '</p></div>' +
        '</div>'
      );
    });

    try {
      localStorage.setItem('rebahan_quiz_result', JSON.stringify({
        score: score120,
        level: currentLevel.text,
        levelKey: currentLevel.key,
        focusTitle: focusObj.title,
        focusDesc: focusObj.desc,
        recos: selectedRecos
      }));
    } catch (e) { }
  }

  $('#quizRestartBtn').on('click', function () {
    initQuiz();
  });

  initQuiz();

  (function showQuizRecoBanner() {
    var $banner = $('#quizRecoBanner');
    if (!$banner.length) return;
    try {
      var saved = JSON.parse(localStorage.getItem('rebahan_quiz_result'));
      if (!saved) return;
      $('#recoLevelText').text(saved.level || 'NEED A RESET');
      $('#recoScoreNum').text(saved.score != null ? saved.score : 0);
      $('#recoFocusTitle').text(saved.focusTitle || 'POLA TIDUR');
      $('#recoFocusDesc').text(saved.focusDesc || '');
      $banner.show();
    } catch (e) { }
  })();

  /* ---- Accordion ---- */
  $('.accordion-head').on('click', function () {
    var $item = $(this).closest('.accordion-item');
    var wasOpen = $item.hasClass('open');
    $item.toggleClass('open');
    $(this).find('.plus').text(wasOpen ? '+' : '−');
  });

  /* ---- Random fact button ---- */
  var facts = [
    "Rata-rata orang Indonesia menghabiskan lebih dari 7 jam per hari di depan layar — salah satu yang tertinggi di dunia.",
    "66,3% responden dalam studi RS Insan Permata (2025) memiliki gaya hidup sedentari.",
    "Cahaya biru dari layar HP bisa menunda produksi hormon melatonin, bikin lebih susah tidur nyenyak.",
    "45% remaja Indonesia pernah mengalami cyberbullying, menurut data UNICEF.",
    "Kombinasi kurang gerak dan junk food meningkatkan risiko diabetes tipe 2 sejak usia muda.",
    "Gerak ringan 5 menit tiap jam terbukti membantu mengurangi dampak buruk duduk terlalu lama."
  ];
  $('#factBtn').on('click', function () {
    var f = facts[Math.floor(Math.random() * facts.length)];
    $('#randomFact').text(f);
  });

  /* ---- Habit Tracker Harian with 10 PM Reset & Streak (Min 4) ---- */
  if (!$('#habitList').length) {
    return;
  }

  var DEFAULT_HABITS = [
    { id: 'def_1', title: 'Minum 2 liter air putih', category: 'Nutrisi', isDefault: true },
    { id: 'def_2', title: 'Gerak / jalan minimal 15 menit', category: 'Fisik', isDefault: true },
    { id: 'def_3', title: 'Makan makanan sehat (bebas junk food)', category: 'Nutrisi', isDefault: true },
    { id: 'def_4', title: 'Screen time non-tugas di bawah target', category: 'Mental', isDefault: true },
    { id: 'def_5', title: 'Digital detox 1 jam sebelum tidur', category: 'Tidur', isDefault: true },
    { id: 'def_6', title: 'Stretching & perbaiki postur tubuh', category: 'Fisik', isDefault: true }
  ];

  var customHabits = [];
  try {
    customHabits = JSON.parse(localStorage.getItem('rebahan_custom_habits')) || [];
  } catch (e) { customHabits = []; }

  var trackerState = {
    lastResetPeriod: '',
    checkedMap: {},
    streak: 0
  };
  try {
    var loadedState = JSON.parse(localStorage.getItem('rebahan_tracker_state'));
    if (loadedState && typeof loadedState === 'object') {
      trackerState = Object.assign(trackerState, loadedState);
    }
  } catch (e) { }

  function getTargetResetDate(now) {
    var target = new Date(now);
    target.setHours(22, 0, 0, 0);
    if (now.getTime() >= target.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    return target;
  }

  function getPeriodKey(targetResetDate) {
    var y = targetResetDate.getFullYear();
    var m = String(targetResetDate.getMonth() + 1).padStart(2, '0');
    var d = String(targetResetDate.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d + '_22:00';
  }

  function checkAndApplyReset() {
    var now = new Date();
    var targetReset = getTargetResetDate(now);
    var currentPeriod = getPeriodKey(targetReset);

    if (trackerState.lastResetPeriod !== currentPeriod) {
      if (trackerState.lastResetPeriod) {
        var prevCheckedCount = Object.keys(trackerState.checkedMap || {}).filter(function (k) {
          return trackerState.checkedMap[k] === true;
        }).length;

        if (prevCheckedCount >= 4) {
          trackerState.streak = (trackerState.streak || 0) + 1;
        } else {
          trackerState.streak = 0;
        }
      }
      trackerState.checkedMap = {};
      trackerState.lastResetPeriod = currentPeriod;
      saveTrackerState();
    }
  }

  function saveTrackerState() {
    try {
      localStorage.setItem('rebahan_tracker_state', JSON.stringify(trackerState));
    } catch (e) { }
  }

  function saveCustomHabits() {
    try {
      localStorage.setItem('rebahan_custom_habits', JSON.stringify(customHabits));
    } catch (e) { }
  }

  function updateCountdownTimer() {
    var now = new Date();
    var targetReset = getTargetResetDate(now);
    var diffMs = targetReset.getTime() - now.getTime();

    if (diffMs <= 0) {
      checkAndApplyReset();
      renderAll();
      return;
    }

    var totalSeconds = Math.floor(diffMs / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    var hh = String(hours).padStart(2, '0');
    var mm = String(minutes).padStart(2, '0');
    var ss = String(seconds).padStart(2, '0');

    $('#resetCountdown').text(hh + ':' + mm + ':' + ss);
  }

  setInterval(updateCountdownTimer, 1000);
  updateCountdownTimer();

  function getAllHabits() {
    return DEFAULT_HABITS.concat(customHabits);
  }

  var currentCategory = 'Semua';

  $('#categoryTabs').on('click', '.filter-tab', function () {
    $('.filter-tab').removeClass('active');
    $(this).addClass('active');
    currentCategory = $(this).data('cat');
    renderHabitList();
    updateHabitUI();
  });

  function addHabit() {
    var title = $('#newHabitInput').val().trim();
    var category = $('#newHabitCategory').val() || 'Custom';
    if (!title) return;

    var newHabit = {
      id: 'cust_' + Date.now(),
      title: title,
      category: category,
      isDefault: false
    };

    customHabits.push(newHabit);
    saveCustomHabits();
    $('#newHabitInput').val('');
    renderAll();
  }

  $('#addHabitBtn').on('click', addHabit);
  $('#newHabitInput').on('keypress', function (e) {
    if (e.which === 13) {
      addHabit();
    }
  });

  /* ---- Confirmation Modal & Lock Checked Habit Logic ---- */
  var pendingHabitId = null;

  function openConfirmModal(habitId, habitTitle) {
    pendingHabitId = habitId;
    $('#confirmModalText').text('Apakah benar Anda sudah melakukan kebiasaan "' + habitTitle + '"?');
    $('#confirmModalOverlay').addClass('show');
  }

  function closeConfirmModal() {
    pendingHabitId = null;
    $('#confirmModalOverlay').removeClass('show');
  }

  $('#confirmCancelBtn').on('click', closeConfirmModal);

  $('#confirmOkBtn').on('click', function () {
    if (pendingHabitId) {
      trackerState.checkedMap[pendingHabitId] = true;
      saveTrackerState();
      renderAll();
    }
    closeConfirmModal();
  });

  $('#confirmModalOverlay').on('click', function (e) {
    if ($(e.target).hasClass('confirm-modal-overlay')) {
      closeConfirmModal();
    }
  });

  $('#habitList').on('click', '.btn-delete-habit', function (e) {
    e.stopPropagation();
    var habitId = $(this).data('id');
    customHabits = customHabits.filter(function (h) { return h.id !== habitId; });
    delete trackerState.checkedMap[habitId];
    saveCustomHabits();
    saveTrackerState();
    renderAll();
  });

  // Checkbox click handler with confirmation and locking
  $('#habitList').on('click', '.habit-checkbox', function (e) {
    var habitId = $(this).data('id');
    var isAlreadyChecked = !!trackerState.checkedMap[habitId];

    if (isAlreadyChecked) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    var all = getAllHabits();
    var habit = all.find(function (h) { return h.id === habitId; });
    var title = habit ? habit.title : 'kebiasaan ini';

    openConfirmModal(habitId, title);
  });

  function escapeHtml(str) {
    return $('<div>').text(str).html();
  }

  function renderHabitList() {
    var all = getAllHabits();
    var filtered = all.filter(function (h) {
      if (currentCategory === 'Semua') return true;
      return h.category === currentCategory;
    });

    var $list = $('#habitList');
    $list.empty();

    if (filtered.length === 0) {
      $list.append('<div class="empty-habit-msg">Tidak ada kebiasaan untuk kategori "' + escapeHtml(currentCategory) + '".</div>');
      return;
    }

    filtered.forEach(function (h) {
      var isDone = !!trackerState.checkedMap[h.id];
      var catLabel = h.category;
      var deleteBtnHtml = (!h.isDefault && !isDone) ? '<button class="btn-delete-habit" data-id="' + h.id + '" title="Hapus kebiasaan">🗑️</button>' : '';
      var lockTagHtml = isDone ? '<span class="locked-tag">🔒 Terkunci</span>' : '';

      var itemHtml = `
        <div class="habit-item ${isDone ? 'done' : ''}" data-id="${h.id}">
          <div class="habit-left">
            <input type="checkbox" class="habit-checkbox" data-id="${h.id}" ${isDone ? 'checked disabled' : ''}>
            <span class="habit-text">${escapeHtml(h.title)}</span>
          </div>
          <div class="habit-right">
            <span class="category-tag">${escapeHtml(catLabel)}</span>
            ${lockTagHtml}
            ${deleteBtnHtml}
          </div>
        </div>
      `;
      $list.append(itemHtml);
    });
  }

  function updateHabitUI() {
    var all = getAllHabits();
    var totalCount = all.length;
    var doneCount = 0;

    all.forEach(function (h) {
      if (trackerState.checkedMap[h.id]) {
        doneCount++;
      }
    });

    $('#habitList .habit-item').each(function () {
      var id = $(this).data('id');
      var isChecked = !!trackerState.checkedMap[id];
      $(this).toggleClass('done', isChecked);
      var $cb = $(this).find('.habit-checkbox');
      $cb.prop('checked', isChecked);
      if (isChecked) {
        $cb.prop('disabled', true);
      }
    });

    $('#completedSummary').text(doneCount + ' dari ' + totalCount);

    var isMin4Reached = doneCount >= 4;

    if (isMin4Reached) {
      $('#targetStatusBadge').text('✅ Target Min. 4 Reached!').addClass('active-streak');
      $('#streakBadge').text('🔥 Active Hari Ini').addClass('active-streak');
      $('#streakCard').addClass('active-streak-card');

      var activeStreak = (trackerState.streak || 0) + 1;
      $('#streakCount').text(activeStreak);
    } else {
      $('#targetStatusBadge').text('Minimal 4 untuk Streak (' + doneCount + '/4)').removeClass('active-streak');
      $('#streakBadge').text('Min. 4 Centang').removeClass('active-streak');
      $('#streakCard').removeClass('active-streak-card');

      var baseStreak = trackerState.streak || 0;
      $('#streakCount').text(baseStreak);
    }

    var percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    $('#habitProgressText').text(doneCount + ' dari ' + totalCount + ' selesai hari ini');
    $('#habitPercentText').text(percent + '%');
    $('#habitProgressFill').css('width', percent + '%');
  }

  function renderAll() {
    checkAndApplyReset();
    renderHabitList();
    updateHabitUI();
  }

  renderAll();

});
