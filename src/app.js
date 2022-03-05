import { mapListToDOMElements } from './domInteractions.js';
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
        console.log(event)
    }
}

document.addEventListener('DOMContentLoaded',new TvMaze());

