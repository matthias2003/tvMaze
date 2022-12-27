import { mapListToDOMElements, createDOMElem } from './domInteractions.js';
import { getShowsByKey, getShowById } from './request.js';
class TvMaze{
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = 'Harry';
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
    }
    
    handleSubmit = event => { // sprawdzić renderCardsOnList i przerobić to/ jak pusty input przesłany to zeruje kart ogarnąć to!!!
        if (event.type === "click" || event.key === "Enter"){
            getShowsByKey(this.viewElems.showSearchInput.value).then(shows => this.renderCardsOnList(shows));
            event.preventDefault();
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
        getShowById(showId).then(show => {
            const card = this.createShowCard(show, true);
            this.viewElems.showPreview.appendChild(card);
            this.viewElems.showPreview.style.display = 'block';
        })
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
        const btn = createDOMElem('button', 'btn btn-primary', 'Show details');
        let img, p;

        if (show.image) {
            if (isDetailed) {
                img = createDOMElem('div', 'card-preview-bg');
                img.style.backgroundImage = `url('${show.image.original}')`;
            } else {
                img = createDOMElem('img', 'card-img-top', null, show.image.medium);
            }
        } else {
            img = createDOMElem('img', 'card-img-top', null, "https://via.placeholder.com/210x295");
        }
        
       
        if (show.summary) { 
            show.summary = show.summary.replace(/<\/?[^>]+(>|$)/g, "");
            if (isDetailed) {
                p = createDOMElem('p', 'card-text', show.summary);
            } else {
                p = createDOMElem('p', 'card-text', `${show.summary.slice(0,80)}...`);
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