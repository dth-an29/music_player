const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER'

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Money',
            singer: 'LISA',
            path: './assets/music/Money-LISA.mp3',
            image: './assets/img/Money.jpeg'
        },
        {
            name: 'Vì Một Câu Nói',
            singer: 'Hoàng Dũng',
            path: './assets/music/ViMotCauNoi-HoangDung.mp3',
            image: './assets/img/ViMotCauNoi.jpg'
        },
        {
            name: 'Thói quen',
            singer: 'Hoàng Dũng - GDucky',
            path: './assets/music/ThoiQuen-HoangDung-GDucky.mp3',
            image: './assets/img/ThoiQuen.jpg'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'EmceeL - DaLAB',
            path: './assets/music/ChuyenDoiTa-EmceeL-DaLAB.mp3',
            image: './assets/img/ChuyenDoiTa.jpg'
        },
        {
            name: 'Bởi vì yêu',
            singer: 'Juky San',
            path: './assets/music/BoiViYeu-JukySan.mp3',
            image: './assets/img/BoiViYeu.jfif'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <img src="${song.image}" alt="" class="thumb">
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay/dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to/thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.height = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
            $('.cd-thumb').style.borderWidth = newCdWidth > 0 ? 4 + 'px' : 0
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            _this.activeSong()
        }

        // Khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.activeSong()
            _this.scrollToActiveSong()
        }

         // Khi prev song
         prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.activeSong()
            _this.scrollToActiveSong()
        }

        // Khi random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active')
        }

        // Khi repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active')
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe sự kiện click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')
            ) {
                // Khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                }

                // Khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.src = this.currentSong.image
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            const blockView = this.currentIndex <= 3 ? 'end' : 'nearest'
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: blockView,
            })
        }, 300)
    },
    activeSong: function () {
        var loopSongs = $$('.song')
        for (song of loopSongs) {
            song.classList.remove('active')
        }
        const activeSong = loopSongs[this.currentIndex]
        activeSong.classList.add('active')
    },
    nextSong: function () {
        this.currentIndex++ 
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // Gán cấu hình từ config
        this.loadConfig()
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // DOM events
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()