class DragPainter {

    static paintHelper (interactionLayer, x, y, transferrableObject, dropTarget, debugTargets) {

        let rect = transferrableObject.rect;

        interactionLayer.clear();
        interactionLayer.ctx.strokeStyle = 'rgb(232, 0, 82)';
        interactionLayer.ctx.fillStyle = 'black';
        interactionLayer.ctx.lineWidth = 3;
        interactionLayer.ctx.beginPath();
        interactionLayer.ctx.rect(x, y, rect.width, rect.height);
        interactionLayer.ctx.stroke();

        if (dropTarget==null) return;
        interactionLayer.ctx.strokeStyle = 'yellow';
        interactionLayer.ctx.beginPath();
        interactionLayer.ctx.rect(dropTarget.rect.x, dropTarget.rect.y, dropTarget.rect.width, dropTarget.rect.height);
        interactionLayer.ctx.stroke();
    }

}

export default DragPainter;