const images = document.querySelector('#images');
const modal = document.querySelector('#modal');
const arrowLeft = document.querySelector("#leftArrow");
const arrowRight = document.querySelector("#rightArrow");

let pics = [];
let originX = null;
let currentIndex = null;

const createImage = (path, descriptions) => {
    const image = document.createElement('img');
    image.src = path;
    image.alt = descriptions;
    return image;
}
const onImageClick = (event) => {
    currentIndex = event.currentTarget.dataset.index;
    const image = createImage(event.currentTarget.src);
    
    modal.innerHTML = `
        <span class="fas fa-chevron-left arrow arrow--left" id="leftArrow"></span>
        <span class="fas fa-chevron-right arrow arrow--right" id="rightArrow"></span>
    `;
    
    image.addEventListener('pointerdown', startSwipe);
    image.addEventListener('pointermove', swiping);
    image.addEventListener('pointerup', stopSwipe);
    
    arrowLeft.addEventListener('pointerup', moveLeft);
    arrowRight.addEventListener('pointerup', moveRight);
    
    modal.appendChild(image);
    document.body.classList.add('no-scroll');
    modal.classList.remove('hidden');
    image.classList.remove('thumbnail');
}
function moveLeft(event){
    event.preventDefault();
    event.stopPropagation();
    let nextIndex = currentIndex;
    
    nextIndex++;
    if(nextIndex < 0){
        event.currentTarget.style.transform = '';
        return;
    }
    
    currentIndex = nextIndex;
}
function moveRight(event){
    event.preventDefault();
    event.stopPropagation();
    let nextIndex = currentIndex;
    
    nextIndex--;
    if(nextIndex === pics.length){
        event.currentTarget.style.transform = '';
        return;
    }
    
    currentIndex = nextIndex;
}
function startSwipe(event) {
    event.preventDefault();
    event.stopPropagation();
    originX = event.clientX;
    
    event.target.setPointerCapture(event.pointerId);
}

function swiping(event) {
    if(originX) {
        let delta = event.clientX - originX;
        const element = event.currentTarget;
        element.style.transform = 'translateX(' + delta + ')';
    }
}
function stopSwipe(event) {
    if(!originX){
        return;
    }
    
    let nextIndex = currentIndex;
    
    const currentX = event.clientX;
    const delta = currentX - originX;
    const photoSrc = pics[nextIndex];
    const image = createImage(photoSrc);
    
    console.log('stop clientX', event.clientX);
    console.log('stop delta', delta);
    
    originX = null;
    if(Math.abs(delta) < 100){
        event.currentTarget.style.transform = '';
        return;
    }
    if(delta < 0) {
        nextIndex++;
        image.classList.add('animate-next');
    } else {
        nextIndex--;
        image.classList.add('animate-prev');
    }
    
    if(nextIndex < 0 || nextIndex === pics.length){
        event.currentTarget.style.transform = '';
        return;
    }
    
    modal.innerHTML = `
        <span class="fas fa-chevron-left arrow arrow--left" id="leftArrow"></span>
        <span class="fas fa-chevron-right arrow arrow--right" id="rightArrow"></span>
    `;

    image.addEventListener('pointerdown', startSwipe);
    image.addEventListener('pointermove', swiping);
    image.addEventListener('pointerup', stopSwipe);
    
    arrowLeft.addEventListener('pointerup', moveLeft);
    arrowRight.addEventListener('pointerup', moveRight);
    
    modal.appendChild(image);

    currentIndex = nextIndex;
}


function onModalClick(){
    document.body.classList.remove('no-scroll');
    modal.classList.add('hidden');
    modal.innerHTML = '';
}
function addPhotos(json) {
    images.innerHTML = '';
    let description = [];
    for (i in json){
        let photo = json[i];
        if (photo.hasOwnProperty('urls')){
            pics.push(photo.urls.regular);
            if(photo.description !== null){
                description.push(photo.description);
            } else{
                description.push('Description is unavailable');
            }
        }
        
    }
    
    for(let [i, imagePath] of pics.entries()){
        const image = createImage(imagePath, description[i]);
        image.dataset.index = i;
        image.addEventListener('pointerdown', onImageClick);
        image.classList.add('thumbnail');
        images.appendChild(image);
        
    }
}

function fetchPhotos() {
    fetch('https://api.unsplash.com/photos/random?count=20', {
		method: 'GET',
		headers: {
            "Authorization": "Client-ID ea4650647e3cbefc7ab252a37048c157defca3b4856f0e3693c3061ac80fa5d8"
		}}).then(response => response.json())
        .then(data => {
            addPhotos(data);
        });
}
modal.addEventListener('pointerdown', onModalClick);
fetchPhotos();