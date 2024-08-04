const musicContainer = document.getElementById("music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");
const dropBtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

const allSongs = {
  hafs: [
    "علي جابر- حفص عن عاصم",
    "محمود خليل الحصري- حفص عن عاصم",
    "محمود علي البنا- حفص عن عاصم",
    "عبدالباسط عبدالصمد- حفص عن عاصم",
    "محمد صديق المنشاوي- حفص عن عاصم",
    "ناصر القطامي- حفص عن عاصم",
    "ماهر المعيقلي- حفص عن عاصم",
    "محمد اللحيدان- حفص عن عاصم",
    "محمد أيوب- حفص عن عاصم",
    "فارس عباد- حفص عن عاصم",
    "ياسر الدوسري- حفص عن عاصم",
    "سعد الغامدي- حفص عن عاصم",
    "عبدالرحمن السديس- حفص عن عاصم",
    "مشاري العفاسي- حفص عن عاصم",
    "خالد القحطاني- حفص عن عاصم",
],
warsh: [
    "عبدالعزيز سحيم- ورش عن نافع",
    "القارئ ياسين- ورش عن نافع",
    "ابراهيم الدوسري- ورش عن نافع",
    "محمود خليل الحصري- ورش عن نافع",
    "عبدالباسط عبدالصمد- ورش عن نافع",
    "عمر القزابري- ورش عن نافع",
],
mjwad:[
    "محمد صديق المنشاوي- المصحف المجود",
    "محمود خليل الحصري- المصحف المجود",
    "عبدالباسط عبدالصمد- المصحف المجود",
    "محمود علي البنا- المصحف المجود",
],
misc: [
    "آيات السكينة- حفص عن عاصم",
    "---تراتيل قصيرة متميزة---",
    "-اذاعة متنوعة لمختلف القراء-",
    "---سورة البقرة - لعدد من القراء---",
    "-تلاوات خاشعة-",
    "سورة الملك",
    "أذكار الصباح",
    "أذكار المساء",
],
};

let currentType = 'hafs';
let songs = allSongs[currentType];
let songIndex = 0;
let isLoading = false;

// تحديث دالة loadSong
function loadSong(song) {
  if (isLoading) return;
  isLoading = true;
  title.innerText = song;
  const source = getRadioSource(song);
  if (source) {
    audio.src = source;
    audio.load();
    
    // تحديث معلومات الوسائط
    updateMediaSession(song);
  } else {
    console.error(`لم يتم العثور على مصدر للإذاعة: ${song}`);
    isLoading = false;
    nextSong();
  }
}

// إضافة دالة جديدة لتحديث معلومات الوسائط
function updateMediaSession(song) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song,
      artist: 'إذاعة القرآن الكريم',
      album: 'القراءات القرآنية',
      artwork: [
        { src: 'koran (1).png', sizes: '512x512', type: 'image/png' }
      ]
    });

    // تعيين معالجات الأحداث
    ['play', 'pause', 'previoustrack', 'nexttrack'].forEach(action => {
      navigator.mediaSession.setActionHandler(action, () => {
        switch(action) {
          case 'play':
            playSong();
            break;
          case 'pause':
            pauseSong();
            break;
          case 'previoustrack':
            prevSong();
            break;
          case 'nexttrack':
            nextSong();
            break;
        }
      });
    });
  }
}

// تحديث دالة playSong
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");
  audio.play().then(() => {
    // تحديث حالة التشغيل بعد بدء التشغيل بنجاح
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
    }
  }).catch(error => {
    console.error("خطأ في تشغيل الإذاعة:", error);
    isLoading = false;
    nextSong();
  });
}

// تحديث دالة pauseSong
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");
  audio.pause();
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused';
  }
}

// إضافة مستمع حدث للتحميل
audio.addEventListener('loadedmetadata', () => {
  updateMediaSession(songs[songIndex]);
});

// إضافة مستمع حدث لتحديث الحالة
audio.addEventListener('play', () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'playing';
  }
});

audio.addEventListener('pause', () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'paused';
  }
});

function prevSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function filterRadios(type) {
    if (isLoading) return;
    currentType = type;
    songs = allSongs[type];
    songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
    
    dropBtn.textContent = 
        type === 'hafs' ? 'حفص عن عاصم' :
        type === 'warsh' ? 'ورش عن نافع' :
        type === 'mjwad' ? 'المصحف المجود' :
        'متنوع';
    
    // Hide dropdown after selection
    dropdownContent.style.display = 'none';
}

