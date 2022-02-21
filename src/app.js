import { mapListToDOMElements } from './domInteractions.js';
class TvMaze{
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = 'harry';
        this.initializeApp();
    }
    
    initializeApp = () => {
        this.connectDomElements();
    }

    connectDomElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        const listOfShowNames = Array.from(
            document.querySelectorAll('[data-show-name]'))
        .map(elem => elem.dataset.showName);

        this.showNameButtons = mapListToDOMElements(listOfShowNames);
        this.viewElems = mapListToDOMElements(listOfIds);
    }
}

document.addEventListener('DOMContentLoaded',new TvMaze());