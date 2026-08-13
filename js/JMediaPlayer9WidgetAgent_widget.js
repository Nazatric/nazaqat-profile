var music_list=[
    {
        src: "./media/music/Bohemian Rhapsody.mp3",
        synced_lyrics:"",
        title: "Bohemian Rhapsody",
        album: "A Night at the Opera",
        artist: "Queen",
        date: "1975"
    },
    {
        src: "./media/music/Teenage Dirtbag.mp3",
        synced_lyrics:"",
        title: "Teenage Dirtbag",
        album: "Wheatus",
        artist: "Wheatus",
        date: "2000"
    },
    {
        src: "./media/music/What I've Done.mp3",
        synced_lyrics:"",
        title: "What I've Done",
        album: "Minutes to Midnight",
        artist: "Linkin Park",
        date: "2007"
    },
    {
        src: "./media/music/Join Me (Razorblade Mix).mp3",
        synced_lyrics:"",
        title: "Join Me (Razorblade Mix)",
        album: "Razorblade Romance",
        artist: "HIM",
        date: "2000"
    },
    {
        src: "./media/music/Pet.opus",
        synced_lyrics:"",
        title: "Pet",
        album: "Thirteenth Step",
        artist: "A Perfect Circle",
        date: "2003"
    }
]

class JMediaPlayer9WidgetAgent {
    constructor(id) {
        this.playlist=music_list;
        this.player_id = id;
        this.audio_elem=document.querySelector(`#${this.player_id}_controller`);
        this.selected_index=null;
        this.progress_controller=null;

        // cache frequently used elements once instead of re-querying on every call
        this.el_root=document.querySelector(`#${this.player_id}`);
        this.el_seekbar=document.querySelector(`#${this.player_id} .seekbar-mid`);
        this.el_progress=document.querySelector(`#${this.player_id} .progress`);
        this.el_slider=document.querySelector(`#${this.player_id} .button-trackslider`);
        this.el_stop=document.querySelector(`#${this.player_id} .button-stop`);
        this.el_prev=document.querySelector(`#${this.player_id} .button-prev`);
        this.el_next=document.querySelector(`#${this.player_id} .button-next`);
        this.el_volume=document.querySelector(`#${this.player_id} .button-volume`);
        this.el_volume_img=this.el_volume.querySelector('img');
        this.el_cover=document.querySelector(`#${this.player_id} .song-info img.cover`);
        this.el_disc=document.querySelector(`#${this.player_id} .song-info img.disc`);
        this.el_title=document.querySelector(`#${this.player_id} .text span.title`);
        this.el_album=document.querySelector(`#${this.player_id} .text span.album`);
        this.el_artist=document.querySelector(`#${this.player_id} .text span.artist`);
        this.el_date=document.querySelector(`#${this.player_id} .text span.date`);

        this.el_seekbar.addEventListener('click', (event) => {
            var bbl = this.el_seekbar.getBoundingClientRect().left;
            var lth = this.el_seekbar.getBoundingClientRect().width;
            var prc = Math.round(((event.x - bbl)/lth)*10000)/100;
            this.setseekbaratperc(prc);

            this.audio_elem.currentTime=this.audio_elem.duration * (prc/100);
        })

        this.el_seekbar.addEventListener('touchstart', (event) => {
            var bbl = this.el_seekbar.getBoundingClientRect().left;
            var lth = this.el_seekbar.getBoundingClientRect().width;
            var prc = Math.round(((event.touches[0].clientX - bbl)/lth)*10000)/100;
            this.setseekbaratperc(prc);

            this.audio_elem.currentTime=this.audio_elem.duration * (prc/100);
        })

        document.querySelector(`#${this.player_id} .button-play`).addEventListener('click', () => {
            this.playpause();
        })

        this.el_prev.addEventListener('click', () => {
            this.prev();
        })

        this.el_next.addEventListener('click', () => {
            this.next();
        })

        this.el_stop.addEventListener('click', () => {
            this.stop();
        })

        this.el_volume.addEventListener('click', () => {
            this.togglemute();
        })

        this.audio_elem.addEventListener('ended', () => {
            this.resetseekbar();
            this.el_root.dataset.playstate="paused";
            if(this.selected_index<this.playlist.length-1) {
                this.playatindex(parseInt(this.selected_index)+1);
            } else {
                this.stop();
            }
        })

        
        var cnt=0;
        this.playlist.forEach(song => {
            var new_node=document.querySelector(`#${this.player_id} .playlist-list .list-item`).cloneNode(true);
            new_node.classList.remove("template");
            new_node.querySelector(`span`).innerHTML=`${song.title} - ${song.artist}`;
            new_node.dataset.index=cnt;
            cnt++;
            new_node.addEventListener('click', () => {
                this.playatindex(new_node.dataset.index)
            })
            document.querySelector(`#${this.player_id} .playlist-list`).appendChild(new_node);
        })
        this.playlist_items=document.querySelectorAll(`#${this.player_id} .playlist-list .list-item:not(.template)`);

        // show a random track's info up front so there's something to resume/play immediately
        this.showatindex(Math.floor(Math.random()*this.playlist.length));
    }