function getRadioSource(radio) {
    const radioSources = {
      "علي جابر- حفص عن عاصم": "https://backup.qurango.net/radio/ali_jaber",
      "عبدالعزيز سحيم- ورش عن نافع": "https://backup.qurango.net/radio/a_sheim",
      "القارئ ياسين- ورش عن نافع": "https://backup.qurango.net/radio/alqaria_yassen",
      "ابراهيم الدوسري- ورش عن نافع": "https://backup.qurango.net/radio/ibrahim_aldosari",
      "محمد صديق المنشاوي- المصحف المجود": "https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad",
      "محمود خليل الحصري- المصحف المجود": "https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad",
      "عبدالباسط عبدالصمد- المصحف المجود": "https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad",
      "ناصر القطامي- حفص عن عاصم": "https://backup.qurango.net/radio/nasser_alqatami",
      "ماهر المعيقلي- حفص عن عاصم": "https://backup.qurango.net/radio/maher",
      "محمد اللحيدان- حفص عن عاصم": "https://backup.qurango.net/radio/mohammed_allohaidan",
      "محمد أيوب- حفص عن عاصم": "https://backup.qurango.net/radio/mohammed_ayyub",
      "فارس عباد- حفص عن عاصم": "https://backup.qurango.net/radio/fares_abbad",
      "ياسر الدوسري- حفص عن عاصم": "https://backup.qurango.net/radio/yasser_aldosari",
      "سعد الغامدي- حفص عن عاصم": "https://backup.qurango.net/radio/saad_alghamdi",
      "عبدالرحمن السديس- حفص عن عاصم": "https://backup.qurango.net/radio/abdulrahman_alsudaes",
      "مشاري العفاسي- حفص عن عاصم": "https://backup.qurango.net/radio/mishary_alafasi",
      "خالد القحطاني- حفص عن عاصم": "https://backup.qurango.net/radio/khaled_alqahtani",
      "آيات السكينة- حفص عن عاصم": "https://backup.qurango.net/radio/sakeenah",
      "---تراتيل قصيرة متميزة---": "https://backup.qurango.net/radio/tarateel",
      "-اذاعة متنوعة لمختلف القراء-": "https://backup.qurango.net/radio/mix",
      "---سورة البقرة - لعدد من القراء---": "https://backup.qurango.net/radio/albaqarah",
      "محمود خليل الحصري- حفص عن عاصم": "https://backup.qurango.net/radio/mahmoud_khalil_alhussary",    
      "محمود علي البنا- حفص عن عاصم": "https://backup.qurango.net/radio/mahmoud_ali__albanna",    
      "محمد صديق المنشاوي- حفص عن عاصم": "https://backup.qurango.net/radio/mohammed_siddiq_alminshawi",    
      "عبدالباسط عبدالصمد- حفص عن عاصم": "https://backup.qurango.net/radio/abdulbasit_abdulsamad",    
      "محمود خليل الحصري- ورش عن نافع": "https://backup.qurango.net/radio/mahmoud_khalil_alhussary_warsh",    
      "عبدالباسط عبدالصمد- ورش عن نافع": "https://backup.qurango.net/radio/abdulbasit_abdulsamad_warsh",    
      "عمر القزابري- ورش عن نافع": "https://backup.qurango.net/radio/omar_alqazabri",
      "محمود علي البنا- المصحف المجود": "https://backup.qurango.net/radio/mahmoud_ali__albanna_mojawwad",       
      "سورة الملك": "https://backup.qurango.net/radio/Surah_Al-Mulk",    
      "أذكار الصباح": "https://backup.qurango.net/radio/athkar_sabah",    
      "أذكار المساء": "https://backup.qurango.net/radio/athkar_masa",   
      "-تلاوات خاشعة-": "https://backup.qurango.net/radio/salma",     
    };
    return radioSources[radio];
}

// Event listeners
playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains("play");
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener("click", prevSong);  // Swapped with nextSong
nextBtn.addEventListener("click", nextSong);  // Swapped with prevSong

audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextSong);

audio.addEventListener('error', (e) => {
    console.error("خطأ في تحميل الإذاعة:", e);
    isLoading = false;
    nextSong();
});

audio.addEventListener('canplay', () => {
    isLoading = false;
});

// Load the first radio station when starting
loadSong(songs[songIndex]);

function toggleInfoBox() {
    var infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'block';
    setTimeout(function() {
        infoBox.style.display = 'none';
    }, 3000);
}

// Close dropdown when clicking outside
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn')) {
        dropdownContent.style.display = 'none';
    }
});

// Toggle dropdown visibility when clicking the button
dropBtn.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// في ملف JavaScript الرئيسي
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}