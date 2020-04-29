import LayoutDistributable from './LayoutDistributable.js';
class LayoutCell extends LayoutDistributable {

    constructor(context) {

        super(context);

        this._type              = 'LayoutCell';
        this._name              = 'Unnamed';

        this._acceptsFlavours   = ['LayoutComponent'];
        this._isDropTarget      = true;

    }

    get type()                  {return this._type;}
    get name()                  {return this._name;}
    set name(name)              {this._name = name;}

    get acceptsFlavours()       {return this._acceptsFlavours;}
    set acceptsFlavours(flavs)  {this._acceptsFlavours = flavs;}
  
    //Drop Target Interface
    getDropTargets (flavours, targets)   {

        if (this.isDropTarget) {

            for (let i=0; i<flavours.length; i++) {
                if (this.acceptsFlavours.indexOf(flavours[i])>-1) {

                    this._createDropTargets(flavours, targets);

                    break;
                }
            }

        }

        this.children.forEach((c)=>{

            c.getDropTargets(flavours, targets);

        });

    }

    _createDropTargets (flavours, targets) {

        let firstRect, lastRect;

        firstRect = {...this.rect};
        lastRect = {...this.rect};

        if (this.direction === LayoutDistributable.DIRECTION_VERTICAL) {
            firstRect.height = firstRect.height / 2;            
            lastRect.y = lastRect.y + lastRect.height / 2;
            lastRect.height = lastRect.height / 2;
        } else {
            firstRect.width = firstRect.width / 2;            
            lastRect.x = lastRect.x + lastRect.width / 2;
            lastRect.width = lastRect.width / 2;
        }

        const firstAnchor = {x: firstRect.x+firstRect.width/2, y: firstRect.y+firstRect.height/2};
        const lastAnchor = {x: lastRect.x+lastRect.width/2, y: lastRect.y+lastRect.height/2};

        targets.push({
            flavours: this.acceptsFlavours,
            rect: {...this.rect},
            anchor: firstAnchor,
            target: this,
            position: 'first'
        });

        targets.push({
            flavours: this.acceptsFlavours,
            rect: {...this.rect},
            anchor: lastAnchor,
            target: this,
            position: 'last'
        });
    }

    onDrop (transferrableObject, target) {

        //Cannot drop on self
        if (transferrableObject.id==target.before) return;
        
        this.setActualToPreferred();

        if (target.position === 'first') {
            this.children.unshift(transferrableObject);
            this.context.layoutManager.doLayout();
        } else {
            this.children.push(transferrableObject);
            this.context.layoutManager.doLayout();
        }
    }

}

export default LayoutCell;