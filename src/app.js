import { mapListToDOMElements, createDOMElem } from './domInteractions.js';
import { getShowsByKey } from './request.js';
class TvMaze{
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = 'harry';
        this.initializeApp();
        this.setupListeners();
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
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        });
    }

    setCurrentNameFilter = (event) => {
        this.selectedName = event.target.dataset.showName;
    }
    
    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCards(shows));
    }
   
    renderCards = shows => {
        for (const { show } of shows) {
            this.createShowCard(show);
        }
    }

    createShowCard = show => {
        console.log(show)
        
        const divCard = createDOMElem('div','card');
        const divCardBody = createDOMElem('div','card-body');
        const h5 = createDOMElem('h5','card-title', show.name);
        const p = createDOMElem('p','card-text', show.summary);
        const btn = createDOMElem('button','btn btn-primary', 'Show details');

        if (show.image == null) {
            const img = createDOMElem('img','card-img-top', null, "./photos/under.png");
            divCard.appendChild(img);
        }

        else {
            const img = createDOMElem('img','card-img-top', null, show.image.medium);
            divCard.appendChild(img);

        }

        divCard.appendChild(divCardBody);
        
        divCard.appendChild(h5);
        divCard.appendChild(p);
        divCard.appendChild(btn);

      
        this.viewElems.showsWrapper.appendChild(divCard);

    }
}

document.addEventListener('DOMContentLoaded',new TvMaze());