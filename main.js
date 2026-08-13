var jmp9a;

var config={
    name: "Nazaqat",
    status: "Lets work bruh"
}

var photo_albums=[
    {
        name:"Random",
        icon:"./img/icons/pallette.png",
        photos:[
            {
                src:"./media/photos/linkin_park.jpg",
                caption:"Linkin Park",
                date:"2026-08-12",
            },
            {
                src:"./media/photos/camera.jpg",
                caption:"camera",
                date:"2026-08-12",
            },
            {
                src:"./media/photos/music_on_jerk_off.jpg",
                caption:"music on jerk off",
                date:"2026-08-13",
            }
        ]
    },
    {
        name:"Old photos",
        icon:"./img/icons/backup.png",
        photos:[
            {
                src:"./media/photos/chou.jpg",
                caption:"Chou",
                date:"2026-08-12",
            },
            {
                src:"./media/photos/labtarg.jpg",
                caption:"labtarg",
                date:"2026-08-12",
            }
        ]
    },
    {
        name:"Nature",
        icon:"./img/icons/flower.png",
        photos:[
            {
                src:"./media/photos/sliding_tcesni.jpg",
                caption:"sliding tcesni",
                date:"2026-08-12",
            },
            {
                src:"./media/photos/sun.jpg",
                caption:"sun",
                date:"2026-08-12",
            }
        ]
    },
    {
        name:"Game stuff",
        icon:"./img/icons/games.png",
        photos:[
            {
                src:"./media/photos_other/big_planet.jpg",
                caption:"big planet",
                date:"2026-08-12",
            },
            {
                src:"./media/photos_other/mercer.jpg",
                caption:"Mercer",
                date:"2026-08-12",
            }
        ]
    }
]

var notes=[
    {
        title:"Skateboard",
        content:"<h1>Learning Skateboarding</h1>",
        thumbnail:"./media/photos_other/skateboard.jpg",
        short_description: "Learning Skateboarding",
        date:"2026-08-11",
    },
    {
        title:"Tea",
        content:"<h1>Chai Tea Is good sometimes</h1>",
        thumbnail:"",
        short_description: "Chai Tea Is good sometimes",
        date:"2026-08-11",
    }
]

function previewNote(ind) {
        document.querySelector(`.overlay-black`).style.display="";
        document.querySelector(`.overlay-black .note-preview`).style.display="";
        document.querySelector(`.overlay-black .note-preview .header span.title`).innerHTML=notes[ind].title;
        document.querySelector(`.overlay-black .note-preview .inner-content h1.title`).innerHTML=notes[ind].title;
        document.querySelector(`.overlay-black .note-preview .inner-content .markdown-content`).innerHTML=notes[ind].content;
        document.querySelector(`.overlay-black .note-preview .inner-content span.date`).innerHTML=notes[ind].date;
    }

function previewImage(image) {
    document.querySelector(`.overlay-black`).style.display="";
    document.querySelector(`.overlay-black .image-preview`).style.display="";
    document.querySelector(`.overlay-black .image-preview .inner-content img.main`).src=image;
}

function showHiddenLinks() {
    const style = document.createElement('style');
    style.innerHTML = `
        .nts-hide {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    console.log("NTS elements are now visible.");
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector(`span.profilename`).innerHTML=config.name;
    document.querySelector(`span.profilestatus`).innerHTML=config.status;
    document.querySelector(`title`).innerHTML=`${config.name} - MyExpressiveProfile`;

    document.querySelectorAll(`button.tabber`).forEach(button => {
        button.addEventListener('click', function() {
            console.log(this.getAttribute('data-tabname'));
            document.querySelectorAll(`.tab-container`).forEach(tabcont => tabcont.style.display="none");

            document.querySelector(`.tab-container.${this.getAttribute('data-tabname')}`).style.display="";

            document.querySelectorAll(`button.tabber`).forEach(btn => btn.disabled = false);
            this.disabled=true;
        });
    })
    jmp9a=new JMediaPlayer9WidgetAgent("mediaplayerwidget");

    photo_albums.forEach(photo_album => {
        var new_node = document.querySelector(`.profile-photos .photos-album.template`).cloneNode(true);
        new_node.querySelector('.header img.icon').src=photo_album.icon;
        new_node.querySelector('.header span.title').innerHTML=photo_album.name;
        photo_album.photos.forEach(photo => {
            var photo_node=document.querySelector(`.profile-photos .photo.template`).cloneNode(true);
            photo_node.querySelector(`img.photo-main`).src=photo.src;
            photo_node.querySelector(`span.caption`).innerHTML=photo.caption;
            photo_node.classList.remove('template');
            photo_node.addEventListener('click', function() {
                previewImage(photo.src)
            })
            new_node.querySelector(`.album-content`).appendChild(photo_node)
        })
        new_node.classList.remove('template');
        document.querySelector(`.profile-photos .inner-content`).appendChild(new_node);
    })

    document.querySelectorAll(`.profile-photos .photos-album .header`).forEach(item => {
        item.addEventListener('click', function() {
            if(!this.parentElement.classList.contains("open")) this.parentElement.classList.add("open");
            else {this.parentElement.classList.remove("open")}
        })
    })

    var cnt=0;
    notes.forEach(note => {
        var new_node = document.querySelector(`.note-item.template`).cloneNode(true);
        new_node.classList.remove("template");
        new_node.querySelector(`h1.title`).innerHTML=note.title;
        new_node.querySelector(`.date-header span`).innerHTML=note.date;
        new_node.dataset.index=cnt;
        cnt++;

        if(note.thumbnail!="") {
            new_node.querySelector(`img.thumb`).style.display="";
            new_node.querySelector(`img.thumb`).src=note.thumbnail;
        }
        else if(note.short_description!="") {
            new_node.querySelector(`p.short-description`).style.display="";
            new_node.querySelector(`p.short-description`).innerHTML=note.short_description;
        }

        document.querySelector(`.profile-notes .inner-content`).appendChild(new_node);
    });

    document.querySelectorAll(`.note-item`).forEach(item => {
        item.addEventListener('click', function() {
            previewNote(item.dataset.index)
        })
    })
});
