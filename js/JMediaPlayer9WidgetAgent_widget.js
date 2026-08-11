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
    }
]

class JMediaPlayer9WidgetAgent {
    constructor(id) {
        this.playlist=music_list;
        this.player_id = id;
        this.audio_elem=document.querySelector(`#${this.player_id}_controller`);
        this.selected_index=null;
        this.progress_controller=null;
        document.querySelector(`#${this.player_id} .seekbar-mid`).addEventListener('click', (event) => {
            var bbl = document.querySelector(`#${this.player_id} .seekbar-mid`).getBoundingClientRect().left;
            var lth = document.querySelector(`#${this.player_id} .seekbar-mid`).getBoundingClientRect().width;
            var prc = Math.round(((event.x - bbl)/lth)*10000)/100;
            this.setseekbaratperc(prc);

            this.audio_elem.currentTime=this.audio_elem.duration * (prc/100);
        })

        document.querySelector(`#${this.player_id} .seekbar-mid`).addEventListener('touchstart', (event) => {
            var bbl = document.querySelector(`#${this.player_id} .seekbar-mid`).getBoundingClientRect().left;
            var lth = document.querySelector(`#${this.player_id} .seekbar-mid`).getBoundingClientRect().width;
            var prc = Math.round(((event.touches[0].clientX - bbl)/lth)*10000)/100;
            this.setseekbaratperc(prc);

            this.audio_elem.currentTime=this.audio_elem.duration * (prc/100);
        })

        document.querySelector(`#${this.player_id} .button-play`).addEventListener('click', () => {
            this.playpause();
        })

        document.querySelector(`#${this.player_id} .button-prev`).addEventListener('click', () => {
            this.prev();
        })

        document.querySelector(`#${this.player_id} .button-next`).addEventListener('click', () => {
            this.next();
        })

        document.querySelector(`#${this.player_id} .button-stop`).addEventListener('click', () => {
            this.stop();
        })

        this.audio_elem.addEventListener('ended', () => {
            this.resetseekbar();
            document.querySelector(`#${this.player_id}`).dataset.playstate="paused";
            if(this.selected_index<this.playlist.length-1) {
                this.playatindex(parseInt(this.selected_index)+1);
            } else {
                this.stop();
                console.log("stop")
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
    }

    set_progresscontroller = () => {
        if(this.progress_controller==null)
        this.progress_controller = setInterval(() => {
            console.log("control")
            var percentage=Math.round((jmp9a.audio_elem.currentTime/jmp9a.audio_elem.duration)*10000)/100;
            this.setseekbaratperc(percentage);
        },350);
    }

    resetseekbar = () => {
        document.querySelector(`#${this.player_id} .progress`).style.width=`0%`;
        document.querySelector(`#${this.player_id} .button-trackslider`).style.left=`0%`;
    }

    setseekbaratperc = (perc) => {
        document.querySelector(`#${this.player_id} .progress`).style.width=`${perc}%`;
        document.querySelector(`#${this.player_id} .button-trackslider`).style.left=`${perc}%`;
    }

    pause_progresscontroller = () => {
        clearInterval(this.progress_controller);
        this.progress_controller=null;
    }

    playpause = () => {
        if(document.querySelector(`#${this.player_id}`).dataset.playstate=="paused") this.play();
        else if(document.querySelector(`#${this.player_id}`).dataset.playstate=="playing") this.pause();
    }

    play = () => {
        if(this.selected_index==null) {this.playatindex(0); return;}
        this.audio_elem.play();
        document.querySelector(`#${this.player_id} .button-stop`).disabled=false;
        document.querySelector(`#${this.player_id}`).dataset.playstate="playing";
        this.set_progresscontroller();

        document.querySelector(`#${this.player_id} .text span.title`).innerHTML=this.playlist[this.selected_index].title;
        document.querySelector(`#${this.player_id} .text span.album`).innerHTML=this.playlist[this.selected_index].album;
        document.querySelector(`#${this.player_id} .text span.artist`).innerHTML=this.playlist[this.selected_index].artist;
        document.querySelector(`#${this.player_id} .text span.date`).innerHTML=this.playlist[this.selected_index].date;

        document.querySelector(`#${this.player_id}`).dataset.title=this.playlist[this.selected_index].title;
        document.querySelector(`#${this.player_id}`).dataset.album=this.playlist[this.selected_index].album;
        document.querySelector(`#${this.player_id}`).dataset.artist=this.playlist[this.selected_index].artist;

        document.querySelector(`#${this.player_id} .song-info img.cover`).src=this.playlist[this.selected_index].src.slice(0,-4)+"_cover.jpg";
        document.querySelector(`#${this.player_id} .song-info img.disc`).src=this.playlist[this.selected_index].src.slice(0,-4)+"_disc.png";
        document.querySelector(':root').style.setProperty('--music-player-bk', "url(\""+this.playlist[this.selected_index].src.slice(0,-4)+"_background.webp\")");
    }

    playatindex = (index) => {
        this.selected_index=parseInt(index);
        this.audio_elem.src=this.playlist[this.selected_index].src;
        this.play();
        document.querySelectorAll(`#${this.player_id} .playlist-list .list-item`).forEach(item => item.classList.remove("selected"));
        document.querySelectorAll(`#${this.player_id} .playlist-list .list-item:not(.template)`)[this.selected_index].classList.add("selected");

        if(parseInt(this.selected_index)==this.playlist.length-1) {
            document.querySelector(`#${this.player_id} .button-next`).disabled=true;
        }
        else {
            document.querySelector(`#${this.player_id} .button-next`).disabled=false;
        }

        if(parseInt(this.selected_index)==0) {
            document.querySelector(`#${this.player_id} .button-prev`).disabled=true;
        } 
        else {
            document.querySelector(`#${this.player_id} .button-prev`).disabled=false;
        }
    }

    pause = () => {
        this.audio_elem.pause();
        document.querySelector(`#${this.player_id}`).dataset.playstate="paused"
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
        document.querySelector(`#${this.player_id}`).dataset.playstate="paused";
        document.querySelector(`#${this.player_id} .button-stop`).disabled=true;
        document.querySelector(`#${this.player_id} .song-info img.cover`).src="./img/widgets/mediaplayer/genericcover.jpg";
        document.querySelector(`#${this.player_id} .song-info img.disc`).src="./img/widgets/mediaplayer/genericdisc.png"
        document.querySelector(':root').style.setProperty('--music-player-bk', "url(\"./img/widgets/mediaplayer/backgrounddefault.jpg\")");

        document.querySelector(`#${this.player_id} .text span.title`).innerHTML="Title";
        document.querySelector(`#${this.player_id} .text span.album`).innerHTML="Album";
        document.querySelector(`#${this.player_id} .text span.artist`).innerHTML="Artist";
        document.querySelector(`#${this.player_id} .text span.date`).innerHTML="Date";

        document.querySelector(`#${this.player_id}`).dataset.title="";
        document.querySelector(`#${this.player_id}`).dataset.album="";
        document.querySelector(`#${this.player_id}`).dataset.artist="";
    }
}