    set_progresscontroller = () => {
        if(this.progress_controller==null)
        this.progress_controller = setInterval(() => {
            var percentage=Math.round((this.audio_elem.currentTime/this.audio_elem.duration)*10000)/100;
            this.setseekbaratperc(percentage);
        },350);
    }

    resetseekbar = () => {
        this.el_progress.style.width=`0%`;
        this.el_slider.style.left=`0%`;
    }

    setseekbaratperc = (perc) => {
        this.el_progress.style.width=`${perc}%`;
        this.el_slider.style.left=`${perc}%`;
    }

    pause_progresscontroller = () => {
        clearInterval(this.progress_controller);
        this.progress_controller=null;
    }

    playpause = () => {
        if(this.el_root.dataset.playstate=="paused") this.play();
        else if(this.el_root.dataset.playstate=="playing") this.pause();
    }

    togglemute = () => {
        this.audio_elem.muted=!this.audio_elem.muted;
        this.el_volume_img.src=this.audio_elem.muted ? "./img/widgets/mediaplayer/button_volume_disabled.png" : "./img/widgets/mediaplayer/button_volume.png";
    }

    play = () => {
        if(this.selected_index==null) {this.playatindex(Math.floor(Math.random()*this.playlist.length)); return;}
        this.audio_elem.play();
        this.el_stop.disabled=false;
        this.el_root.dataset.playstate="playing";
        this.set_progresscontroller();
    }

    updatedisplay = () => {
        this.el_title.innerHTML=this.playlist[this.selected_index].title;
        this.el_album.innerHTML=this.playlist[this.selected_index].album;
        this.el_artist.innerHTML=this.playlist[this.selected_index].artist;
        this.el_date.innerHTML=this.playlist[this.selected_index].date;

        this.el_root.dataset.title=this.playlist[this.selected_index].title;
        this.el_root.dataset.album=this.playlist[this.selected_index].album;
        this.el_root.dataset.artist=this.playlist[this.selected_index].artist;

        this.el_cover.src=this.playlist[this.selected_index].src.slice(0,-4)+"_cover.jpg";
        this.el_disc.src=this.playlist[this.selected_index].src.slice(0,-4)+"_disc.png";
        document.querySelector(':root').style.setProperty('--music-player-bk', "url(\""+this.playlist[this.selected_index].src.slice(0,-4)+"_background.webp\")");
    }

    showatindex = (index) => {
        this.selected_index=parseInt(index);
        this.audio_elem.src=this.playlist[this.selected_index].src;
        this.updatedisplay();
        this.playlist_items.forEach(item => item.classList.remove("selected"));
        this.playlist_items[this.selected_index].classList.add("selected");

        this.el_next.disabled = (parseInt(this.selected_index)==this.playlist.length-1);
        this.el_prev.disabled = (parseInt(this.selected_index)==0);
    }

    playatindex = (index) => {
        this.showatindex(index);
        this.play();
    }

    pause = () => {
        this.audio_elem.pause();
        this.el_root.dataset.playstate="paused"
        this.pause_progresscontroller();
    }

    next = () => {
        if(this.selected_index<this.playlist.length-1) {
            this.playatindex(parseInt(this.selected_index)+1);
        }
    }

    prev = () => {
        if(this.selected_index>0) {
            this.playatindex(parseInt(this.selected_index)-1);
        }
    }

    stop = () => {
        this.pause_progresscontroller();
        this.resetseekbar();
        this.audio_elem.pause();
        this.audio_elem.currentTime=0;
        this.el_root.dataset.playstate="paused";
        this.el_stop.disabled=true;
        this.el_cover.src="./img/widgets/mediaplayer/genericcover.jpg";
        this.el_disc.src="./img/widgets/mediaplayer/genericdisc.png"
        document.querySelector(':root').style.setProperty('--music-player-bk', "url(\"./img/widgets/mediaplayer/backgrounddefault.jpg\")");

        this.el_title.innerHTML="Title";
        this.el_album.innerHTML="Album";
        this.el_artist.innerHTML="Artist";
        this.el_date.innerHTML="Date";

        this.el_root.dataset.title="";
        this.el_root.dataset.album="";
        this.el_root.dataset.artist="";
    }
}
