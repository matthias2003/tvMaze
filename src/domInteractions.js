const _getDOMElem = id => {
    return document.getElementById(id)
}

export const mapListToDOMElements = listof => {
    const _viewElems = {}

    for (const id of listof) 
    {
        _viewElems[id] = _getDOMElem(id);
    }
    return _viewElems;
}