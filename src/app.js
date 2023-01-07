import { mapListToDOMElements, createDOMElem } from './domInteractions.js';
import { getShowsByKey, getShowById } from './request.js';
class TvMaze{
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = 'Harry';
        this.regex = new RegExp(/<[a-z0-9]*>|<\/[a-z0-9]*>/,'gi');
        this.initializeApp();
    }
    
    initializeApp = () => {
        this.connectDomElements();
        this.setupListeners();
        this.fetchAndDisplayShows();
    }

    connectDomElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        const listOfShowNames = Array.from(
            document.querySelectorAll('[data-show-name]'))
        .map(elem => elem.dataset.showName);
        this.viewElems = mapListToDOMElements(listOfIds, 'id');
        this.showNameButtons = mapListToDOMElements(listOfShowNames,'data-show-name');
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach( showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        });
        this.viewElems.showSearchInput.addEventListener('keydown', this.handleSubmit);
        this.viewElems.showSearchButton.addEventListener('click', this.handleSubmit);
    }

    setCurrentNameFilter = (event) => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
        this.viewElems.showSearchInput.value = "";
    }
    
    handleSubmit = event => {
        if (event.type === "click" || event.key === "Enter"){
            event.preventDefault();
            if (this.viewElems.showSearchInput.value) {
                getShowsByKey(this.viewElems.showSearchInput.value).then(shows => this.renderCardsOnList(shows));
            }
        }}

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows));
    }

    renderCardsOnList = shows => {
        Array.from(
            document.querySelectorAll('[data-show-id]')
        ).forEach(btn => removeEventListener('click', this.openDetailsView))
        
        this.viewElems.showsWrapper.innerHTML = "";

        for (const { show } of shows) {
            const card = this.createShowCard(show);
            this.viewElems.showsWrapper.appendChild(card);
        }
    }

    openDetailsView = event => {
        const { showId } = event.target.dataset;
        if (this.viewElems.showPreview.style.display != "block") {
            getShowById(showId).then(show => {
                const card = this.createShowCard(show, true);
                this.viewElems.showPreview.appendChild(card);
                this.viewElems.showPreview.style.display = 'block';
            })
        }
    }

    closeDetailsView = event => {
        const { showId } = event.target.dataset;
        const closedBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`);
        closedBtn.removeEventListener('click',this.closeDetailsView)
        this.viewElems.showPreview.style.display = 'none';
        this.viewElems.showPreview.innerHTML = '';
    }
    
    createShowCard = ( show, isDetailed ) => {
        const divCard = createDOMElem('div', 'card');
        const divCardBody = createDOMElem('div', 'card-body');
        const h5 = createDOMElem('h5', 'card-title', show.name);
        let img, p, btn;

        if (isDetailed) {
            btn = createDOMElem('button', 'btn btn-danger', 'Close details');
        } else {
            btn = createDOMElem('button', 'btn btn-primary', 'Open details');
        }
        
        if (show.image) {
            if (isDetailed) {
                img = createDOMElem('div', 'card-preview-bg');
                img.style.backgroundImage = `url('${show.image.original}')`;
            } else {
                img = createDOMElem('img', 'card-img-top', null, show.image.medium);
            }
        } else {
            if (isDetailed) {
                img = createDOMElem('div', 'card-preview-bg');
                img.style.backgroundImage = `url('https://dummyimage.com/800x300/ccc/9c9c9c.png')`;
            } else {
                img = createDOMElem('img', 'card-img-top', null, "https://via.placeholder.com/210x295");
            }
        }
        
        if (show.summary) { 
            //show.summary = show.summary.replace(/<\/?[^>]+(>|$)/g, "");
            //show.summary = show.summary.replace(this.regex,"")
            if (isDetailed) {
                p = createDOMElem('p', 'card-text', show.summary.replace(this.regex,""));
            } else {
                p = createDOMElem('p', 'card-text', `${show.summary.slice(0,80).replace(this.regex,"")}...`);
            }
        } else {
            p = createDOMElem('p', 'card-text', 'There is no summary for that show yet.');
        }

        btn.dataset.showId = show.id;

        if (isDetailed) {
            btn.addEventListener('click', this.closeDetailsView)
        } else {
            btn.addEventListener('click', this.openDetailsView)
        }

        divCard.appendChild(img);
        divCardBody.appendChild(h5);
        divCardBody.appendChild(p);
        divCardBody.appendChild(btn);
        divCard.appendChild(divCardBody);

        return divCard;
    }
}

document.addEventListener('DOMContentLoaded',new TvMaze());