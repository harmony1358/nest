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

        const topRect = {...this.rect};
        topRect.height = topRect.height / 2;

        const bottomRect = {...topRect};
        bottomRect.y = bottomRect.y + topRect.height;

        
        targets.push({
            flavours: this.acceptsFlavours,
            rect: topRect,
            anchor: {x: topRect.x+topRect.width/2, y: topRect.y+topRect.height/2},
            target: this,
            position: 'first'
        });

        targets.push({
            flavours: this.acceptsFlavours,
            rect: bottomRect,
            anchor: {x: bottomRect.x+bottomRect.width/2, y: bottomRect.y+bottomRect.height/2},
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