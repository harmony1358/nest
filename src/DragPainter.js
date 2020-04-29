import LayoutDistributable from "./LayoutDistributable.js";

class DragPainter {

    static paintHelper (interactionLayer, x, y, transferrableObject, dropTarget, debugTargets) {

        let rect = transferrableObject.rect;
        
        interactionLayer.clear();

        if (dropTarget !== null) {
            interactionLayer.ctx.strokeStyle = 'yellow';
            interactionLayer.ctx.lineWidth = 3;
            interactionLayer.ctx.beginPath();
            interactionLayer.ctx.rect(dropTarget.rect.x+.5, dropTarget.rect.y+.5, dropTarget.rect.width, dropTarget.rect.height);
            interactionLayer.ctx.stroke();

            const firstRect = {...dropTarget.rect};
            const lastRect = {...dropTarget.rect};

            if (dropTarget.target.direction === LayoutDistributable.DIRECTION_VERTICAL) {
                firstRect.height = firstRect.height / 3;
                lastRect.y = lastRect.y + lastRect.height - lastRect.height / 3;
                lastRect.height = lastRect.height / 3;
            } else {
                firstRect.width = firstRect.width / 3;
                lastRect.x = lastRect.x + lastRect.width - lastRect.width / 3;
                lastRect.width = lastRect.width / 3;
            }

            interactionLayer.ctx.fillStyle = '#ffff0060';

            if (dropTarget.position === 'first') {
                interactionLayer.ctx.fillRect(firstRect.x, firstRect.y, firstRect.width, firstRect.height);
            } else {
                interactionLayer.ctx.fillRect(lastRect.x, lastRect.y, lastRect.width, lastRect.height);
            }
        }

        interactionLayer.ctx.strokeStyle = 'rgb(232, 0, 82)';
        interactionLayer.ctx.lineWidth = 3;
        interactionLayer.ctx.beginPath();
        interactionLayer.ctx.rect(x, y, rect.width, rect.height);
        interactionLayer.ctx.stroke();
    }

}

export default DragPainter;