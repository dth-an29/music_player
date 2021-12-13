const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-play')
const progress = $('#progress')

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: 'Bởi vì yêu',
            singer: 'Juky San',
            path: './assets/music/BoiViYeu-JukySan.mp3',
            image: './assets/img/BoiViYeu.jfif'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'EmceeL - DaLAB',
            path: './assets/music/ChuyenDoiTa-EmceeL-DaLAB.mp3',
            image: './assets/img/ChuyenDoiTa.jpg'
        },
        {
            name: 'Money',
            singer: 'LISA',
            path: './assets/music/Money-LISA.mp3',
            image: './assets/img/Money.jpeg'
        },
        {
            name: 'Thói quen',
            singer: 'Hoàng Dũng - GDucky',
            path: './assets/music/ThoiQuen-HoangDung-GDucky.mp3',
            image: './assets/img/ThoiQuen.jpg'
        },
        {
            name: 'Vì Một Câu Nói',
            singer: 'Hoàng Dũng',
            path: './assets/music/ViMotCauNoi-HoangDung.mp3',
            image: './assets/img/ViMotCauNoi.jpg'
        },
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
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
        $('.playlist').innerHTML = htmls.join('')
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

        // Xử lý phóng to/thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
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
        }

        // Khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
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
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.src = this.currentSong.image
        audio.src = this.currentSong.path

    },
    start: function () {
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