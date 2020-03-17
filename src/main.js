import Style from '../res/style.css';
import ApplicationContext from './ApplicationContext.js';
import LayoutManager from './LayoutManager.js';
import LayoutComponent from './LayoutComponent.js';
import LayoutDistributable from './LayoutDistributable.js';
import ExampleComponent from './ExampleComponent.js';
import LayoutCell from './LayoutCell.js';
import ExampleStyle from '../res/example.css';

let app = new ApplicationContext();

app.init('stage', true);

let mainRow = new LayoutCell(app);
mainRow.isDropTarget = false;
let leftColumn = new LayoutCell(app);
let rightColumn = new LayoutCell(app);
let centerColumn = new LayoutCell(app);

leftColumn.name = 'LEFTC';
centerColumn.name = 'CENTERC';
rightColumn.name = 'RIGHTC';

leftColumn.direction = LayoutDistributable.DIRECTION_VERTICAL;
centerColumn.direction = LayoutDistributable.DIRECTION_VERTICAL;
rightColumn.direction = LayoutDistributable.DIRECTION_VERTICAL;

leftColumn.growStyle = LayoutDistributable.GROW_FIXED;
rightColumn.growStyle = LayoutDistributable.GROW_FIXED;

let comp1 = new ExampleComponent(app);
let comp2 = new ExampleComponent(app);
let comp3 = new ExampleComponent(app);
let comp4 = new ExampleComponent(app);
let comp5 = new ExampleComponent(app);
let comp6 = new ExampleComponent(app);
let comp7 = new ExampleComponent(app);
let comp8 = new ExampleComponent(app);

let compFH = new ExampleComponent(app);

//leftColumn.addChild(comp1);
leftColumn.addChild(compFH, true);
leftColumn.addChild(comp2, true);
leftColumn.addChild(comp3, true);
centerColumn.addChild(comp4, true);
centerColumn.addChild(comp5, true);
rightColumn.addChild(comp6, true);
rightColumn.addChild(comp7, true);
rightColumn.addChild(comp8, true);

compFH.minSize.height = 70;
compFH.maxSize.height = 70;
compFH.preferredSize.height = 70;
compFH.growStyle = LayoutDistributable.GROW_FIXED;

comp2.minSize.height = 70;
comp2.maxSize.height = 200;
comp2.preferredSize.height = 200;
comp2.growStyle = LayoutDistributable.GROW_FIXED;

comp4.preferredSize.height = 800;
comp4.preferredSize.width = 800;
comp5.preferredSize.height = 200;
comp5.preferredSize.width = 200;

compFH.name = 'Fixed Height';
comp1.name ='One'; comp2.name ='Two'; comp3.name ='Three'; comp4.name ='Four';
comp5.name ='Five'; comp6.name ='Six'; comp7.name ='Seven'; comp8.name ='Eight';

//comp5.growStyle = LayoutCell.GROW_FIXED;

//create buttons
let liveUpdateButton = document.createElement('DIV');
liveUpdateButton.textContent = 'Toggle Live';
liveUpdateButton.classList.add(ExampleStyle.button);
liveUpdateButton.addEventListener('click', ()=>{ 

    app.interactionManager.handlerInteractor.liveUpdate = app.interactionManager.handlerInteractor.liveUpdate ? false: true; 

});

let suggestHandlersButton = document.createElement('DIV');
suggestHandlersButton.textContent = 'Toggle Suggest';
suggestHandlersButton.classList.add(ExampleStyle.button);
suggestHandlersButton.addEventListener('click', ()=>{ 

    app.interactionManager.handlerInteractor.suggestHandlers = app.interactionManager.handlerInteractor.suggestHandlers ? false: true; 

});

// let startDragButton = document.createElement('DIV');
// startDragButton.textContent = 'Drag';
// startDragButton.classList.add(ExampleStyle.button);
comp3.body.addEventListener('mousedown', (e)=>{ 

    app.interactionManager.dragInteractor.startDraggingTransferrable (e, comp3);

});

compFH.body.addEventListener('mousedown', (e)=>{
    app.interactionManager.dragInteractor.startDraggingTransferrable(e, compFH);
});

comp4.body.addEventListener('click', (e)=>{
    centerColumn.direction = LayoutDistributable.DIRECTION_VERTICAL;
    app.layoutManager.doLayout();
});

comp5.body.addEventListener('click', (e)=>{
    centerColumn.direction = LayoutDistributable.DIRECTION_HORIZONTAL;
    app.layoutManager.doLayout();
});

comp2._innerDiv.appendChild(liveUpdateButton);
//comp3._innerDiv.appendChild(startDragButton);
comp7._innerDiv.appendChild(suggestHandlersButton);

mainRow.addChild(leftColumn, true);
mainRow.addChild(centerColumn, true);
mainRow.addChild(rightColumn, true);

app.layoutManager.model = mainRow;
app.layoutManager.doLayout();

compFH.body.style.backgroundColor = '#2e64c3';